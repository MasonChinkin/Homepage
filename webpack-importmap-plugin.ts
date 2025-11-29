import HtmlWebpackPlugin from 'html-webpack-plugin'
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
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'ImportMapPlugin',
        (data, cb) => {
          const isDev = compiler.options.mode === 'development'

          // Build import map
          const imports: Record<string, string> = {}
          const preloadLinks: string[] = []

          this.modules.forEach((mod) => {
            const moduleName = mod.path ? `${mod.name}/${mod.path}` : mod.name
            const url = this.getUrl(mod, isDev)
            imports[moduleName] = url

            // Generate preload link
            preloadLinks.push(
              `    <link rel="preload" href="${url}" as="script" crossorigin />`
            )
          })

          const importMapScript = `<script type="importmap">
      ${JSON.stringify({ imports }, null, 2)}
    </script>`

          // Inject preload links and import map into head
          const preloadSection = preloadLinks.join('\n')
          data.html = data.html.replace(
            '</head>',
            `${preloadSection}\n\n${importMapScript}\n  </head>`
          )

          cb(null, data)
        }
      )
    })
  }
}
