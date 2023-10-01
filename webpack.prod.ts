import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'

const isProduction = process.env.NODE_ENV === 'production'

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
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    bootstrap: 'bootstrap',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.base.html',
      filename: 'index.html',
      hash: true,
      templateParameters: {
        react: isProduction
          ? 'https://unpkg.com/react@18.2.0/umd/react.production.min.js'
          : 'https://unpkg.com/react@18.2.0/umd/react.development.js',
        reactDom: isProduction
          ? 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
          : 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js',
        bootstrap: isProduction
          ? 'https://unpkg.com/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
          : 'https://unpkg.com/bootstrap@5.3.2/dist/js/bootstrap.bundle.js',
      },
    }),
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

            return false
          },
          handler: 'CacheFirst',
          options: {
            cacheName: 'CacheFirst_Cache',
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
