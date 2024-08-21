import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface formState {
  areaHeight: number
}

const initialState: formState = {
  areaHeight: 48,
}

export const areaSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addAreaHeight: (state, action: PayloadAction<number>) => {
      state.areaHeight = action.payload
    },
  },
})

export const { addAreaHeight } = areaSlice.actions

export default areaSlice.reducer
