import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IResRoom, IUser, TypingData } from '../types/types'
import { addTypingData } from '../store/rooms/typingSlice'
import { addSocketId } from '../store/socket/socketSlice'
import db from '../helpers/db'

export const useConnectSocket = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)

  const connectSocket = (user: IUser) => {
    SocketApi.createConnection(user.id)

    SocketApi.socket?.on('connect', () => {
      const socketId = SocketApi.socket?.id
      dispatch(addSocketId(socketId!))
    })

    SocketApi.socket?.on('new-message', async (dto: IResMessage) => {
      db.table('messages').put(dto)
      console.log(dto)
    })

    SocketApi.socket?.on('updated-message', (dto: IResMessage) => {
      db.table('messages').put(dto)
      console.log(dto)
    })

    SocketApi.socket?.on('deleted-message', (dto: IResMessage) => {
      db.table('messages').delete(dto.id)
      console.log(dto)
    })

    SocketApi.socket?.on('readed-message', (dto: IResMessage) => {
      db.table('messages').update(dto.id, { readUsers: dto.readUsers })
      console.log(dto)
    })

    SocketApi.socket?.on('typing', (dto: TypingData) => {
      dispatch(addTypingData(dto))
    })

    SocketApi.socket?.on('joinedNewRoom', (dto: IResRoom) => {
      db.table('rooms').add(dto)
      console.log(dto)
    })

    SocketApi.socket?.on('clearedRoom', (messages: IResMessage[]) => {
      if (messages.length > 0) {
        messages.map((el) => db.table('messages').delete(el.id))
      }
    })

    SocketApi.socket?.on('deletedRoom', (room: IResRoom) => {
      if (room) {
        db.table('rooms').delete(room.id)
      }
    })
  }

  useEffect(() => {
    user && connectSocket(user)
  }, [user])
}
