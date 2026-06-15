import type { Configuration } from '@rspack/core'
import prod from './rspack.config'

const config: Configuration & {
  devServer: Record<string, unknown>
} = {
  ...prod,
  mode: 'development',
  devServer: {
    open: true,
    historyApiFallback: true,
    static: {
      directory: './public',
      publicPath: '/',
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
}

export default config
