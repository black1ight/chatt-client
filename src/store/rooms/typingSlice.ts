import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypingData } from '../../types/types'

export interface typingState {
  typingData: TypingData | null
}

const initialState: typingState = {
  typingData: null,
}

export const typingSlice = createSlice({
  name: 'typingSlice',
  initialState,
  reducers: {
    addTypingData: (state, action: PayloadAction<TypingData | null>) => {
      state.typingData = action.payload
    },
  },
})

export const { addTypingData } = typingSlice.actions

export default typingSlice.reducer
