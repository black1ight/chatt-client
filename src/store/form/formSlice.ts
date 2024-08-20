import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface formState {
  text: string
  editId: number | null
  onWrite: boolean
  reply: number | null
  areaHeight: number
}

const initialState: formState = {
  text: '',
  editId: null,
  onWrite: false,
  reply: null,
  areaHeight: 48,
}

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addText: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },
    removeText: (state) => {
      state.text = ''
    },
    addEditId: (state, action: PayloadAction<number>) => {
      state.editId = action.payload
    },
    removeEditId: (state) => {
      state.editId = null
    },
    onStartWrite: (state) => {
      state.onWrite = true
    },
    onEndWrite: (state) => {
      state.onWrite = false
    },
    onReply: (state, action: PayloadAction<number | null>) => {
      state.reply = action.payload
    },
    addAreaHeight: (state, action: PayloadAction<number>) => {
      state.areaHeight = action.payload
    },
  },
})

export const {
  addText,
  removeText,
  onStartWrite,
  onEndWrite,
  addEditId,
  removeEditId,
  onReply,
  addAreaHeight,
} = formSlice.actions

export default formSlice.reducer
