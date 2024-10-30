import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SocketState {
  socketId: string | null
}

const initialState: SocketState = {
  socketId: null,
}

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    addSocketId: (state, action: PayloadAction<string | null>) => {
      state.socketId = action.payload
    },
  },
})

export const { addSocketId } = socketSlice.actions

export default socketSlice.reducer
