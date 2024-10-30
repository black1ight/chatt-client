import { FC, useEffect, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { GoKebabHorizontal } from 'react-icons/go'
import { MdDone, MdDoneAll } from 'react-icons/md'
import MenuList from '../MenuList'
import { MessageItemProps } from './MessageItem'
import { format } from 'date-fns'
import Loader from '../Loader'

interface AuthorVersionProps extends MessageItemProps {
  isNotWords: boolean
}

const AuthorVersion: FC<AuthorVersionProps> = ({
  firstItem,
  item,
  lastItem,
  unread,
  reply,
  itemIndex,
  groupIndex,
  isNotWords,
  groupRefs,
  setRef,
}) => {
  const btnRef = useRef<HTMLDivElement>(null)
  const [onOpenMenu, setOnOpenMenu] = useState<number | null>(null)
  const [itemSize, setItemSize] = useState<number>(0)

  const itemRef =
    groupRefs && groupRefs.length > 0 && groupRefs[groupIndex][itemIndex]

  const openMenuHandler = (idx: number) => {
    if (onOpenMenu === idx) {
      setOnOpenMenu(null)
    } else {
      setOnOpenMenu(idx)
    }
  }

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
      className={`flex relative flex-col bg-sky-600 ml-auto text-white rounded-md ${firstItem === item.id && 'rounded-t-xl rounded-br-xl'} ${firstItem === item.id && 'rounded-l-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-br-xl rounded-tr-xl'} ${lastItem === item.id && 'rounded-bl-xl rounded-s-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-l-xl'} ${lastItem !== item.id && firstItem !== item.id && 'rounded-r-xl'} ${firstItem === item.id && lastItem === item.id && 'rounded-br-none'} px-3 py-1 shadow-outer ${unread && 'shadow-white'} group`}
    >
      <div className='flex gap-4 justify-between'>
        <span className='text-stone-200'>you</span>

        <div
          ref={btnRef}
          onClick={() => openMenuHandler(itemIndex)}
          className='relative cursor-pointer'
        >
          <GoKebabHorizontal size={24} className='text-stone-200' />
          {onOpenMenu === itemIndex && (
            <MenuList
              setOnOpenMenu={(property) => setOnOpenMenu(property)}
              item={item}
              btnRef={btnRef}
            />
          )}
        </div>
      </div>
      {reply && (
        <div
          className={`flex flex-col bg-sky-100 rounded-r-md border-l-[3px] border-sky-400 text-sm mb-1`}
        >
          <span className='text-cyan-700'>
            {item.reply.user.email.split('@')[0]}
          </span>
          <p
            style={{
              width: `${itemSize - 10}px`,
            }}
            className={`w-[250px] whitespace-nowrap overflow-hidden text-ellipsis text-stone-700 flex-shrink-0`}
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
        <span className={`ml-auto opacity-0 pl-7 text-sm`}>
          {item.updatedAt &&
            item.status !== 'pending' &&
            item.createdAt !== item.updatedAt &&
            'edit '}
          {format(item.createdAt, 'HH:mm')}
        </span>
      </div>
      {/* end fake */}
      <span
        className={`absolute bottom-1 right-3 flex items-center gap-1 opacity-100 text-sm float-right text-stone-200`}
      >
        {item.updatedAt &&
          item.status !== 'pending' &&
          item.createdAt !== item.updatedAt &&
          'edit '}
        {format(item.createdAt, 'HH:mm')}

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
      </span>
      {/* decore (rectangle) */}
      <span
        className={`absolute bottom-0 -right-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-sky-600 ${unread && 'border-blue-100'} ${lastItem !== item.id && 'hidden'}`}
      ></span>
    </div>
  )
}

export default AuthorVersion
