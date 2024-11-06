import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  clearRefs,
  IResMessage,
  removeUnreadMessages,
} from '../store/messenger/messengerSlice'
import SocketApi from '../api/socket-api'
import db from '../helpers/db'
import { useLiveQuery } from 'dexie-react-hooks'
import useLastMessages from '../hooks/useMessagesGroup'
import MessagesGroup from './messages/MessagesGroup'
import MenuList from './MenuList'

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

  const groupRefs = useRef<(HTMLDivElement | null)[][]>([])
  const menuRef = useRef<HTMLUListElement | null>(null)

  console.log(groupRefs)

  const setRef = (
    el: HTMLDivElement | null,
    groupIndex: number,
    itemIndex: number,
  ) => {
    if (!groupRefs.current[groupIndex]) {
      groupRefs.current[groupIndex] = []
    }
    groupRefs.current[groupIndex][itemIndex] = el
  }

  const messages =
    activeRoom &&
    useLiveQuery(async (): Promise<IResMessage[] | undefined> => {
      const data = await db
        .table('messages')
        .where('roomId')
        .equals(activeRoom.id)
        .toArray()

      return data
    }, [activeRoom])

  const { messagesGroups } = useLastMessages(messages)

  const scrollToBottom = () => {
    const { current } = messageBodyRef
    if (current !== null) {
      setTimeout(() => {
        current.scrollTop = current.scrollHeight - current.clientHeight
      }, 0)
    }
  }

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

      if (groupRefs && entryItems) {
        entryItems?.forEach((item) => {
          const itemRef = groupRefs.current[item.groupIndex][item.itemIndex]
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
            const group = groupRefs.current[item.groupIndex]
            const itemRef = group ? group[item.itemIndex] : null
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
    scrollToBottom()
  }, [messages, replyId, areaHeight])

  useEffect(() => {
    unreadMessages?.length > 0 && readMessage(unreadMessages)
  }, [unreadMessages])

  useEffect(() => {
    messageBodyRef.current?.addEventListener('click', onClickMessage)
    return () => {
      messageBodyRef.current?.removeEventListener('click', onClickMessage)
    }
  }, [onClickMessage])

  return (
    <div
      ref={messageBodyRef}
      className={`relative flex flex-grow-[3] w-full overflow-y-auto bg-neutral-200 p-2`}
    >
      {onOpenMenu.current && (
        <MenuList
          item={onOpenMenu.current}
          clickPoint={clickPoint}
          onCloseMenu={onCloseMenu}
          getMenuRef={getMenuRef}
        />
      )}
      <ul className='flex w-full flex-col gap-2'>
        {!messages && (
          <div className='flex justify-center items-center'>
            <h3>Loading...</h3>
          </div>
        )}
        {messagesGroups?.map((group, groupIndex) => (
          <MessagesGroup
            key={`${groupIndex}-${group.length}`}
            setRef={setRef}
            messages={group}
            groupRefs={groupRefs.current}
            groupIndex={groupIndex}
            messageBodyRef={messageBodyRef.current}
          />
        ))}
        <div className='opacity-0 leading-none text-[2px]'>0</div>
      </ul>
    </div>
  )
}

export default Messages
