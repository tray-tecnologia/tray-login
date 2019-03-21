import axios from 'axios';

// eslint-disable-next-line
export const http = axios.create({
  baseURL: '/checkout',
});
