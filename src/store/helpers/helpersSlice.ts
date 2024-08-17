import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface helpersState {
  isLoading: string | null
}

const initialState: helpersState = {
  isLoading: null,
}

export const helpersSlice = createSlice({
  name: 'helpers',
  initialState,
  reducers: {
    changeIsLoading: (state, action: PayloadAction<string | null>) => {
      state.isLoading = action.payload
    },
  },
})

export const { changeIsLoading } = helpersSlice.actions

export default helpersSlice.reducer
