import baseApi from "../api/baseAPI";

const bookingListAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query<any, any>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/booking/get-all-bookings?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllBookingsQuery } = bookingListAPI;
