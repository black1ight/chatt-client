import { useCallback, useEffect, useState } from 'react'
import { MessagesService } from '../services/messages.service'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addChatCountTrigger } from '../store/messenger/messengerSlice'
import debounce from 'lodash.debounce'

export const useGetUnreadChats = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { unreadMessages, chatCountTrigger } = useAppSelector(
    (state) => state.messenger,
  )

  const [dialogCount, setDialogCount] = useState<number>(0)

  const getRoomsWithNewMessages = async () => {
    const data = await MessagesService.getMessages(`unread=${user?.id}`)
    let rooms: any = {}

    if (data) {
      const newMessagesDialogsCount = data?.filter(
        ({ roomId }) => !rooms[roomId] && (rooms[roomId] = 1),
      )
      setDialogCount(newMessagesDialogsCount?.length)
    }
  }

  const updateDialogCount = useCallback(
    debounce(() => {
      getRoomsWithNewMessages()
    }, 500),
    [],
  )

  useEffect(() => {
    activeRoom && updateDialogCount()
    dispatch(addChatCountTrigger(false))
  }, [activeRoom, unreadMessages, chatCountTrigger])

  return { dialogCount, updateDialogCount }
}
