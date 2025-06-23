const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false;
      return args;
    });
  },
  devServer: {
    proxy: {
      '/cgi-bin': {
        target: 'https://api.weixin.qq.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/cgi-bin': '/cgi-bin'
        }
      },
      '/wechat-api': {
        target: 'https://api.weixin.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/wechat-api': ''
        }
      }
    }
  }
})
