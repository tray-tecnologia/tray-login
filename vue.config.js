const path = require('path');

module.exports = {
  devServer: {
    proxy: 'https://easycentralqa.commercesuite.com.br/',
  },
  css: {
    extract: false,
  },
  configureWebpack: {
    output: {
      filename: () => 'tray-login.js',
    },
    optimization: {
      splitChunks: false,
    },
  },
  chainWebpack(config) {
    const apiClient = process.env.VUE_APP_API_CLIENT;
    config.resolve.alias.set(
      'api-client',
      path.resolve(__dirname, `src/api/${apiClient}`),
      /**
       * @todo
       * forçar a usar o server em ambientes de teste conectado com outra loja
       */
      // path.resolve(__dirname, `src/api/server`),
    );
  },
};
