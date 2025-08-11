import { set } from "date-fns";
import baseApi from "../api/baseAPI";

const settingAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/setting/get/privacy`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
        providesTags: ["Settings"],
      }),
    }),

    setPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/setting/update/privacy`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
        invalidatesTags: ["Settings"],
      }),
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: `/setting/get/about`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
        providesTags: ["Settings"],
      }),
    }),

    updateAboutUs: builder.mutation({
      query: (data) => ({
        url: `/setting/update/about`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
        invalidatesTags: ["Settings"],
      }),
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} = settingAPI;
