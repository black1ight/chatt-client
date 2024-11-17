import {
  addUnreadDialogs,
  IResMessage,
} from '../store/messenger/messengerSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'react'
import db from '../helpers/db'

export const useNewMessagesDialogsCount = () => {
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const messages = useLiveQuery(
    async (): Promise<IResMessage[] | undefined> =>
      await db.table('messages').toArray(),
    [],
  )

  const myRooms = useLiveQuery(async (): Promise<number[] | undefined> => {
    const data = await db.table('rooms').toArray()
    return data.map(({ id }) => id)
  }, [])

  const getDialogsCount = () => {
    let rooms: any = {}
    const unreadMessages = messages?.filter((item) => {
      return (
        item.readUsers.indexOf(user?.id!) == -1 &&
        myRooms?.some((id) => id === item.roomId)
      )
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
