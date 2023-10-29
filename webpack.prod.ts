import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'
import { getExternals, getTemplateParameters } from './externalizedLibs'

const isProduction = process.env.NODE_ENV === 'production'

const config: Configuration = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js', '.jpg', '.png', '.webp', '.svg'],
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
  ],
}

export default config
