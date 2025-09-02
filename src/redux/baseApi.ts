import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'

export const baseApi = createApi({
    reducerPath: "baseApi",
    // axios
    baseQuery: axiosBaseQuery(),
    // fatch
    //   baseQuery: fetchBaseQuery({
    //     baseUrl: config.baseUrl,
    //      // set cookies
    //     credentials: "include",
    //   }),
    tagTypes: ["USER", "TOUR", "DIVISION"],
    endpoints: () => ({})
})