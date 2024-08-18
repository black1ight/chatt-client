import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch } from '../store/hooks'
import {
  addMessage,
  deleteMessage,
  IResMessage,
  updateMessage,
} from '../store/messenger/messengerSlice'

export const useConnectSocket = () => {
  const dispatch = useAppDispatch()
  const connectSocket = () => {
    SocketApi.createConnection()

    SocketApi.socket?.on('new-message', (dto: IResMessage) => {
      dispatch(addMessage(dto))
      console.log(dto)
    })

    SocketApi.socket?.on('update-message', (dto) => {
      dispatch(updateMessage(dto))
      console.log(dto)
    })

    SocketApi.socket?.on('delete-message', (dto) => {
      dispatch(deleteMessage(dto.id))

      console.log(dto)
    })
  }

  useEffect(() => {
    connectSocket()
  }, [])
}
