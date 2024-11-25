import { FC } from 'react'
import { IResRoom } from '../../types/types'
import { useLiveQuery } from 'dexie-react-hooks'
import { clearRefs, IResMessage } from '../../store/messenger/messengerSlice'
import db from '../../helpers/db'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import { removeText } from '../../store/form/textSlise'
import RoomItem from './RoomItem'

interface RoomBlockProps {
  rooms: IResRoom[] | undefined
  type: string
}
const RoomsBlock: FC<RoomBlockProps> = ({ rooms, type }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)

  const messages = useLiveQuery(
    async (): Promise<IResMessage[] | undefined> =>
      await db.table('messages').toArray(),
    [],
  )

  const onChangeRoom = async (room: IResRoom) => {
    dispatch(addActiveRoom(room))
    dispatch(removeText())
    dispatch(clearRefs())
  }
  return (
    <>
      {rooms?.map((room) => {
        const roomMessages = messages?.filter((item) => item.roomId === room.id)

        const lastMessage =
          roomMessages && roomMessages[roomMessages?.length - 1]

        const unreadMessages = roomMessages?.filter((item) => {
          return item.readUsers.indexOf(user?.id!) == -1
        })

        return (
          <RoomItem
            key={`${room.id}-${room.name}`}
            room={room}
            onChangeRoom={(room: IResRoom) => onChangeRoom(room)}
            lastMessage={lastMessage}
            unreadMessages={unreadMessages}
            type={type}
          />
        )
      })}
    </>
  )
}

export default RoomsBlock
