import { FC, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { IResMessage } from '../store/messenger/messengerSlice'
import MessageItem from './messages/MessageItem'
import SocketApi from '../api/socket-api'
import db from '../helpers/db'
import { useLiveQuery } from 'dexie-react-hooks'

const Messages: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { replyId, onWrite } = useAppSelector((state) => state.form)
  const { areaHeight } = useAppSelector((state) => state.area)
  const { user } = useAppSelector((state) => state.user)
  const [onOpenMenu, setOnOpenMenu] = useState<number | null>(null)

  const messageBodyRef = useRef<HTMLDivElement>(null)

  const messages =
    activeRoom &&
    useLiveQuery(
      async (): Promise<IResMessage[] | undefined> =>
        await db
          .table('messages')
          .where('roomId')
          .equals(activeRoom.id)
          .toArray(),
      [activeRoom],
    )

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

  const readMessage = async () => {
    const array: IResMessage[] = []
    onWrite &&
      user &&
      messages?.forEach((item) => {
        if (item.readUsers.indexOf(user?.id) == -1) {
          array.push(item)
        }
      })
    try {
      array.forEach((message) => {
        SocketApi.socket?.emit('read-message', {
          message,
          user,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, replyId, areaHeight])

  useEffect(() => {
    onWrite && readMessage()
  }, [onWrite])

  return (
    <div
      ref={messageBodyRef}
      className={`flex flex-grow-[3] w-full overflow-y-auto bg-white/70 backdrop-blur-sm p-4`}
    >
      <ul className='flex w-full flex-col gap-2'>
        {!messages && (
          <div className='flex justify-center items-center'>
            <h3>Loading...</h3>
          </div>
        )}
        {messages &&
          messages.length > 0 &&
          messages.map((item, idx) => {
            const author = user?.id === item.userId
            const reply = item.reply
            const unread = item.readUsers.indexOf(user?.id!) == -1

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
