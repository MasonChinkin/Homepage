import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'
import { merge } from 'webpack-merge'
import prod from './webpack.prod'

const config = merge(prod, {
  plugins: [
    new RsdoctorWebpackPlugin({
      disableClientServer: false,
      features: ['bundle', 'plugins', 'loader', 'resolver'],
    }),
  ],
})

export default config
