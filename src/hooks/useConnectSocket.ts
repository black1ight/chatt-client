import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IResRoom, IUser, SyncMessage, TypingData } from '../types/types'
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
      db.table('users').update(user.id, { socketId })
    })

    SocketApi.socket?.on('updateUser', (dto) => {
      if (Array.isArray(dto)) {
        db.table('users').bulkPut(dto)
      } else {
        db.table('users').put(dto)
      }
      console.log(`user ${dto.email} has been updated`)
    })

    SocketApi.socket?.on('new-message', async (dto: SyncMessage) => {
      const isExist = await db.table('messages').get(dto.tempId)
      if (isExist) {
        db.table('messages').update(dto.tempId, { ...dto.data })
      } else {
        db.table('messages').add(dto.data)
      }
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

    SocketApi.socket?.on('updateRoom', (room: IResRoom) => {
      console.log(room)

      if (room) {
        db.table('rooms').put(room)
      }
    })

    SocketApi.socket?.on('invatedRoom', async (room: IResRoom) => {
      if (room) {
        await db.table('rooms').put(room)
        for (const user of room.users) {
          const isExist = await db
            .table('users')
            .where('id')
            .equals(user.id!)
            .count()
          if (!isExist) {
            await db.table('users').add(user)
            console.log(`user ${user.email} has been added!`)
          }
        }
        console.log(`room ${room.id} has been updated`)
      }
    })
  }

  useEffect(() => {
    if (user) {
      connectSocket(user)
      console.log(`${user?.email} connect`)
    }
  }, [user])
}
