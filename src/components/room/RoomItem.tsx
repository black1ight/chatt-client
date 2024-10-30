import { FC } from 'react'
import { IResRoom } from '../../types/types'
import RoomLabel from './RoomLabel'
import { IResMessage } from '../../store/messenger/messengerSlice'
import { format } from 'date-fns'
import { useAppSelector } from '../../store/hooks'
import { getUserName } from '../sidebar/Sidebar'
import Typing from '../Typing'

interface RoomItemProps {
  room: IResRoom
  type: string
  onChangeRoom: (room: IResRoom) => void
  lastMessage: IResMessage | undefined
  unreadMessages: IResMessage[] | undefined
}

const RoomItem: FC<RoomItemProps> = ({
  room,
  onChangeRoom,
  lastMessage,
  unreadMessages,
  type,
}) => {
  const { user } = useAppSelector((state) => state.user)
  const { typingData } = useAppSelector((state) => state.typing)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const getTimeOfMessage = (data: Date) => {
    if (new Date().getDate() - new Date(data).getDate() > 1) return 'longAgo'
    if (new Date(data).getDate() == new Date().getDate()) return 'today'
    if (
      new Date().getDate() !== new Date(data).getDate() &&
      new Date(data).getDay() >= 0 &&
      new Date(data).getDay() < new Date().getDay()
    )
      return 'toweek'
  }

  const global = type === 'global'
  return (
    <li
      onClick={() => onChangeRoom(room)}
      className={`relative h-[70px] ${global && 'h-auto py-1'} flex gap-2 px-2 cursor-pointer hover:bg-stone-100`}
    >
      <RoomLabel room={room} type={type} />
      <div
        className={`flex w-[calc(100%-64px)] flex-col justify-center ${!global && 'border-b'}`}
      >
        <div className='flex gap-2 justify-between'>
          <span className='flex-grow text-stone-900 font-medium text-nowrap overflow-hidden text-ellipsis'>
            {room.id}
          </span>
          {lastMessage && (
            <span className='text-sm opacity-70'>
              {getTimeOfMessage(lastMessage.createdAt) === 'today'
                ? format(lastMessage.createdAt, 'HH:mm')
                : getTimeOfMessage(lastMessage.createdAt) === 'toweek'
                  ? format(lastMessage.createdAt, 'EEE')
                  : format(lastMessage.createdAt, 'dd/MM/yyyy')}
            </span>
          )}
        </div>
        {lastMessage && (
          <span className='text-[15px] text-stone-900 leading-tight'>
            {lastMessage.user.id === user?.id
              ? 'you'
              : (lastMessage?.user.user_name ??
                getUserName(lastMessage?.user.email))}
          </span>
        )}

        <div
          className={`opacity-60 text-[15px] leading-tight text-nowrap overflow-hidden text-ellipsis`}
        >
          {typingData?.roomId === room.id &&
          typingData.roomId !== activeRoom?.id &&
          typingData.typing ? (
            <Typing />
          ) : (
            lastMessage?.text
          )}
        </div>
      </div>
      {unreadMessages && unreadMessages?.length > 0 && (
        <span className='absolute right-2 bottom-2 text-sm w-[22px] h-[22px] shadow-md shadow-white bg-blue-400 text-white rounded-full flex justify-center items-center'>
          {unreadMessages?.length}
        </span>
      )}
    </li>
  )
}

export default RoomItem
