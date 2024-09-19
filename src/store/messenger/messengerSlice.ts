import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessagesService } from '../../services/messages.service'
import { toast } from 'react-toastify'
import { IPatchData } from '../../types/types'

export const getMessages = createAsyncThunk<any, string>(
  'messenger/getMyMessagesStatus',
  async (room: string) => {
    try {
      const data = await MessagesService.getMessages(room)
      if (data) return { data, room }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  },
)

enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

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
  createdAt: Date
  updatedAt: Date
  userId: number
  roomId: string
  reply: IReply
  user: IUser
}

export interface messengerState {
  messages: IResMessage[]
  roomId: string | null
  unreadMessages: IResMessage[]
  replyMessage: IReply | null
  chatCountTrigger: boolean
  status: Status
}

const initialState: messengerState = {
  messages: [],
  roomId: null,
  unreadMessages: [],
  replyMessage: null,
  chatCountTrigger: false,
  status: Status.LOADING,
}

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IResMessage>) => {
      if (state.roomId && state.roomId === action.payload.roomId) {
        state.messages = [...state.messages, action.payload]
      } else if (!state.roomId) {
        state.messages = [...state.messages, action.payload]
      }
    },
    addUnreadMessages: (state, action: PayloadAction<IResMessage[]>) => {
      state.unreadMessages = action.payload
    },
    addChatCountTrigger: (state, action: PayloadAction<boolean>) => {
      state.chatCountTrigger = action.payload
    },
    removeUnreadMessages: (state, action: PayloadAction<number>) => {
      state.unreadMessages = state.unreadMessages.filter(
        (item) => item.id !== action.payload,
      )
    },

    clearUnreadMessages: (state) => {
      state.unreadMessages = []
    },

    updateMessage: (state, action: PayloadAction<IPatchData>) => {
      state.messages.find((obj) => {
        if (obj.id === action.payload.id) {
          obj.text = action.payload.text
          obj.updatedAt = action.payload.updatedAt
        }
      })
    },
    deleteMessage: (state, action: PayloadAction<IResMessage>) => {
      state.messages = state.messages.filter(
        (item) => item.id !== action.payload.id,
      )
    },
    replaceMessage: (state, action: PayloadAction<IResMessage>) => {
      const findMessageId = state.messages.findIndex(
        (el) => el.id === action.payload.id,
      )

      if (findMessageId) state.messages.splice(findMessageId, 1, action.payload)
    },
    removeMessages: (state) => {
      state.messages = []
    },

    addReplayMessage: (state, action: PayloadAction<IReply | null>) => {
      state.replyMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessages.fulfilled, (state, action) => {
      if (action.payload) {
        state.messages = action.payload.data
        state.roomId = action.payload.room.split('=')[1] ?? null
        // state.chatCountTrigger = false
        state.status = Status.SUCCESS
      } else {
        state.status = Status.ERROR
        state.messages = []
      }
    })
  },
})

export const {
  addMessage,
  updateMessage,
  replaceMessage,
  removeMessages,
  deleteMessage,
  addReplayMessage,
  addUnreadMessages,
  addChatCountTrigger,
  removeUnreadMessages,
  clearUnreadMessages,
} = messengerSlice.actions

export default messengerSlice.reducer
