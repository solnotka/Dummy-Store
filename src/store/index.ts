import { configureStore } from '@reduxjs/toolkit'
import { goodsReducer } from './slices/goodsSlice'
import { userReducer } from './slices/userSlice'

export const store = configureStore({
  reducer: {
    goods: goodsReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
