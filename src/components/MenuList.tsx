import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import SocketApi from '../api/socket-api'
import { addEditId, addOnWrite, onReply } from '../store/form/formSlice'
import {
  addReplayMessage,
  IResMessage,
} from '../store/messenger/messengerSlice'
import { MdDelete, MdEdit, MdOutlineReply } from 'react-icons/md'
import { addText, removeText } from '../store/form/textSlise'
const messageMenuList = ['reply', 'edit', 'delete']

interface IMenuListProps {
  item: IResMessage
  setOnOpenMenu: (property: number | null) => void
  clickPoint: {
    rect: DOMRect
    scrollHeight: number
    scrollTop: number
    x: number
    y: number
  } | null
}

const MenuList: FC<IMenuListProps> = ({ item, setOnOpenMenu, clickPoint }) => {
  const dispatch = useAppDispatch()
  const menuRef = useRef<HTMLUListElement>(null)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const deleteMessageHandler = async () => {
    SocketApi.socket?.emit('delete-message', {
      id: item.id,
      roomId: activeRoom?.id,
      userId: item.userId,
    })
  }

  const menuItemHandler = (elem: string) => {
    if (elem === 'edit') {
      item.reply &&
        dispatch(
          addReplayMessage({
            text: item.reply.text,
            user: {
              email: item.reply.user.email,
              user_name: item.reply.user.user_name,
            },
          }),
        )

      dispatch(addText(item.text))
      dispatch(addOnWrite(true))

      dispatch(addEditId(item.id))
    } else if (elem === 'delete') {
      deleteMessageHandler()
      dispatch(removeText())
    } else if (elem === 'reply') {
      dispatch(onReply(item.id))
    }
    setOnOpenMenu(null)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !event.composedPath().includes(menuRef.current)) {
      setOnOpenMenu(null)
    }
  }

  useEffect(() => {
    if (menuRef.current && clickPoint?.rect) {
      const { rect, scrollTop } = clickPoint
      const clientX = clickPoint.x - rect.left - 5
      const clientY = clickPoint.y - rect.top - 5
      if (rect.width > clientX - rect.left + menuRef.current.clientWidth) {
        menuRef.current.style.setProperty(
          'top',
          `${scrollTop + clientY + 10}px`,
          'important',
        )
        menuRef.current.style.setProperty(
          'left',
          `${clientX + 10}px`,
          'important',
        )
      }
      if (rect.width < clientX + menuRef.current.clientWidth) {
        menuRef.current.style.setProperty(
          'top',
          `${scrollTop + clientY + 10}px`,
          'important',
        )
        menuRef.current.style.setProperty(
          'left',
          `${clientX - menuRef.current.clientWidth + 5}px`,
          'important',
        )
      }
      if (rect.height < clientY + menuRef.current.clientHeight) {
        menuRef.current.style.setProperty(
          'top',
          `${clientY + scrollTop - menuRef.current.clientHeight}px`,
          'important',
        )
        menuRef.current.style.setProperty(
          'left',
          `${clientX + 10}px`,
          'important',
        )
      }
      if (
        rect.height < clientY + menuRef.current.clientHeight &&
        rect.width < clientX + menuRef.current.clientWidth
      ) {
        menuRef.current.style.setProperty(
          'top',
          `${clientY + scrollTop - menuRef.current.clientHeight}px`,
          'important',
        )
        menuRef.current.style.setProperty(
          'left',
          `${clientX - menuRef.current.clientWidth}px`,
          'important',
        )
      }
    }
    document.body.addEventListener('mouseup', handleClickOutside)
    return () => {
      document.body.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  return (
    <ul
      ref={menuRef}
      className={`absolute z-[100] left-0 top-0 backdrop-blur-sm rounded-md border border-slate-300 text-stone-700 text-lg shadow-lg`}
    >
      {messageMenuList.map((elem) => {
        const firstElem = messageMenuList[0] === elem
        const lastElem = messageMenuList[messageMenuList.length - 1] === elem
        return (
          <li
            key={elem}
            onClick={() => menuItemHandler(elem)}
            className={`py-1 px-3 flex flex-row-reverse justify-between items-center gap-2 bg-white/70 active:bg-white/90 hover:bg-white/90 cursor-pointer ${!lastElem && 'border-b border-stone-300'} ${firstElem && 'rounded-t-md'} ${lastElem && 'rounded-b-md'}`}
          >
            <span>
              {elem === 'edit' ? (
                <MdEdit size={20} />
              ) : elem === 'delete' ? (
                <MdDelete size={20} />
              ) : (
                <MdOutlineReply size={20} />
              )}
            </span>
            <span>{elem}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default MenuList
