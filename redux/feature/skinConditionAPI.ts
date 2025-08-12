/** @format */

import baseApi from "../api/baseAPI";

const skinConditionAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSkinCondition: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/skin-condition/get-all?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["SkinCondition"],
    }),
    getSkinConditionById: builder.query({
      query: (id) => ({
        url: `/skin-condition/details/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "SkinCondition", id }],
    }),
    updateSkinCondition: builder.mutation({
      query: ({ id, data }) => ({
        url: `/skin-condition/update/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SkinCondition", id },
        "SkinCondition",
      ],
    }),
    createSkinCondition: builder.mutation({
      query: (data) => ({
        url: `/skin-condition/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["SkinCondition"],
    }),
  }),
});

export const {
  useGetAllSkinConditionQuery,
  useGetSkinConditionByIdQuery,
  useUpdateSkinConditionMutation,
  useCreateSkinConditionMutation,
} = skinConditionAPI;
