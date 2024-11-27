import { FC } from 'react'
import { IResRoom, IResUser } from '../../types/types'
import RoomLabel from './RoomLabel'
import { IResMessage } from '../../store/messenger/messengerSlice'
import { format } from 'date-fns'
import { useAppSelector } from '../../store/hooks'
import { getUserName } from '../sidebar/Sidebar'
import Typing from '../Typing'
import { MdGroup } from 'react-icons/md'
import UserLabel from '../user/UserLabel'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'

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
  const isJoined = room.users.some((el) => el.id === user?.id)

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
  const isChat = room.type === 'chat'
  const isDialog = room.type === 'dialog'

  const companion = room.users.find((el) => el.id !== user?.id)
  const companionGlobal = useLiveQuery(async (): Promise<
    IResUser | undefined
  > => {
    return await db.table('users').get(companionGlobal?.id || 0)
  }, [activeRoom])

  return (
    <li
      onClick={() => onChangeRoom(room)}
      className={`relative h-[70px] ${global && 'h-auto py-1'} flex gap-2 px-2 cursor-pointer hover:bg-stone-100`}
    >
      {isChat && <RoomLabel room={room} type={type} />}{' '}
      {isDialog && (companion || companionGlobal) && (
        <UserLabel
          size=''
          parent='dialog'
          {...(companion || companionGlobal!)}
        />
      )}
      <div
        className={`flex w-[calc(100%-64px)] flex-col py-[7px] ${!global && 'border-b'}`}
      >
        <div className='flex gap-2 justify-between items-center'>
          {isChat && <MdGroup size={20} opacity={0.7} />}
          <span className='flex-grow font-medium text-nowrap overflow-hidden text-ellipsis'>
            {isChat ? room.name : companion?.username}
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
        {!global && lastMessage && isChat && (
          <span className='text-[15px] text-stone-900 leading-tight'>
            {lastMessage.user.id === user?.id
              ? 'you'
              : (lastMessage?.user.username ??
                getUserName(lastMessage?.user.email))}
          </span>
        )}
        {!global && (
          <div
            className={`opacity-70 text-[15px] leading-tight ${isChat && 'text-nowrap'} overflow-hidden text-ellipsis ${isDialog && 'line-clamp-2'}`}
          >
            {typingData?.roomId === room.id &&
            typingData.roomId !== activeRoom?.id &&
            typingData.typing ? (
              <Typing />
            ) : (
              lastMessage?.text || 'Chat has been created'
            )}
          </div>
        )}
      </div>
      {unreadMessages && isJoined && unreadMessages?.length > 0 && (
        <span className='absolute right-2 bottom-2 text-sm w-[22px] h-[22px] shadow-md shadow-white bg-blue-400 text-white rounded-full flex justify-center items-center'>
          {unreadMessages?.length}
        </span>
      )}
    </li>
  )
}

export default RoomItem
