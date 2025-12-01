import HtmlWebpackPlugin, { HtmlTagObject } from 'html-webpack-plugin'
import { Compiler, ExternalItem } from 'webpack'

interface ImportMapModule {
  name: string
  version: string
  path?: string
  peers?: string[]
  dev?: boolean
}

export class ImportMapPlugin {
  private modules: ImportMapModule[]

  constructor(modules: ImportMapModule[]) {
    this.modules = modules
  }

  private getUrl(module: ImportMapModule, isDev: boolean): string {
    const devParam = isDev && module.dev !== false ? '?dev' : ''
    const peersParam = module.peers?.length
      ? `${devParam ? '&' : '?'}external=${module.peers.join(',')}`
      : ''
    const fullPath = module.path ? `/${module.path}` : ''

    return `https://esm.sh/${module.name}@${module.version}${fullPath}${devParam}${peersParam}`
  }

  apply(compiler: Compiler) {
    // Auto-configure webpack externals
    const externals: Record<string, string> = {}
    this.modules.forEach((mod) => {
      const moduleName = mod.path ? `${mod.name}/${mod.path}` : mod.name
      externals[moduleName] = moduleName
    })
    compiler.options.externals = externals as ExternalItem

    // Hook into HtmlWebpackPlugin to inject import map and preload links
    compiler.hooks.compilation.tap('ImportMapPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'ImportMapPlugin',
        (data, cb) => {
          const isDev = compiler.options.mode === 'development'

          // Build import map
          const imports: Record<string, string> = {}
          const preloadLinks: HtmlTagObject[] = []

          this.modules.forEach((mod) => {
            const moduleName = mod.path ? `${mod.name}/${mod.path}` : mod.name
            const url = this.getUrl(mod, isDev)
            imports[moduleName] = url

            // Generate preload link tag
            preloadLinks.push({
              tagName: 'link',
              voidTag: true,
              meta: {},
              attributes: {
                rel: 'preload',
                href: url,
                as: 'script',
                crossorigin: 'anonymous',
              },
            })
          })

          const importMapTag: HtmlTagObject = {
            tagName: 'script',
            innerHTML: `\n      ${JSON.stringify({ imports }, null, 2)}\n    `,
            voidTag: false,
            meta: {},
            attributes: {
              type: 'importmap',
            },
          }

          // CRITICAL: Insert import map BEFORE all module scripts and preloads
          // This ensures the import map is parsed before any modules execute,
          // even when scripts are loaded from cache.
          // All preload links (both from this plugin and PreloadWebpackPlugin)
          // must come AFTER the import map to prevent race conditions.

          // Filter out module scripts and ALL preload links
          const nonModuleNonPreloadTags = data.headTags.filter(
            (tag) =>
              (tag.tagName !== 'script' || tag.attributes?.type !== 'module') &&
              (tag.tagName !== 'link' ||
                (tag.attributes?.rel !== 'preload' &&
                  tag.attributes?.rel !== 'modulepreload'))
          )

          // Collect all preload links (from PreloadWebpackPlugin and this plugin)
          const allPreloadLinks = [
            ...data.headTags.filter(
              (tag) =>
                tag.tagName === 'link' &&
                (tag.attributes?.rel === 'preload' ||
                  tag.attributes?.rel === 'modulepreload')
            ),
            ...preloadLinks,
          ]

          // Collect module scripts
          const moduleScripts = data.headTags.filter(
            (tag) =>
              tag.tagName === 'script' && tag.attributes?.type === 'module'
          )

          data.headTags = [
            ...nonModuleNonPreloadTags,
            importMapTag,
            ...allPreloadLinks,
            ...moduleScripts,
          ]

          cb(null, data)
        }
      )
    })
  }
}
