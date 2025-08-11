import baseApi from "../api/baseAPI";

const notificationAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/notification/admin?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    updateNotification: builder.mutation<any, string>({
      query: () => ({
        url: `/notification/admin`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<any, string>({
      query: () => ({
        url: `/notification/delete-all`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    getNotificationCount: builder.query<any, void>({
      query: () => ({
        url: `/notification/get-notification-count`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationCountQuery,
} = notificationAPI;
