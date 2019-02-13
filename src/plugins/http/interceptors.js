export default (http) => {
  // https://github.com/mzabriskie/axios#interceptors
  http.interceptors.response.use(
    response => response,
    /**
     * Ponto central para lidar com qualquer erro
     * gerado pela request HTTP
     */
    (error) => {
      const { response } = error;

      return Promise.reject(response);
    },
  );
};
