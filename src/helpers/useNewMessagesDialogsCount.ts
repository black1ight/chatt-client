import {
  addUnreadDialogs,
  IResMessage,
} from '../store/messenger/messengerSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import db from './db'
import { useEffect } from 'react'

export const useNewMessagesDialogsCount = () => {
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const messages = useLiveQuery(
    async (): Promise<IResMessage[] | undefined> =>
      await db.table('messages').toArray(),
    [],
  )

  const getDialogsCount = () => {
    let rooms: any = {}
    const unreadMessages = messages?.filter((item) => {
      return item.readUsers.indexOf(user?.id!) == -1
    })

    if (unreadMessages) {
      const newMessagesDialogsCount = unreadMessages?.filter(
        ({ roomId }) => !rooms[roomId] && (rooms[roomId] = 1),
      )
      dispatch(addUnreadDialogs(newMessagesDialogsCount.length))
    }
  }

  useEffect(() => {
    getDialogsCount()
  }, [messages])
}
