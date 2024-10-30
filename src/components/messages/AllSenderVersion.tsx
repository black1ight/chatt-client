import { FC, useEffect, useState } from 'react'
import { MdOutlineReply } from 'react-icons/md'
import { MessageItemProps } from './MessageItem'
import { format } from 'date-fns'
import { onReply } from '../../store/form/formSlice'
import { useAppDispatch } from '../../store/hooks'

interface AllSenderVersionProps extends MessageItemProps {
  isNotWords: boolean
}

const AllSenderVersion: FC<AllSenderVersionProps> = ({
  firstItem,
  groupIndex,
  itemIndex,
  item,
  lastItem,
  unread,
  reply,
  isNotWords,
  setRef,
  groupRefs,
}) => {
  const dispatch = useAppDispatch()
  const [itemSize, setItemSize] = useState<number>(0)

  const itemRef =
    groupRefs && groupRefs.length > 0 && groupRefs[groupIndex][itemIndex]

  console.log(itemSize, `${item.text}`)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setItemSize((prevSize) => entry.contentRect.width) // Устанавливаем видимость элемента
    })

    if (itemRef) {
      resizeObserver.observe(itemRef) // Начинаем отслеживать элемент
    }

    return () => {
      if (itemRef) {
        resizeObserver.unobserve(itemRef) // Останавливаем отслеживание
      }
    }
  }, [itemRef])

  return (
    <div
      ref={setRef}
      className={`flex relative flex-col text-white' ${unread ? 'bg-blue-100' : 'bg-white'} rounded-md ${firstItem === item.id && 'rounded-t-xl rounded-br-xl'} ${firstItem === item.id && 'rounded-l-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-br-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-bl-xl rounded-s-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-l-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-r-xl'} px-3 py-1 shadow-outer ${unread && 'shadow-white'} group`}
    >
      <div className='flex gap-4 justify-between'>
        <span className='text-sky-600'>{item.user?.email.split('@')[0]}</span>

        {
          <MdOutlineReply
            onClick={() => dispatch(onReply(item.id))}
            className='opacity-0 text-stone-500 group-hover:opacity-100 active:text-stone-700 cursor-pointer'
          />
        }
      </div>
      {reply && (
        <div
          className={`bg-sky-100 px-3 rounded-r-md border-l-[3px] border-sky-400 text-sm mb-1`}
        >
          <span className='text-cyan-700'>
            {item.reply.user.email.split('@')[0]}
          </span>
          <p
            style={{
              width: `${itemSize - 10}px`,
            }}
            className='w-[250px] whitespace-nowrap overflow-hidden text-ellipsis'
          >
            {reply?.text}
          </p>
        </div>
      )}
      {/*start fake */}
      <div className=''>
        <span className={`${isNotWords ? 'break-all' : 'break-words'}`}>
          {item.text}
        </span>
        <span className={`ml-auto opacity-0 pl-3 text-sm`}>
          {item.updatedAt &&
            item.status !== 'pending' &&
            item.createdAt !== item.updatedAt &&
            'edit '}
          {format(item.createdAt, 'HH:mm')}
        </span>
      </div>
      {/* end fake */}
      <span
        className={`absolute bottom-1 right-3 flex items-center gap-1 opacity-100 text-sm float-right text-stone-400`}
      >
        {item.updatedAt &&
          item.status !== 'pending' &&
          item.createdAt !== item.updatedAt &&
          'edit '}
        {format(item.createdAt, 'HH:mm')}
      </span>
      {/* decore (rectangle) */}
      <span
        className={`absolute bottom-0 -left-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] ${unread ? 'border-blue-100' : 'border-white'} ${lastItem !== item.id && 'hidden'}`}
      ></span>
    </div>
  )
}

export default AllSenderVersion
