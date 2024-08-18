import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessagesService } from '../../services/messages.service'
import { toast } from 'react-toastify'
import { IPatchData } from '../../types/types'

export const getMessages = createAsyncThunk<any>(
  'messenger/getMyMessagesStatus',
  async () => {
    try {
      const data = await MessagesService.getMessages()
      if (data) return data
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
  createdAt: Date
  updatedAt: Date
  userId: number
  reply: IReply
  user: IUser
}

export interface messengerState {
  messages: IResMessage[]
  replyMessage: IReply | null
  status: Status
}

const initialState: messengerState = {
  messages: [],
  replyMessage: null,
  status: Status.LOADING,
}

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IResMessage>) => {
      state.messages = [...state.messages, action.payload]
    },
    updateMessage: (state, action: PayloadAction<IPatchData>) => {
      state.messages.find((obj) => {
        if (obj.id === action.payload.id) {
          obj.text = action.payload.text
          obj.updatedAt = action.payload.updatedAt
        }
      })
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(
        (item) => item.id !== action.payload,
      )
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
        state.messages = action.payload
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
  removeMessages,
  deleteMessage,
  addReplayMessage,
} = messengerSlice.actions

export default messengerSlice.reducer
