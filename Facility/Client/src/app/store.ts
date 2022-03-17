import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice"
import treeReducer from "../features/tree/treeSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    tree: treeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store