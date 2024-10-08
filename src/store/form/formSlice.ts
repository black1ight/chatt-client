import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface formState {
  editId: number | null
  onWrite: boolean
  replyId: number | null
}

const initialState: formState = {
  editId: null,
  onWrite: false,
  replyId: null,
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
      state.replyId = action.payload
    },
  },
})

export const { addEditId, onReply, addOnWrite } = formSlice.actions

export default formSlice.reducer
