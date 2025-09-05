import config from '@/config';
import axios, { type AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  // set cookies
  withCredentials: true
})

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
},
);

let isRefreshing = false;

let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error:unknown) => {
  pendingQueue.forEach((promise)=>{
    if (error) {
      promise.reject(error)
    }else{
      promise.resolve(null);
    }
  });

  pendingQueue = [];
}

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("res success", response);

    return response;
  },
  async (error) => {
    // console.log("res failed", error.response.data.message);

    const originalRequest = error.config as AxiosRequestConfig & {_retry:boolean};
    // console.log(originalRequest);

    if (error.response.status === 500 && 
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {

      console.log("Your Token is Expired");

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(originalRequest))
          .catch((error) => Promise.reject(error))
      }

      isRefreshing = true
      try {
        const res = await axiosInstance.post("/auth/refresh-token");
        console.log("new token arrived", res);

        processQueue(null)

        return axiosInstance(originalRequest)
      } catch (error) {
        processQueue(error);
        return Promise.reject(error);
      } finally{
        isRefreshing = false;
      }
    }

    // for everything
    return Promise.reject(error);
  }
);
