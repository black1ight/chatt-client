import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IResUser } from '../../types/types'

export interface UserState {
  activeUser: IResUser | null
}

const initialState: UserState = {
  activeUser: null,
}

export const userProfile = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    addActiveUser: (state, action: PayloadAction<IResUser | null>) => {
      state.activeUser = action.payload
    },
  },
})

export const { addActiveUser } = userProfile.actions

export default userProfile.reducer
