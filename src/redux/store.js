import { configureStore } from '@reduxjs/toolkit'

import { BlogAPI } from './BlogAPI'

export const store = configureStore({
  reducer: {
    [BlogAPI.reducerPath]: BlogAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BlogAPI.middleware),
})
