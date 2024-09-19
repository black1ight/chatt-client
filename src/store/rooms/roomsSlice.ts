import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IResRoom } from '../../types/types'
import { toast } from 'react-toastify'
import { RoomsService } from '../../services/rooms.services'

export const getRooms = createAsyncThunk<IResRoom[] | undefined>(
  'rooms/getMyRoomsStatus',
  async () => {
    try {
      const data = await RoomsService.getRooms()
      if (data) return data
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

export interface roomsState {
  rooms: IResRoom[] | null
  activeRoom: IResRoom | null
  status: Status
}

const initialState: roomsState = {
  rooms: null,
  activeRoom: null,
  status: Status.LOADING,
}

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addRooms: (state, action: PayloadAction<IResRoom[] | null>) => {
      state.rooms = null
      state.rooms = action.payload
    },
    removeRooms: (state) => {
      state.rooms = null
    },
    addActiveRoom: (state, action: PayloadAction<IResRoom | null>) => {
      state.activeRoom = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRooms.pending, (state) => {
      state.status = Status.LOADING
      state.rooms = null
    })
    builder.addCase(getRooms.fulfilled, (state, action) => {
      if (action.payload) {
        state.rooms = action.payload
        state.status = Status.SUCCESS
      } else {
        state.status = Status.ERROR
      }
    })
    builder.addCase(getRooms.rejected, (state) => {
      state.status = Status.ERROR
      state.rooms = null
    })
  },
})

export const { removeRooms, addActiveRoom, addRooms } = roomsSlice.actions

export default roomsSlice.reducer
