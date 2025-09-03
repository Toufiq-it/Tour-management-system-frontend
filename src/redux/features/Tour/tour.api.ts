import { baseApi } from "@/redux/baseApi";
import type { IResponse, ITourPackage } from "@/types";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addTour: builder.mutation({
            query: (tourData) => ({
                url: "/tour/create",
                method: "POST",
                data: tourData
            }),
            invalidatesTags: ["TOUR"],
        }),
        getAllTours: builder.query<ITourPackage[], unknown>({
            query: (params) => ({
                url: "/tour",
                method: "GET",
                params,
            }),
            providesTags:["TOUR"],
            transformResponse: (response: IResponse<ITourPackage[]>) => response.data
        }),
        // ------Tour Type ------------
        addTourType: builder.mutation({
            query: (tourTypeName) => ({
                url: "/tour/create-tour-type",
                method: "POST",
                data: tourTypeName
            }),
            invalidatesTags: ["TOUR"],
        }),
        removeTourType: builder.mutation({
            query: (tourTypeId) => ({
                url: `/tour/tour-types/${tourTypeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TOUR"],
        }),
        getTourType: builder.query({
            query: () => ({
                url: "/tour/tour-types",
                method: "GET",
            }),
            providesTags:["TOUR"],
            transformResponse: (response) => response.data
        }),
    })
});

export const {
    // tour Type
    useAddTourTypeMutation,
    useGetTourTypeQuery,
    useRemoveTourTypeMutation,
    // Tour
    useAddTourMutation,
    useGetAllToursQuery,
} = tourApi;