import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessagesService } from '../../services/messages.service'
import { toast } from 'react-toastify'
import { IPatchData } from '../../types/types'
import { act } from 'react'

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
  id: number
  user_name: string
  email: string
}

export interface IResMessage {
  id: number
  text: string
  createdAt: Date
  updatedAt: Date
  userId: number
  user: IUser
}

export interface messengerState {
  messages: IResMessage[]
  status: Status
}

const initialState: messengerState = {
  messages: [],
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

export const { addMessage, updateMessage, removeMessages, deleteMessage } =
  messengerSlice.actions

export default messengerSlice.reducer
