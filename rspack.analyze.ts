import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import prod from './rspack.config'

const config = {
  ...prod,
  plugins: [
    ...(prod.plugins ?? []),
    new RsdoctorRspackPlugin({
      disableClientServer: false,
    }),
  ],
}

export default config
