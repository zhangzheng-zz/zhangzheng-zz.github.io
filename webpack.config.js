const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  // 打包两个版本
  entry: {
    "form-validator": "./src/index",
    "form-validator.min": "./src/index",
  },
  output: {
    filename: '[name].js',
    // 打包后库的名称
    library: 'Validator',
    // 可以通过 cmd amd ES6引入(或者通过script标签，用window.Validator引入)
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, "release")
  },
  // 只针对 min 文件进行压缩
  mode: "none",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        include: /\.min\.js/
      })
    ]
  }
}