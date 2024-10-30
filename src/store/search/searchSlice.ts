import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IResRoom, IResUser } from '../../types/types'

export interface searchState {
  searchValue: string | null
  globalUsers: IResUser[] | null
  globalRooms: IResRoom[] | null
  currentUsers: IResUser[] | null
  searchType: string | null
}

const initialState: searchState = {
  searchValue: null,
  globalUsers: null,
  globalRooms: null,
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
    addGlobalUsers: (state, action: PayloadAction<IResUser[] | null>) => {
      state.globalUsers = action.payload
    },
    addGlobalRooms: (state, action: PayloadAction<IResRoom[] | null>) => {
      state.globalRooms = action.payload
    },
    addCurrentUser: (state, action: PayloadAction<IResUser>) => {
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
    minusCurrentUser: (state, action: PayloadAction<IResUser>) => {
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
  addGlobalUsers,
  addCurrentUser,
  addGlobalRooms,
  clearCurrentUser,
  minusCurrentUser,
  addSearchType,
} = searchSlice.actions

export default searchSlice.reducer
