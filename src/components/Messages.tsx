import { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { format } from 'date-fns'
import { GoKebabHorizontal } from 'react-icons/go'
import MenuList from './MenuList'
import { MdOutlineReply } from 'react-icons/md'
import { onReply } from '../store/form/formSlice'
import { IResMessage } from '../store/messenger/messengerSlice'

const Messages: FC = () => {
  const dispatch = useAppDispatch()
  const { messages } = useAppSelector((state) => state.messenger)
  const { onWrite } = useAppSelector((state) => state.form)
  const { user } = useAppSelector((state) => state.user)
  const [onOpenMenu, setOnOpenMenu] = useState<number | null>(null)

  const messagesRef = useRef<HTMLDivElement>(null)

  const scrollToElement = () => {
    const { current } = messagesRef
    if (current !== null) {
      current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openMenuHandler = (idx: number) => {
    if (onOpenMenu === idx) {
      setOnOpenMenu(null)
    } else {
      setOnOpenMenu(idx)
    }
  }

  useEffect(() => {
    scrollToElement()
  }, [messages, onWrite])
  return (
    <div className='flex bg-white h-full overflow-y-scroll w-full rounded-md max-sm:rounded-none p-4'>
      <ul className='flex w-full flex-col gap-2'>
        {messages?.map((item, idx) => {
          const author = user?.id === item.userId
          const replyMessage: IResMessage = JSON.parse(item.replyMessage)

          return (
            <li
              key={idx}
              className={`flex relative ${author && 'justify-end'}`}
            >
              <div
                className={`flex relative flex-col max-w-[80%] ${author ? 'bg-slate-200' : 'bg-stone-200'} rounded-md px-3 py-1 `}
              >
                {replyMessage && (
                  <div
                    className={`w-full bg-slate-300 px-3 mt-2 rounded-r-md border-l-[3px] border-slate-400`}
                  >
                    <span className='text-cyan-700'>
                      {replyMessage?.user.email.split('@')[0]}
                    </span>
                    <p className='w-[90%] whitespace-nowrap overflow-hidden text-ellipsis'>
                      {replyMessage?.text}
                    </p>
                  </div>
                )}
                <div className='flex gap-4 justify-between'>
                  <span className='text-cyan-700'>
                    {author ? 'you' : item.user?.email.split('@')[0]}
                  </span>

                  {author ? (
                    <div
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
                className={`absolute bottom-0 ${author ? '-right-1' : '-left-1'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${author ? 'border-slate-200' : 'border-stone-200'} `}
              ></span>
            </li>
          )
        })}
        <div ref={messagesRef}></div>
      </ul>
    </div>
  )
}

export default Messages
