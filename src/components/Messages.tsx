import { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { format } from 'date-fns'
import { GoKebabHorizontal } from 'react-icons/go'
import MenuList from './MenuList'
import { MdOutlineReply } from 'react-icons/md'
import { onReply } from '../store/form/formSlice'

const Messages: FC = () => {
  const dispatch = useAppDispatch()
  const { messages } = useAppSelector((state) => state.messenger)
  const { reply } = useAppSelector((state) => state.form)
  const { areaHeight } = useAppSelector((state) => state.area)
  const { user } = useAppSelector((state) => state.user)
  const [onOpenMenu, setOnOpenMenu] = useState<number | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
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

  console.log(onOpenMenu)

  useEffect(() => {
    scrollToBottom()
  }, [messages, reply, areaHeight])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !event.composedPath().includes(menuRef.current)) {
        setOnOpenMenu(null)
      }
    }
    document.body.addEventListener('click', handleClickOutside)
    return () => {
      document.body.removeEventListener('click', handleClickOutside)
    }
  }, [])
  return (
    <div
      ref={messageBodyRef}
      className={`flex flex-grow-[3] w-full overflow-y-auto bg-slate-200  p-4`}
    >
      <ul className='flex w-full flex-col gap-2'>
        {messages?.map((item, idx) => {
          const author = user?.id === item.userId
          const reply = item.reply
          return (
            <li
              key={idx}
              className={`flex relative ${author && 'justify-end'}`}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={`flex relative flex-col max-w-[510px] max-sm:max-w-[90%] ${author ? 'bg-white' : 'bg-blue-50'} rounded-md px-3 py-1 shadow-outer`}
              >
                <div className='flex gap-4 justify-between'>
                  <span className='text-cyan-700'>
                    {author ? 'you' : item.user?.email.split('@')[0]}
                  </span>

                  {author ? (
                    <div
                      ref={menuRef}
                      onClick={() => openMenuHandler(idx)}
                      className='relative cursor-pointer'
                    >
                      <GoKebabHorizontal size={24} className='text-stone-500' />
                      {onOpenMenu === idx && <MenuList item={messages[idx]} />}
                    </div>
                  ) : (
                    <MdOutlineReply
                      onClick={() => dispatch(onReply(item.id))}
                      className='text-stone-500 hover:text-stone-700 active:text-stone-700 cursor-pointer'
                    />
                  )}
                </div>
                {reply && (
                  <div
                    className={`w-full bg-blue-100 px-3 rounded-r-md border-l-[3px] border-slate-400 text-sm mb-1`}
                  >
                    <span className='text-cyan-700'>
                      {item.reply.user.email.split('@')[0]}
                    </span>
                    <p className='w-[90%] whitespace-nowrap overflow-hidden text-ellipsis'>
                      {reply?.text}
                    </p>
                  </div>
                )}
                <div className=''>
                  <span className=''>{item.text}</span>
                  <span className={`ml-auto opacity-0 pl-3 text-sm`}>
                    {item.updatedAt &&
                      item.createdAt !== item.updatedAt &&
                      'edit '}
                    {format(item.createdAt, 'HH:mm')}
                  </span>
                </div>
                <span
                  className={`absolute bottom-1 right-3 opacity-70 text-sm float-right`}
                >
                  {item.updatedAt &&
                    item.createdAt !== item.updatedAt &&
                    'edit '}
                  {format(item.createdAt, 'HH:mm')}
                </span>
              </div>
              {/* decore (rectangle) */}
              <span
                className={`absolute bottom-0 ${author ? '-right-1' : '-left-1'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${author ? 'border-white' : 'border-blue-50'} `}
              ></span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Messages
