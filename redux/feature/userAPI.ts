import baseApi from "../api/baseAPI";

const authAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, any>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/get-all-users?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getUserProfile: builder.query<any, string>({
      query: () => ({
        url: `/user/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = authAPI;
