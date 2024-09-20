import io, { Socket } from 'socket.io-client'
import { IResRoom, IUser } from '../types/types'

class SocketApi {
  static socket: null | Socket = null

  static createConnection(rooms: IResRoom[] | null, user: IUser | null) {
    this.socket = io('https://chatt-server.onrender.com')
    // this.socket = io('http://192.168.0.106:3001')

    this.socket.on('connect', () => {
      rooms?.forEach((room) => {
        this.socket?.emit('joinRoom', { room, user })
        console.log(`${this.socket?.id} connected to ${room.id}`)
      })
    })

    this.socket.on('disconnect', (e) => {
      console.log(e, 'disconnected')
    })
  }
}

export default SocketApi
