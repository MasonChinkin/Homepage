import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getExternals, getTemplateParameters } from './externalizedLibs'
import { GenerateSW } from 'workbox-webpack-plugin'

const isProduction = process.env.NODE_ENV === 'production'

const swPlugin = isProduction
  ? [
      new GenerateSW({
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              const fonts = [
                'https://use.fontawesome.com/releases/v5.7.0/css/all.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://fonts.googleapis.com/css?family=Roboto',
              ]

              if (fonts.includes(url.toString())) {
                return true
              }

              if (url.toString().includes('bundle.js?')) {
                return true
              }

              if (['.webp', 'png', 'jpg'].some(url.toString().includes)) {
                return true
              }

              return false
            },
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'StaleWhileRevalidate_Cache',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60 * 60,
                purgeOnQuotaError: true,
              },
            },
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      }),
    ]
  : []

const config: Configuration = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jpg', '.png', '.webp'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'esbuild-loader' }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(webp|png|jpe?g|svg)$/i,
        type: 'asset',
      },
    ],
  },
  externals: getExternals(),
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.base.html',
      favicon: './public/fav.ico',
      filename: 'index.html',
      hash: true,
      templateParameters: getTemplateParameters(isProduction),
    }),
    ...swPlugin,
  ],
}

export default config
