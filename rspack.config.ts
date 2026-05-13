import { rspack, type Configuration } from '@rspack/core'
import path from 'path'
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin'

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.tsx',
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  cache: true,
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        emotion: {
          test: /[\\/]node_modules[\\/]@emotion[\\/]/,
          name: 'emotion',
          priority: 40,
        },
        d3: {
          test: /[\\/]node_modules[\\/]d3[-]/,
          priority: 30,
          reuseExistingChunk: true,
          enforce: true,
        },
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
    extensions: ['.ts', '.tsx', '.js', '.jpg', '.png', '.webp', '.svg'],
    tsConfig: path.resolve(__dirname, 'tsconfig.json'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: { syntax: 'typescript', tsx: true },
            transform: {
              react: {
                runtime: 'automatic',
                importSource: '@emotion/react',
              },
            },
            target: 'es2022',
          },
        },
      },
      {
        test: /\.(webp|png|jpe?g|svg)$/i,
        type: 'asset',
      },
    ],
  },
  performance: {
    assetFilter: (assetFilename: string) => assetFilename.endsWith('.js'),
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './public/index.base.html',
      favicon: './public/fav.ico',
      filename: 'index.html',
      hash: true,
      inject: 'head',
      scriptLoading: 'defer',
      minify: true,
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        { from: 'public/_headers', to: '.' },
        { from: 'public/data', to: 'data' },
      ],
    }),
    new TsCheckerRspackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
    }),
  ],
}

export default config
