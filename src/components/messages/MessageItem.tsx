import { FC } from 'react'
import { IReply, IResMessage } from '../../store/messenger/messengerSlice'
import { GoKebabHorizontal } from 'react-icons/go'
import MenuList from '../MenuList'
import { MdDone, MdDoneAll, MdOutlineReply } from 'react-icons/md'
import { format } from 'date-fns'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { onReply } from '../../store/form/formSlice'
interface MessageItem {
  key: number
  author: boolean
  reply: IReply
  unread: IResMessage | undefined
  item: IResMessage
  index: number
  openMenuHandler: (value: number) => void
  setOnOpenMenu: (value: number | null) => void
  onOpenMenu: number | null
}
const MessageItem: FC<MessageItem> = ({
  author,
  index,
  item,
  reply,
  unread,
  openMenuHandler,
  setOnOpenMenu,
  onOpenMenu,
}) => {
  const dispatch = useAppDispatch()
  const { messages } = useAppSelector((state) => state.messenger)
  return (
    <li key={index} className={`flex relative`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex relative flex-col max-w-[510px] max-sm:max-w-[90%] ${author ? 'bg-white ml-auto' : unread ? 'bg-blue-100' : 'bg-blue-50'} rounded-md px-3 py-1 shadow-outer`}
      >
        <div className='flex gap-4 justify-between'>
          <span className='text-cyan-700'>
            {author ? 'you' : item.user?.email.split('@')[0]}
          </span>

          {author ? (
            <div
              onClick={() => openMenuHandler(index)}
              className='relative cursor-pointer'
            >
              <GoKebabHorizontal size={24} className='text-stone-500' />
              {onOpenMenu === index && (
                <MenuList
                  setOnOpenMenu={(property) => setOnOpenMenu(property)}
                  item={messages[index]}
                />
              )}
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
          <span className='break-words'>{item.text}</span>
          <span
            className={`ml-auto opacity-0 ${author ? 'pl-7' : 'pl-3'} text-sm`}
          >
            {item.updatedAt && item.createdAt !== item.updatedAt && 'edit '}
            {format(item.createdAt, 'HH:mm')}
          </span>
        </div>
        <span
          className={`absolute bottom-1 right-3 flex items-center gap-1 opacity-70 text-sm float-right`}
        >
          {item.updatedAt && item.createdAt !== item.updatedAt && 'edit '}
          {format(item.createdAt, 'HH:mm')}
          {author && (
            <span className='text-cyan-700'>
              {item.readUsers.length > 1 ? (
                <MdDoneAll size={18} />
              ) : (
                <MdDone size={18} />
              )}
            </span>
          )}
        </span>
      </div>
      {/* decore (rectangle) */}
      <span
        className={`absolute bottom-0 ${author ? '-right-1' : '-left-1'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${author ? 'border-white' : unread ? 'border-blue-100' : 'border-blue-50'} `}
      ></span>
    </li>
  )
}

export default MessageItem
