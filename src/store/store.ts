import { configureStore } from '@reduxjs/toolkit'
import user from './user/userSlice'
import messenger from './messenger/messengerSlice'
import form from './form/formSlice'
import helpers from './helpers/helpersSlice'
import text from './form/textSlise'
import area from './form/areaSlice'

export const store = configureStore({
  reducer: {
    user,
    messenger,
    form,
    text,
    helpers,
    area,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
