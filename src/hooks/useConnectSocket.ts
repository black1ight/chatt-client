import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addMessage,
  deleteMessage,
  IResMessage,
  updateMessage,
} from '../store/messenger/messengerSlice'
import { removeEditId, removeText } from '../store/form/formSlice'

export const useConnectSocket = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const connectSocket = () => {
    SocketApi.createConnection()

    SocketApi.socket?.on('new-message', (dto: IResMessage) => {
      if (user?.id === dto.userId) {
        dispatch(addMessage(dto))
        dispatch(removeText())
      }
      console.log(dto)
    })

    SocketApi.socket?.on('update-message', (dto) => {
      if (user?.id === dto.userId) {
        dispatch(updateMessage(dto))
        dispatch(removeText())
        dispatch(removeEditId())
      }

      console.log(dto)
    })

    SocketApi.socket?.on('delete-message', (dto) => {
      if (user?.id === dto.userId) {
        dispatch(deleteMessage(dto.id))
      }
      console.log(dto)
    })
  }

  useEffect(() => {
    connectSocket()
  }, [])
}
