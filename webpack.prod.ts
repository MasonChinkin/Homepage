import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'

const config: Configuration = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: true,
    }),
    new GenerateSW({
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [
        {
          urlPattern: ({ url }) => {
            const alwaysCache = [
              'https://use.fontawesome.com/releases/v5.7.0/css/all.css',
              'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
              'https://fonts.googleapis.com/icon?family=Material+Icons',
              'https://fonts.googleapis.com/css?family=Roboto',
            ]

            if (alwaysCache.includes(url.toString())) {
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
  ],
}

export default config
