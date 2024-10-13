import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserData } from '../../types/types'

export interface searchState {
  searchValue: string | null
  currentUsers: IUserData[] | null
  searchType: string | null
}

const initialState: searchState = {
  searchValue: null,
  currentUsers: null,
  searchType: null,
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
    addSearchType: (state, action: PayloadAction<string | null>) => {
      state.searchType = action.payload
    },
  },
})

export const {
  addValue,
  addCurrentUser,
  clearCurrentUser,
  minusCurrentUser,
  addSearchType,
} = searchSlice.actions

export default searchSlice.reducer
