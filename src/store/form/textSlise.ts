import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface textState {
  text: string
}

const initialState: textState = {
  text: '',
}

export const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    addText: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },
    removeText: (state) => {
      state.text = ''
    },
  },
})

export const { addText, removeText } = textSlice.actions

export default textSlice.reducer
