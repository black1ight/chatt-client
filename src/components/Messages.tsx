import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  IResMessage,
  removeUnreadMessages,
} from '../store/messenger/messengerSlice'
import SocketApi from '../api/socket-api'
import db from '../helpers/db'
import { useLiveQuery } from 'dexie-react-hooks'
import MenuList from './MenuList'
import MessageItem from './messages/MessageItem'
import useFirstLast from '../hooks/useFirstLast'
import {
  getGlobalRoomMessages,
  removeGlobalRoomMessages,
} from '../helpers/db.helper'

export const scrollToBottom = (ref: HTMLDivElement) => {
  if (ref !== null) {
    setTimeout(() => {
      ref.scrollTop = ref.scrollHeight - ref.clientHeight
    }, 0)
  }
}

interface ClickPointData {
  scrollHeight: number
  scrollTop: number
  rect: DOMRect
  x: number
  y: number
}

const Messages: FC = () => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const entryItems = useAppSelector((state) => state.messenger.messagesRefs)
  const { unreadMessages } = useAppSelector((state) => state.messenger)
  const { replyId } = useAppSelector((state) => state.form)
  const { areaHeight } = useAppSelector((state) => state.area)
  const { user } = useAppSelector((state) => state.user)
  const onOpenMenu = useRef<IResMessage | null>(null)
  const [clickPoint, setClickPoint] = useState<ClickPointData | null>(null)

  const messageBodyRef = useRef<HTMLDivElement>(null)

  const messagesRefs = useRef<(HTMLDivElement | null)[]>([])
  const menuRef = useRef<HTMLUListElement | null>(null)
  const isJoined = activeRoom?.users.some((el) => el.id === user?.id)

  const setRef = (el: HTMLDivElement | null, itemIndex: number) => {
    messagesRefs.current[itemIndex] = el
  }

  const getUnsubRoomMessages = async (roomId: number) => {
    const findRoom = await db.table('rooms').get(roomId)
    if (!findRoom) {
      getGlobalRoomMessages(roomId)
    }
  }

  const removeUnsubRoomMessages = async (roomId: number) => {
    const findRoom = await db.table('rooms').get(roomId)
    if (!findRoom) {
      removeGlobalRoomMessages(roomId)
    }
  }

  const messages =
    activeRoom &&
    useLiveQuery(async (): Promise<IResMessage[] | undefined> => {
      const data = await db
        .table('messages')
        .where('roomId')
        .equals(activeRoom?.id)
        .toArray()

      return data
    }, [activeRoom])

  const { firstItems, lastItems, firstItemsOfDate } = useFirstLast(messages)

  const readMessage = async (messages: IResMessage[]) => {
    try {
      messages?.forEach((message) => {
        SocketApi.socket?.emit('read-message', {
          message,
          user,
        })
      })
      dispatch(removeUnreadMessages())
    } catch (error) {
      console.log(error)
    }
  }

  const onClickMessage = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const target = e.currentTarget as HTMLDivElement
      const rect = target.getBoundingClientRect()

      const clickData = {
        rect,
        scrollHeight: target.scrollHeight,
        scrollTop: target.scrollTop,
        x: 0,
        y: 0,
      }

      if (e instanceof MouseEvent) {
        clickData.x = e.clientX
        clickData.y = e.clientY
      }

      if (e instanceof TouchEvent) {
        clickData.x = e.touches[0].clientX
        clickData.y = e.touches[0].clientY
      }

      setClickPoint(clickData)

      if (messagesRefs && entryItems) {
        entryItems?.forEach((item) => {
          const itemRef = messagesRefs.current[item.itemIndex]
          if (itemRef && e.composedPath().includes(itemRef)) {
            const message = messages?.find((el) => el.id === item.messageId)

            if (onOpenMenu.current) {
              onOpenMenu.current = null
            } else if (message && !onOpenMenu.current) {
              onOpenMenu.current = message
            }
          }
        })
        if (
          onOpenMenu.current &&
          !entryItems.some((item) => {
            const itemRef = messagesRefs.current[item.itemIndex] || null
            return itemRef && e.composedPath().includes(itemRef)
          }) &&
          menuRef.current &&
          !e.composedPath().includes(menuRef.current)
        ) {
          onOpenMenu.current = null
        }
      }
    },
    [entryItems],
  )

  const onCloseMenu = () => {
    onOpenMenu.current = null
  }

  const getMenuRef = (el: HTMLUListElement | null) => {
    el ? (menuRef.current = el) : (menuRef.current = null)
  }

  useEffect(() => {
    messageBodyRef.current && scrollToBottom(messageBodyRef.current)
    console.log('render')
  }, [messages, replyId, areaHeight])

  useEffect(() => {
    activeRoom &&
      activeRoom.type === 'chat' &&
      getUnsubRoomMessages(activeRoom.id)
    return () => {
      activeRoom && removeUnsubRoomMessages(activeRoom.id)
    }
  }, [activeRoom])

  useEffect(() => {
    unreadMessages?.length > 0 && readMessage(unreadMessages)
  }, [unreadMessages])

  useEffect(() => {
    messageBodyRef.current?.addEventListener('click', onClickMessage)
    return () => {
      onCloseMenu()
      messageBodyRef.current?.removeEventListener('click', onClickMessage)
    }
  }, [onClickMessage])

  return (
    <div
      ref={messageBodyRef}
      className={`relative flex flex-grow-[3] w-full overflow-y-auto bg-neutral-200 p-3`}
    >
      {onOpenMenu.current && (
        <MenuList
          item={onOpenMenu.current}
          clickPoint={clickPoint}
          onCloseMenu={onCloseMenu}
          getMenuRef={getMenuRef}
          isJoined={isJoined}
        />
      )}
      <ul className='flex w-full flex-col gap-[3px]'>
        {!messages && (
          <div className='flex justify-center items-center'>
            <h3>Loading...</h3>
          </div>
        )}
        {messages?.map((item, itemIndex) => {
          const author = item.userId === user?.id
          const reply = item.reply
          const unread = item.readUsers.indexOf(user?.id!) == -1
          const isfirst = firstItems?.some((el) => el.id === item.id)
          const islast = lastItems?.some((el) => el.id === item.id)
          const isFirstOfDate = firstItemsOfDate?.some(
            (el) => el.id === item.id,
          )
          return (
            <MessageItem
              key={`${item.createdAt}`}
              messagesRefs={messagesRefs.current}
              messageBodyRef={messageBodyRef.current}
              itemIndex={itemIndex}
              author={author}
              reply={reply}
              unread={unread}
              item={item}
              setRef={setRef}
              isFirst={isfirst}
              isLast={islast}
              isFirstOfDate={isFirstOfDate}
              isJoined={isJoined}
            />
          )
        })}
        <div className='opacity-0 leading-none text-[2px]'>0</div>
      </ul>
    </div>
  )
}

export default Messages
