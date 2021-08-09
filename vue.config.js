module.exports = {
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
  // 代码压缩
  // configureWebpack: {
  //   optimization: {
  //     minimize: false,
  //   },
  // },
  devServer: {
    open: true,

    host: '127.0.0.1',

    port: 8080,

    https: false,

    hotOnly: false,

    // 将任何未知请求 (没有匹配到静态文件的请求) 代理到该字段指向的地方 
    // proxy: {
    //   '': {
    //     target: '',
    //     changeOrigin: true,
    //     // pathRewrite: {
    //     //   '^/api': '/'
    //     // }
    //   },
    // },

    // before: app => {
    // }
  },
}
