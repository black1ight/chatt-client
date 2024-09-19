import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import useModal from '../../hooks/useModal'
import { IoCreateOutline } from 'react-icons/io5'
import SearchForm from './SearchForm'
import CreateForm from './CreateForm'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import {
  addUnreadMessages,
  IResMessage,
} from '../../store/messenger/messengerSlice'
import { useGetUnreadChats } from '../../hooks/useGetUnreadChats'
import Typing from '../Typing'

export const getUserName = (email: string) => {
  return email.split('@')[0]
}

const Sidebar: FC = () => {
  const dispatch = useAppDispatch()
  const { rooms, activeRoom } = useAppSelector((state) => state.rooms)
  const { messages, unreadMessages } = useAppSelector(
    (state) => state.messenger,
  )
  const { user } = useAppSelector((state) => state.user)

  const { open, onOpen, animation, onClose } = useModal()
  const { dialogCount, updateDialogCount } = useGetUnreadChats()
  const { typingData } = useAppSelector((state) => state.typing)

  useEffect(() => {
    const array: IResMessage[] = []
    user &&
      messages.map((item) => {
        if (item.readUsers.indexOf(user?.id) == -1) {
          array.push(item)
        }
      })
    dispatch(addUnreadMessages(array))
    updateDialogCount()
  }, [messages, rooms])

  return (
    <div
      className={`w-full max-w-[300px] max-sm:max-w-full bg-white py-4 flex flex-col gap-4 transition-transform ${activeRoom && 'max-sm:-translate-x-full max-sm:hidden'}`}
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
        <SearchForm open={open} type='sideBar' />
        <span>
          <IoCreateOutline size={20} onClick={onOpen} />
        </span>
      </div>

      <div className='w-full flex items-center justify-between p-2'>
        <h3 className='px-2'>Your chats</h3>
        {dialogCount > 0 && (
          <span className='text-xs w-6 h-6 shadow-md bg-blue-400 text-white rounded-full flex justify-center items-center'>
            {dialogCount}
          </span>
        )}
      </div>
      <div>
        <ul className='flex flex-col gap-1'>
          {rooms?.map((room) => {
            const lastMessage = unreadMessages
              ?.filter((el) => el.roomId === room.id)
              .pop()

            return (
              <li
                onClick={() => dispatch(addActiveRoom(room))}
                key={room.id}
                className='relative flex gap-2 py-[2px] px-2 cursor-pointer hover:bg-stone-100'
              >
                <div
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${room.color.first}, ${room.color.second})`,
                  }}
                  className={`w-14 h-14 border-2 border-white rounded-full flex justify-center items-center text-white`}
                >
                  {room.id[0].toLocaleUpperCase()}
                </div>
                <div className='flex w-[calc(100%-64px)] flex-col justify-center gap-1 py-1'>
                  <div className=''>{room.id}</div>

                  <div
                    className={`text-sm opacity-70 text-nowrap overflow-hidden text-ellipsis`}
                  >
                    {typingData?.roomId === room.id &&
                    typingData.roomId !== activeRoom?.id &&
                    typingData.typing ? (
                      <Typing />
                    ) : lastMessage ? (
                      lastMessage?.text
                    ) : (
                      room.messages && room.messages[0]?.text
                    )}
                  </div>
                </div>
                {unreadMessages.some((el) => el.roomId === room.id) && (
                  <span className='absolute right-2 top-5 -translate-y-1/2 text-xs w-6 h-6 shadow-md bg-blue-400 text-white rounded-full flex justify-center items-center'>
                    {
                      unreadMessages.filter((msg) => msg.roomId === room.id)
                        .length
                    }
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
