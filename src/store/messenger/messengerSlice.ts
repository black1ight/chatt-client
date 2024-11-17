import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
  id?: number
  username?: string
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
  roomId: number
  reply: IReply
  user: IUser
}

type refObject = {
  messageId: number
  itemIndex: number
}

export interface messengerState {
  unreadDialogs: number | null
  unreadMessages: IResMessage[]
  messagesRefs: refObject[] | null
  replyMessage: IReply | null
}

const initialState: messengerState = {
  unreadDialogs: null,
  unreadMessages: [],
  messagesRefs: null,
  replyMessage: null,
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
        const exist = state.messagesRefs.find(
          (ref) => ref.messageId === action.payload.messageId,
        )
        !exist && state.messagesRefs.push(action.payload)
      }
    },
    removeRef: (state, action: PayloadAction<number>) => {
      const ref = state.messagesRefs?.find(
        (obj) => obj.messageId === action.payload,
      )
      if (ref && state.messagesRefs) {
        state.messagesRefs = state.messagesRefs?.filter(
          (obj) => obj.messageId !== ref.messageId,
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
  },
})

export const {
  addReplayMessage,
  addUnreadDialogs,
  addUnreadMessages,
  removeUnreadMessages,
  addRef,
  removeRef,
  clearRefs,
} = messengerSlice.actions

export default messengerSlice.reducer
