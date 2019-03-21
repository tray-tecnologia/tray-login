export default {
  methods: {
    /**
     * @param {string} childrenName
     * @param {object} data
     *
     * @returns {object, object[property]}
     */
    getChildrenData(childrenName = '', data = {}) {
      const component = this.$children.find(children => children.$options.name === childrenName);

      if (data) {
        return component[data];
      }

      return component;
    },

    /**
     * Redirecionar o usuario para a url definida no callback
     *
     * @param {string} callback
     * @param {string} token
     */
    redirect(callback = '', token = '') {
      if (!callback) {
        return;
      }

      let redirectParam = '';

      if (token) {
        redirectParam = `?token=${token}`;
        if (callback.indexOf('?') > -1) {
          redirectParam = `&token='${token}`;
        }
      }

      window.location = callback + redirectParam;
    },
  },
};
