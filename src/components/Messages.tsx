import { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addUnreadMessages,
  IResMessage,
  removeUnreadMessages,
} from '../store/messenger/messengerSlice'
import MessageItem from './messages/MessageItem'
import SocketApi from '../api/socket-api'

const Messages: FC = () => {
  const dispatch = useAppDispatch()
  const { messages, unreadMessages } = useAppSelector(
    (state) => state.messenger,
  )
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { reply, onWrite } = useAppSelector((state) => state.form)
  const { areaHeight } = useAppSelector((state) => state.area)
  const { user } = useAppSelector((state) => state.user)
  const [onOpenMenu, setOnOpenMenu] = useState<number | null>(null)

  const messageBodyRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const { current } = messageBodyRef
    if (current !== null) {
      current.scrollTop = current.scrollHeight - current.clientHeight
    }
  }

  const openMenuHandler = (idx: number) => {
    if (onOpenMenu === idx) {
      setOnOpenMenu(null)
    } else {
      setOnOpenMenu(idx)
    }
  }

  const readMessage = async (message: IResMessage) => {
    SocketApi.socket?.emit('server-path', {
      ...message,
      type: 'read-message',
    })
    dispatch(removeUnreadMessages(message.id))
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, reply, areaHeight])

  useEffect(() => {
    const array: IResMessage[] = []
    user &&
      messages.map((item) => {
        if (item.readUsers.indexOf(user?.id) == -1) {
          array.push(item)
        }
      })
    dispatch(addUnreadMessages(array))
  }, [messages, activeRoom])

  useEffect(() => {
    if (unreadMessages.length > 0 && onWrite) {
      readMessage(unreadMessages[0])
    }
  }, [onWrite, unreadMessages])

  return (
    <div
      ref={messageBodyRef}
      className={`flex flex-grow-[3] w-full overflow-y-auto bg-white/70 backdrop-blur-sm p-4`}
    >
      <ul className='flex w-full flex-col gap-2'>
        {messages.length > 0 &&
          messages.map((item, idx) => {
            const author = user?.id === item.userId
            const reply = item.reply
            const unread = unreadMessages.find(
              (message) => message.id === item.id,
            )

            return (
              <MessageItem
                key={idx}
                author={author}
                reply={reply}
                unread={unread}
                item={item}
                index={idx}
                openMenuHandler={openMenuHandler}
                setOnOpenMenu={setOnOpenMenu}
                onOpenMenu={onOpenMenu}
              />
            )
          })}
        <div className='opacity-0 leading-none text-[2px]'>0</div>
      </ul>
    </div>
  )
}

export default Messages
