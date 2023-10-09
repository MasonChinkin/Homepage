import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import prod from './webpack.prod'

const config = merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
})

export default config
