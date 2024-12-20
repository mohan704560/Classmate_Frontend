import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
Axios.interceptors.request.use(
  async (config) => {
    const authToken: string | null = await localStorage.getItem("authToken");
    if (authToken) {
      config.headers["authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   return Promise.reject(error);
// });

export default Axios;
