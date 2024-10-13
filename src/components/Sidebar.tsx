import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'

import useModal from '../hooks/useModal'
import { IoCreateOutline, IoSettingsOutline } from 'react-icons/io5'
import SearchForm from './sidebar/SearchForm'
import CreateForm from './sidebar/CreateForm'
import { addActiveRoom } from '../store/rooms/roomsSlice'
import { IResMessage } from '../store/messenger/messengerSlice'
import Typing from './Typing'
import { format } from 'date-fns'
import { setIsOpen } from '../store/user/userSlice'
import RoomLabel from './room/RoomLabel'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../helpers/db'
import { IResRoom } from '../types/types'
import { useNewMessagesDialogsCount } from '../helpers/useNewMessagesDialogsCount'

export const getUserName = (email: string) => {
  return email.split('@')[0]
}

const Sidebar: FC = () => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { searchType, searchValue } = useAppSelector((state) => state.search)
  const { unreadDialogs } = useAppSelector((state) => state.messenger)
  const { user } = useAppSelector((state) => state.user)

  const { open, onOpen, animation, onClose } = useModal()

  const { typingData } = useAppSelector((state) => state.typing)

  useNewMessagesDialogsCount()

  const messages = useLiveQuery(
    async (): Promise<IResMessage[] | undefined> =>
      await db.table('messages').toArray(),
    [],
  )

  const rooms = useLiveQuery(async (): Promise<IResRoom[] | undefined> => {
    const data: IResRoom[] = await db.table('rooms').reverse().toArray()
    if (searchValue && searchType === 'rooms') {
      return data.filter((room) =>
        room.id.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }
    return data
  }, [searchValue])

  if (rooms && activeRoom) {
    const isExist = rooms.find((room) => room.id === activeRoom.id)
    !isExist && dispatch(addActiveRoom(null))
  }

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

  return (
    <div
      className={`w-full max-w-[300px] h-[100dvh] max-sm:max-w-full bg-white py-4 flex flex-col gap-4 transition-transform ${activeRoom && 'max-sm:-translate-x-full max-sm:hidden'}`}
    >
      {open && (
        <CreateForm
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          animation={animation}
        />
      )}
      <div className='flex items-center justify-between gap-4 px-3'>
        <span
          onClick={() => {
            dispatch(setIsOpen(true))
          }}
        >
          <IoSettingsOutline size={24} />
        </span>
        <SearchForm open={open} type='sideBar' />
        <span>
          <IoCreateOutline size={24} onClick={onOpen} />
        </span>
      </div>

      <div className='w-full flex items-center justify-between p-2'>
        <h3 className='px-2'>Your chats</h3>
        {unreadDialogs !== null && unreadDialogs > 0 && (
          <span className='text-sm leading-tight w-[22px] h-[22px] shadow-md bg-blue-400 text-white rounded-full flex justify-center items-center'>
            {unreadDialogs}
          </span>
        )}
      </div>
      <div className='flex-grow overflow-y-auto hide-scrollbar'>
        <ul className='flex flex-col'>
          {rooms?.map((room) => {
            const roomMessages = messages?.filter(
              (item) => item.roomId === room.id,
            )

            const lastMessage =
              roomMessages && roomMessages[roomMessages?.length - 1]

            const unreadMessages = roomMessages?.filter((item) => {
              return item.readUsers.indexOf(user?.id!) == -1
            })

            return (
              <li
                onClick={() => dispatch(addActiveRoom(room))}
                key={room.id}
                className='relative h-[70px] flex gap-2 px-2 cursor-pointer hover:bg-stone-100'
              >
                <RoomLabel room={room} type='sidebar' />
                <div className='flex w-[calc(100%-64px)] flex-col justify-center border-b'>
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
          })}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
