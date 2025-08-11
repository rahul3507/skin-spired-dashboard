import baseApi from "../api/baseAPI";

const dashboardAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<any, void>({
      query: () => ({
        url: "/dashboard/get-statistics",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),

    getEarning: builder.query<any, void>({
      query: () => ({
        url: "/dashboard/get-earning-chart-data",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),

    getTransactions: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/payment/get-all-payments?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetStatisticsQuery,
  useGetEarningQuery,
  useGetTransactionsQuery,
} = dashboardAPI;
