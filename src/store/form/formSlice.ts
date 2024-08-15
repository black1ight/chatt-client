import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface formState {
  text: string
  editId: number | null
  onWrite: boolean
}

const initialState: formState = {
  text: '',
  editId: null,
  onWrite: false,
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
  },
})

export const {
  addText,
  removeText,
  onStartWrite,
  onEndWrite,
  addEditId,
  removeEditId,
} = formSlice.actions

export default formSlice.reducer
