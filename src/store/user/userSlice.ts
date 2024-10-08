import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IResUser, IUser } from '../../types/types'
import { UsersService } from '../../services/users.service'
import { toast } from 'react-toastify'

export const getMyProfile = createAsyncThunk<any, number>(
  'messenger/getMyProfileStatus',
  async (id: number) => {
    try {
      const data = await UsersService.getUserById(id)
      if (data) return { data }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  },
)

enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface UserState {
  user: IUser | null
  profile: IResUser | null
  isAuth: boolean
  isOpen: boolean
  status: Status
}

const initialState: UserState = {
  user: null,
  profile: null,
  isAuth: false,
  isOpen: false,
  status: Status.LOADING,
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
    addProfile: (state, action: PayloadAction<IResUser | null>) => {
      state.profile = action.payload
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      if (action.payload) {
        state.profile = action.payload.data
        state.status = Status.SUCCESS
      } else {
        state.status = Status.ERROR
        state.profile = null
      }
    })
  },
})

export const { logIn, logOut, addProfile, setIsOpen } = userSlice.actions

export default userSlice.reducer
