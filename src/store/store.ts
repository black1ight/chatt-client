import { configureStore } from '@reduxjs/toolkit'
import user from './user/userSlice'
import messenger from './messenger/messengerSlice'
import form from './form/formSlice'
import text from './form/textSlise'
import area from './form/areaSlice'
import search from './search/searchSlice'
import rooms from './rooms/roomsSlice'
import typing from './rooms/typingSlice'
import socket from './socket/socketSlice'
import helpers from './helpers/helpersSlice'
import profile from './profile/profileSlice'

export const store = configureStore({
  reducer: {
    user,
    messenger,
    form,
    text,
    area,
    helpers,
    search,
    rooms,
    typing,
    socket,
    profile,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
