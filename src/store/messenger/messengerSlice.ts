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

type refObject = {
  messageId: number
  groupIndex: number
  itemIndex: number
}

export interface messengerState {
  unreadDialogs: number | null
  unreadMessages: IResMessage[]
  messagesRefs: refObject[] | null
  replyMessage: IReply | null
  lastId: number | null
}

const initialState: messengerState = {
  unreadDialogs: null,
  unreadMessages: [],
  messagesRefs: null,
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

    addRef: (state, action: PayloadAction<refObject>) => {
      if (!state.messagesRefs) {
        state.messagesRefs = []
        state.messagesRefs.push(action.payload)
      } else {
        state.messagesRefs.push(action.payload)
      }
    },
    removeRef: (state, action: PayloadAction<refObject>) => {
      const ref = state.messagesRefs?.find(
        (obj) => JSON.stringify(obj) === JSON.stringify(action.payload),
      )
      if (ref && state.messagesRefs) {
        state.messagesRefs = state.messagesRefs?.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(ref),
        )
      }
    },
    clearRefs: (state) => {
      state.messagesRefs = null
    },
    addUnreadMessages: (state, action: PayloadAction<IResMessage>) => {
      const isExist = state.unreadMessages.find(
        (item) => item.id === action.payload.id,
      )
      if (!isExist) {
        state.unreadMessages?.push(action.payload)
      }
    },
    removeUnreadMessages: (state) => {
      state.unreadMessages = []
    },
    addLastId: (state, action: PayloadAction<number | null>) => {
      state.lastId = action.payload
    },
  },
})

export const {
  addReplayMessage,
  addUnreadDialogs,
  addLastId,
  addUnreadMessages,
  removeUnreadMessages,
  addRef,
  removeRef,
  clearRefs,
} = messengerSlice.actions

export default messengerSlice.reducer
