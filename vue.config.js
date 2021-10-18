/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pages: {
    index: {
      entry: './examples/app.js'
    }
  },
  configureWebpack: {
    entry: {
      app: [
        './examples/app.js'
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    https: false,
    allowedHosts: [
        'localhost'
    ]
  }
}
