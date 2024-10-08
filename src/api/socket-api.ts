import io, { Socket } from 'socket.io-client'
import { IResRoom, IUser } from '../types/types'

class SocketApi {
  static socket: null | Socket = null

  static createConnection(id: number) {
    if (!this.socket) {
      // this.socket = io('http://192.168.0.106:3001', {
      //   query: { userId: id },
      // })

      this.socket = io('https://chatt-server.onrender.com', {
        query: { userId: id },
      })
    }

    this.socket.on('connect', () => {
      console.log(`${this.socket?.id} connected`)
    })

    this.socket.on('disconnect', (e) => {
      console.log(e, 'disconnected')
    })
  }

  static joinRooms(rooms: IResRoom[] | null, user: IUser | null) {
    rooms?.forEach((room) => {
      this.socket?.emit('joinRoom', { room, user })
      console.log(`${this.socket?.id} connected to ${room.id}`)
    })
  }

  static leaveRooms(rooms: IResRoom[] | undefined, user: IUser | null) {
    rooms?.forEach((room) => {
      this.socket?.emit('leaveRoom', { room, user })
      console.log(`${this.socket?.id} leave ${room.id}`)
    })
  }
}

export default SocketApi
