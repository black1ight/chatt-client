import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface formState {
  editId: number | null
  onWrite: boolean
  reply: number | null
}

const initialState: formState = {
  editId: null,
  onWrite: false,
  reply: null,
}

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addEditId: (state, action: PayloadAction<number | null>) => {
      state.editId = action.payload
    },
    addOnWrite: (state, action: PayloadAction<boolean>) => {
      state.onWrite = action.payload
    },
    onReply: (state, action: PayloadAction<number | null>) => {
      state.reply = action.payload
    },
  },
})

export const { addEditId, onReply, addOnWrite } = formSlice.actions

export default formSlice.reducer
