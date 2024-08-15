import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch } from '../store/hooks'
import {
  addMessage,
  deleteMessage,
  updateMessage,
} from '../store/messenger/messengerSlice'
import { removeEditId, removeText } from '../store/form/formSlice'

export const useConnectSocket = () => {
  const dispatch = useAppDispatch()
  const connectSocket = () => {
    SocketApi.createConnection()

    SocketApi.socket?.on('new-message', (dto) => {
      dispatch(addMessage(dto))
      dispatch(removeText())
      console.log(dto)
    })

    SocketApi.socket?.on('update-message', (dto) => {
      dispatch(updateMessage(dto))
      dispatch(removeText())
      dispatch(removeEditId())
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
