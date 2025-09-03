import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/booking",
                method: "POST",
                data: bookingData
            }),
            invalidatesTags: ["BOOKING"],
        }),
        getBooking: builder.query({
            query: (params) => ({
                url: "/booking",
                method: "GET",
                params,
            }),
            providesTags:["BOOKING"],
        }),
    })
});

export const {
    useCreateBookingMutation,
    useGetBookingQuery,
} = bookingApi;