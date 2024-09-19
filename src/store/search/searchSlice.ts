import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserData } from '../../types/types'

export interface searchState {
  searchValue: string | null
  currentUsers: IUserData[] | null
}

const initialState: searchState = {
  searchValue: null,
  currentUsers: null,
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addValue: (state, action: PayloadAction<string | null>) => {
      state.searchValue = action.payload
    },
    addCurrentUser: (state, action: PayloadAction<IUserData>) => {
      const isExist = state.currentUsers?.find(
        (user) => user.id === action.payload.id,
      )
      if (state.currentUsers && state.currentUsers.length > 0 && !isExist) {
        state.currentUsers.push(action.payload)
      } else {
        state.currentUsers = []
        state.currentUsers.push(action.payload)
      }
    },
    minusCurrentUser: (state, action: PayloadAction<IUserData>) => {
      if (state.currentUsers) {
        state.currentUsers = state.currentUsers.filter(
          (item) => item.id !== action.payload.id,
        )
      }
    },
    clearCurrentUser: (state) => {
      state.currentUsers = null
    },
  },
})

export const { addValue, addCurrentUser, clearCurrentUser, minusCurrentUser } =
  searchSlice.actions

export default searchSlice.reducer
