import baseApi from "../api/baseAPI";

const courtAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourt: builder.query<any, any>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/court/get-court-by-admin?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["Court"],
    }),
    deleteCourt: builder.mutation<any, string>({
      query: (courtId) => ({
        url: `/court/delete-court/${courtId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Court"],
    }),

    addCourt: builder.mutation<any, any>({
      query: (data) => ({
        url: `/court/create-court`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Court"],
    }),

    updateCourt: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/court/update-court/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Court"],
    }),

    getSingleCourt: builder.query<any, string>({
      query: (id) => ({
        url: `/court/get-courts-details/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCourtQuery,
  useDeleteCourtMutation,
  useAddCourtMutation,
  useUpdateCourtMutation,
  useGetSingleCourtQuery,
} = courtAPI;
