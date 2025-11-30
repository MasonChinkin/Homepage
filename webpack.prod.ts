import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'
import { ImportMapPlugin } from './webpack-importmap-plugin'

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.tsx',
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    module: true,
    chunkFormat: 'module',
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  cache: {
    type: 'filesystem',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js', '.jpg', '.png', '.webp', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2022',
              jsxImportSource: '@emotion/react',
            },
          },
        ],
      },
      {
        test: /\.(webp|png|jpe?g|svg)$/i,
        type: 'asset',
      },
    ],
  },
  externalsType: 'module',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.base.html',
      favicon: './public/fav.ico',
      filename: 'index.html',
      hash: true,
      scriptLoading: 'module',
    }),
    new ImportMapPlugin([
      { name: 'react', version: '19.2.0' },
      { name: 'react', version: '19.2.0', path: 'jsx-runtime' },
      { name: 'react-dom', version: '19.2.0', peers: ['react'] },
      {
        name: 'react-dom',
        version: '19.2.0',
        path: 'client',
        peers: ['react'],
      },
    ]),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ],
}

export default config
