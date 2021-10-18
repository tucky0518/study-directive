// 从https://webpackjs.com官网照着配置
const path = require('path');
module.exports = {
  // 模式,生产
  // mode: 'development',
  // 入口
  entry: './src/index.js',
  // 出口
  output: {
    // 虚拟打包的路径,bundles.js文件没有真正的生成
    publicPath: 'xuni',
    // 打包到什么文件
    filename: 'bundle.js'
  },
  // 配置一下webpack-dev-server
  devServer: {
    // 端口号
    port: 8080,
    // 静态文件根目录
    contentBase: 'www'
    // 不压缩
    // compress: false,
  }
};
