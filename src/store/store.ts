import { configureStore } from '@reduxjs/toolkit'
import user from './user/userSlice'
import messenger from './messenger/messengerSlice'
import form from './form/formSlice'

export const store = configureStore({
  reducer: {
    user,
    messenger,
    form,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
