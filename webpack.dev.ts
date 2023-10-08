// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="node_modules/webpack-dev-server/types/lib/Server.d.ts"/>

import { merge } from 'webpack-merge'
import path from 'path'
import prod from './webpack.prod.ts'

const config = merge(prod, {
  mode: 'development',
  devServer: {
    compress: true,
    port: 8000,
    open: true,
  },
})

export default config
