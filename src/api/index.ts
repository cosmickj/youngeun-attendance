import axios from 'axios';

const createInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_AWS_GATEWAY_URL,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // },
  });
};

export const instance = createInstance();
