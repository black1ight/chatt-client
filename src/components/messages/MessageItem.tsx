import { FC, useCallback, useEffect, useRef } from 'react'
import {
  addRef,
  addUnreadMessages,
  IActiveMessage,
  IResMessage,
  removeRef,
} from '../../store/messenger/messengerSlice'

import { format } from 'date-fns'
import Loader from '../Loader'
import { MdDone, MdDoneAll } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import { IResUser } from '../../types/types'
import db from '../../helpers/db'
import UserLabel from '../user/UserLabel'

export interface MessageItemProps {
  author: boolean
  reply: IActiveMessage
  unread: boolean
  item: IResMessage
  itemIndex: number
  isLast: boolean | undefined
  isFirst: boolean | undefined
  isFirstOfDate: boolean | undefined
  isJoined: boolean | undefined
  setRef: (el: HTMLDivElement | null, itemIndex: number) => void
  messagesRefs: (HTMLDivElement | null)[]
  messageBodyRef: HTMLDivElement | null
  selectHandler: (item: IResMessage) => void
}

const MessageItem: FC<MessageItemProps> = (props) => {
  const {
    author,
    isFirst,
    reply,
    isLast,
    isFirstOfDate,
    itemIndex,
    item,
    messagesRefs,
    setRef,
    messageBodyRef,
    isJoined,
    selectHandler,
  } = props
  const isNotWords = item.text.split(' ').some((el) => el.length > 20)

  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { selectedMessages } = useAppSelector((state) => state.messenger)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const replyTextRef = useRef<HTMLParagraphElement>(null)

  const itemRef = messagesRefs[itemIndex] || null

  const textParagrafs = item.text.split('\n')

  let authorProfile = useLiveQuery(
    async (): Promise<IResUser> => await db.table('users').get(item.userId),
    [item],
  )

  const updateItemSize = useCallback((newWidth: number) => {
    if (replyTextRef.current !== null) {
      replyTextRef.current.style.setProperty(
        'width',
        `${newWidth - 30}px`,
        'important',
      )
    }
  }, [])

  const updateVisionItems = useCallback((item: IResMessage) => {
    const unread = item.readUsers.indexOf(user?.id!) == -1
    if (unread) {
      dispatch(addUnreadMessages(item))
    }
  }, [])

  const clickMessageHandler = () => {
    if (selectedMessages && selectedMessages?.length > 0) {
      selectHandler(item)
    }
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const newWidth = entry.contentRect.width
      updateItemSize(newWidth)
    })

    if (itemRef) {
      resizeObserver.observe(itemRef)
    }

    return () => {
      if (itemRef) {
        resizeObserver.unobserve(itemRef)
      }
    }
  }, [itemRef])

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const itemData = {
          messageId: item.id,
          itemIndex,
        }
        if (entry.isIntersecting) {
          dispatch(addRef(itemData))
          isJoined && updateVisionItems(item)
        }
        if (!entry.isIntersecting) {
          dispatch(removeRef(item.id))
        }
      },
      {
        root: messageBodyRef,
        rootMargin: '0px',
        threshold: 0.5,
      },
    )

    if (itemRef) {
      intersectionObserver.observe(itemRef)
    }

    return () => {
      if (itemRef) {
        intersectionObserver.unobserve(itemRef)
        dispatch(removeRef(item.id))
      }
    }
  }, [itemRef, item])

  return (
    <li
      onClick={clickMessageHandler}
      className={`relative flex gap-4 items-center ${(isFirstOfDate || itemIndex === 0) && 'pt-10'}`}
    >
      {(isFirstOfDate || itemIndex === 0) && (
        <div className='absolute z-50 top-1 left-1/2 -translate-x-1/2 bg-white/50 text-message_time/50 px-3 py-1 rounded-xl text-sm'>
          {format(item.createdAt, 'MMMM')} {new Date(item.createdAt).getDate()}
        </div>
      )}
      <div
        className={`relative flex items-end gap-2 max-w-[80%] max-sm:max-w-[calc(100%-3rem)] ${author && 'ml-auto'} ${!author && activeRoom?.type === 'chat' && 'pl-[3rem]'} ${isLast && 'mb-1'} `}
      >
        {activeRoom?.type === 'chat' && authorProfile && !author && isLast && (
          <div className='absolute bottom-0 left-0 rounded-full shadow-md'>
            <UserLabel size='sm' parent='message' {...authorProfile} />
          </div>
        )}
        <div
          ref={(el) => setRef(el, itemIndex)}
          className={`flex relative flex-col text-white' ${author ? 'bg-message_bg_author' : 'bg-message_bg'} ${author && 'ml-auto'} rounded-md ${author ? 'rounded-l-xl' : 'rounded-r-xl'} ${isFirst && author && 'rounded-tr-2xl'} ${isFirst && !author && 'rounded-tl-2xl'} p-2 ${activeRoom?.type === 'chat' && !author && 'pt-1'} shadow-md group`}
        >
          <div className='flex gap-4 justify-between'>
            {!author && activeRoom?.type === 'chat' && (
              <span className={`text-message_username`}>
                {item.user?.email.split('@')[0]}
              </span>
            )}
          </div>
          {reply && (
            <div
              className={`relative ${author ? 'bg-reply_bg_author/10' : 'bg-reply_bg'} px-2 rounded-md ${isFirst && author && 'rounded-tr-xl'} ${isFirst && !author && 'rounded-tl-xl'} text-sm before:content-[''] before:w-[3px] before:h-full ${author ? 'before:bg-reply_border_author/50' : 'before:bg-reply_border'} before:absolute before:left-0 before:z-100 overflow-hidden mb-1`}
            >
              <span
                className={`${author ? 'text-reply_username_author/60' : 'text-reply_username'}`}
              >
                {item.reply.user.email.split('@')[0]}
              </span>
              <p
                ref={replyTextRef}
                className='w-[0px] whitespace-nowrap overflow-hidden text-ellipsis'
              >
                {reply?.text}
              </p>
            </div>
          )}
          <div className=''>
            <span className={`${isNotWords ? 'break-all' : 'break-words'}`}>
              {textParagrafs.map((p, index) => {
                if (p.length > 0) {
                  return (
                    <p
                      key={`${p}-${index}`}
                      className={`${textParagrafs.at(-1) === textParagrafs[index] && 'inline'}`}
                    >
                      {p}
                    </p>
                  )
                } else if (
                  p.length == 0 &&
                  textParagrafs.at(-1) !== textParagrafs[index]
                ) {
                  return <br key={`${p}-${index}`} />
                }
              })}
            </span>
            {/*start fake */}
            <span
              className={`opacity-0 ${author ? 'pl-7' : 'pl-3'} text-xs float-right`}
            >
              {item.updatedAt &&
                item.status !== 'pending' &&
                item.createdAt !== item.updatedAt &&
                'edit '}
              {format(item.createdAt, 'HH:mm')}
            </span>
          </div>
          {/* end fake */}
          <span
            className={`absolute z-50 bottom-2 text-message_time/50 ${author ? 'right-1' : 'right-2'} flex items-end gap-1 opacity-100 text-xs float-right`}
          >
            <span className=''>
              {item.updatedAt &&
                item.status !== 'pending' &&
                item.createdAt !== item.updatedAt &&
                'edit '}
              {format(item.createdAt, 'HH:mm')}
            </span>

            {author && (
              <div>
                {item.status === 'pending' ? (
                  <Loader size='16' />
                ) : (
                  <span className={``}>
                    {item.readUsers.length > 1 ? (
                      <MdDoneAll size={16} />
                    ) : (
                      <MdDone size={16} />
                    )}
                  </span>
                )}
              </div>
            )}
          </span>
          {/* decore (rectangle) */}
          <span
            className={`absolute bottom-0 ${author ? '-right-1' : '-left-1'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${author ? 'border-message_bg_author' : 'border-message_bg'} ${!isLast && 'hidden'}`}
          ></span>
        </div>
      </div>
      {selectedMessages && selectedMessages?.length > 0 && (
        <div
          className={`w-[30px] h-[30px] ${selectedMessages.indexOf(item) !== -1 && 'border border-white'} bg-stone-300 rounded-full flex justify-center items-center max-sm:-order-1`}
        >
          {selectedMessages.indexOf(item) !== -1 && (
            <MdDone size={20} className='text-white' />
          )}
        </div>
      )}
    </li>
  )
}

export default MessageItem
