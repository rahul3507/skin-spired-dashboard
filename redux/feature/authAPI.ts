import { send } from "process";
import baseApi from "../api/baseAPI";

const authAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `auth/change-password`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-email`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdatePasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useForgetPasswordMutation,
  useLoginMutation,
} = authAPI;
