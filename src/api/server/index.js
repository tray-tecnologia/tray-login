import { http } from '@/plugins/http';

export default {
  facebookLogin(endpoint, params) {
    return http.get(endpoint, { params }).then(response => response.data.data);
  },
};
