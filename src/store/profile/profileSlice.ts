import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface profileState {
  editField: string | null
  editValue: string | null
}

const initialState: profileState = {
  editField: null,
  editValue: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    addEditField: (state, action: PayloadAction<string | null>) => {
      state.editField = action.payload
    },
    addEditValue: (state, action: PayloadAction<string | null>) => {
      state.editValue = action.payload
    },
  },
})

export const { addEditField, addEditValue } = profileSlice.actions

export default profileSlice.reducer
