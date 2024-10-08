import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IResRoom } from '../../types/types'

export interface roomsState {
  activeRoom: IResRoom | null
}

const initialState: roomsState = {
  activeRoom: null,
}

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addActiveRoom: (state, action: PayloadAction<IResRoom | null>) => {
      state.activeRoom = action.payload
    },
  },
})

export const { addActiveRoom } = roomsSlice.actions

export default roomsSlice.reducer
