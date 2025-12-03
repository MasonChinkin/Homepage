import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import prod from './webpack.prod.ts'

const config = merge<
  Configuration | (Configuration & { devServer: Record<string, unknown> })
>(prod, {
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
})

export default config
