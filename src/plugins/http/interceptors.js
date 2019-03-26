export default (http, store) => {
  // https://github.com/mzabriskie/axios#interceptors
  http.interceptors.response.use(
    response => response,
    /**
     * Ponto central para lidar com qualquer erro
     * gerado pela request HTTP
     */
    (error) => {
      const { response } = error;

      if ([403].indexOf(response.status) !== -1) {
        store.dispatch('setScreen', 'Blocked');
      }

      return Promise.reject(response);
    },
  );
};
