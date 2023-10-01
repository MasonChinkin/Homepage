import { merge } from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import prod from './webpack.prod'

const config = merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
})

export default config
