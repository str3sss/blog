import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { getToken } from '../utils/StorageHandler'

export const BlogAPI = createApi({
  reducerPath: 'BlogAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog.kata.academy/api/',
    prepareHeaders: (headers) => {
      const token = getToken()

      if (token) {
        headers.set('Authorization', `Token ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['User', 'Article'],
  endpoints: (build) => ({
    getArticles: build.query({
      query: (ofset) => `articles?limit=5&offset=${ofset}`,
      providesTags: ['Article'],
    }),
    getArticle: build.query({
      query: (slug) => `articles/${slug}`,
      providesTags: ['Article'],
    }),
    createArticle: build.mutation({
      query: (body, token) => ({
        url: 'articles',
        method: 'POST',
        body: { article: body },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),
    editArticle: build.mutation({
      query: ({ body, slug, token }) => ({
        url: `articles/${slug}`,
        method: 'PUT',
        body: { article: body },
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),
    deleteArticle: build.mutation({
      query: (slug, token) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),
    likeArticle: build.mutation({
      query: (slug, token) => ({
        url: `articles/${slug}/favorite`,
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),
    unlikeArticle: build.mutation({
      query: (slug, token) => ({
        url: `articles/${slug}/favorite`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      invalidatesTags: ['Article'],
    }),

    loginUser: build.mutation({
      query: (body) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: body },
      }),
      invalidatesTags: ['User'],
    }),
    registerUser: build.mutation({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body: { user: body },
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: build.mutation({
      query: ({ body, token }) => ({
        url: 'user',
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: { user: body },
      }),
      invalidatesTags: ['User', 'Article'],
    }),
    getUser: build.query({
      query: (token) => ({
        url: 'user',
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useEditArticleMutation,
  useGetUserQuery,
} = BlogAPI
