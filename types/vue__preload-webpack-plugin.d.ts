declare module '@vue/preload-webpack-plugin' {
  import { Compiler } from 'webpack'

  interface PreloadPluginOptions {
    rel?: 'preload' | 'prefetch' | 'modulepreload'
    as?: string | ((entry: string) => string)
    include?: string | string[] | 'allChunks' | 'initial' | 'asyncChunks'
    exclude?: string[]
    fileBlacklist?: RegExp[]
    fileWhitelist?: RegExp[]
  }

  class PreloadWebpackPlugin {
    constructor(options?: PreloadPluginOptions)
    apply(compiler: Compiler): void
  }

  export = PreloadWebpackPlugin
}
