import io, { Socket } from 'socket.io-client'

class SocketApi {
  static socket: null | Socket = null

  static createConnection() {
    // this.socket = io('https://chatt-server.onrender.com')
    this.socket = io('http://192.168.0.106:3001')

    this.socket.on('connect', () => {
      console.log('connected')
    })

    this.socket.on('disconnect', (e) => {
      console.log(e, 'disconnected')
    })
  }
}

export default SocketApi
