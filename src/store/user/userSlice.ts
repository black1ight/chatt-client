import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../types/types'

export interface UserState {
  user: IUser | null
  isAuth: boolean
}

const initialState: UserState = {
  user: null,
  isAuth: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
      state.isAuth = true
    },
    logOut: (state) => {
      state.user = null
      state.isAuth = false
    },
  },
})

export const { logIn, logOut } = userSlice.actions

export default userSlice.reducer
