import { FC, useCallback, useEffect, useRef } from 'react'
import {
  addRef,
  addUnreadMessages,
  IReply,
  IResMessage,
  removeRef,
} from '../../store/messenger/messengerSlice'

import { format } from 'date-fns'
import Loader from '../Loader'
import { MdDone, MdDoneAll } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export interface MessageItemProps {
  key: number
  author: boolean
  reply: IReply
  unread: boolean
  item: IResMessage
  itemIndex: number
  groupIndex: number
  lastItem: number
  firstItem: number
  setRef: (
    el: HTMLDivElement | null,
    groupIndex: number,
    itemIndex: number,
  ) => void
  groupRefs: (HTMLDivElement | null)[][]
  messageBodyRef: HTMLDivElement | null
}

const MessageItem: FC<MessageItemProps> = (props) => {
  const {
    author,
    firstItem,
    reply,
    unread,
    lastItem,
    groupIndex,
    itemIndex,
    item,
    groupRefs,
    setRef,
    messageBodyRef,
  } = props
  const isNotWords = item.text.split(' ').some((el) => el.length > 20)

  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const replyTextRef = useRef<HTMLParagraphElement>(null)

  const itemRef =
    groupRefs[groupIndex] && groupRefs[groupIndex][itemIndex]
      ? groupRefs[groupIndex][itemIndex]
      : null

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
          groupIndex,
          itemIndex,
        }
        if (entry.isIntersecting) {
          dispatch(addRef(itemData))
          updateVisionItems(item)
        }
        if (!entry.isIntersecting) {
          dispatch(removeRef(itemData))
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
      }
    }
  }, [itemRef])

  return (
    <li key={itemIndex} className={`flex items-end gap-2`}>
      <div
        ref={(el) => setRef(el, groupIndex, itemIndex)}
        className={`flex relative flex-col text-white' ${unread ? 'bg-blue-100' : author ? 'bg-sky-600' : 'bg-white'} ${author && 'ml-auto'} rounded-md ${firstItem === item.id && 'rounded-t-xl rounded-br-xl'} ${firstItem === item.id && 'rounded-l-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-br-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-bl-xl rounded-s-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-l-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-r-xl'} px-[10px] ${author ? 'py-2' : 'py-1'} shadow-outer ${unread && 'shadow-white'} group`}
      >
        <div className='flex gap-4 justify-between'>
          {!author && (
            <span className={`${author ? 'text-white' : 'text-sky-600'}`}>
              {item.user?.email.split('@')[0]}
            </span>
          )}
        </div>
        {reply && (
          <div
            className={`bg-sky-100 px-2 rounded-r-md border-l-[3px] border-sky-400 text-sm mb-1`}
          >
            <span className='text-cyan-700'>
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
          <span
            className={`${isNotWords ? 'break-all' : 'break-words'} ${author && 'text-white'}`}
          >
            {item.text}
          </span>
          {/*start fake */}
          <span
            className={`opacity-0 ${author ? 'pl-7' : 'pl-3'} text-sm float-right`}
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
          className={`absolute bottom-1 right-3 flex items-center gap-1 opacity-100 text-sm float-right ${author ? 'text-stone-200' : 'text-stone-500'}`}
        >
          {item.updatedAt &&
            item.status !== 'pending' &&
            item.createdAt !== item.updatedAt &&
            'edit '}
          {format(item.createdAt, 'HH:mm')}

          {author && (
            <div>
              {item.status === 'pending' ? (
                <Loader size='16' />
              ) : (
                <span className={``}>
                  {item.readUsers.length > 1 ? (
                    <MdDoneAll size={18} />
                  ) : (
                    <MdDone size={18} />
                  )}
                </span>
              )}
            </div>
          )}
        </span>
        {/* decore (rectangle) */}
        <span
          className={`absolute bottom-0 ${author ? '-right-1' : '-left-1'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${unread ? 'border-blue-100' : author ? 'border-sky-600' : 'border-white'} ${lastItem !== item.id && 'hidden'}`}
        ></span>
      </div>
    </li>
  )
}

export default MessageItem
