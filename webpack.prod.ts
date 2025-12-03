import PreloadWebpackPlugin from '@vue/preload-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
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
    publicPath: '/',
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
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        // Emotion packages - CSS-in-JS (heavy)
        emotion: {
          test: /[\\/]node_modules[\\/]@emotion[\\/]/,
          name: 'emotion',
          priority: 40,
        },
        // Router packages
        router: {
          test: /[\\/]node_modules[\\/]react-router/,
          name: 'router',
          priority: 35,
        },
        // D3 visualization packages (heavy)
        d3: {
          test: /[\\/]node_modules[\\/]d3/,
          name: 'd3',
          priority: 30,
        },
        // Animation packages
        animation: {
          test: /[\\/]node_modules[\\/](framer-motion|react-css-transition-replace)/,
          name: 'animation',
          priority: 25,
        },
        // Radix UI components
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix',
          priority: 20,
        },
        // Remaining vendor code
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
        },
        // Common code shared across chunks
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
      inject: 'head',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public/_redirects', to: '.' }],
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
    // DISABLED: modulepreload causes race condition with import map
    // The browser can start executing preloaded modules before the import map
    // is parsed, causing "Failed to resolve module specifier" errors.
    // Regular <script type="module"> tags are sufficient and won't race.
    // new PreloadWebpackPlugin({
    //   rel: 'modulepreload',
    //   as: 'script',
    //   include: 'initial',
    //   fileBlacklist: [/\.map$/, /\.png$/, /\.webp$/, /\.jpg$/],
    // }),
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
