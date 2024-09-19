import { useEffect } from 'react'
import SocketApi from '../api/socket-api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addChatCountTrigger,
  addMessage,
  deleteMessage,
  IResMessage,
  replaceMessage,
  updateMessage,
} from '../store/messenger/messengerSlice'
import { TypingData } from '../types/types'
import { addTypingData } from '../store/rooms/typingSlice'

export const useConnectSocket = () => {
  const dispatch = useAppDispatch()
  const { rooms } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)

  const connectSocket = () => {
    SocketApi.createConnection(rooms ?? null, user ?? null)

    SocketApi.socket?.on('new-message', (dto: IResMessage) => {
      dispatch(addMessage(dto))
      dispatch(addChatCountTrigger(true))
      console.log(dto)
    })

    SocketApi.socket?.on('update-message', (dto: IResMessage) => {
      dispatch(updateMessage(dto))
      console.log(dto)
    })

    SocketApi.socket?.on('delete-message', (dto: IResMessage) => {
      dispatch(deleteMessage(dto))
      console.log(dto)
    })

    SocketApi.socket?.on('read-message', (dto: IResMessage) => {
      dispatch(replaceMessage(dto))

      console.log(dto)
    })

    SocketApi.socket?.on('typing', (dto: TypingData) => {
      dispatch(addTypingData(dto))
    })
  }

  useEffect(() => {
    connectSocket()
  }, [rooms])
}
