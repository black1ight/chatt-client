import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
  id?: number
  user_name?: string
  email: string
}

export interface IReply {
  text: string
  user: IUser
}

export interface IResMessage {
  id: number
  text: string
  readUsers: number[]
  status: string | null
  createdAt: Date
  updatedAt: Date
  userId: number
  roomId: string
  reply: IReply
  user: IUser
}

export interface messengerState {
  unreadDialogs: number | null
  replyMessage: IReply | null
  lastId: number | null
}

const initialState: messengerState = {
  unreadDialogs: null,
  replyMessage: null,
  lastId: null,
}

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    addReplayMessage: (state, action: PayloadAction<IReply | null>) => {
      state.replyMessage = action.payload
    },
    addUnreadDialogs: (state, action: PayloadAction<number | null>) => {
      state.unreadDialogs = action.payload
    },
    addLastId: (state, action: PayloadAction<number | null>) => {
      state.lastId = action.payload
    },
  },
})

export const { addReplayMessage, addUnreadDialogs, addLastId } =
  messengerSlice.actions

export default messengerSlice.reducer
