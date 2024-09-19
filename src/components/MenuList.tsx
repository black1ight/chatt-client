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
}

const MenuList: FC<IMenuListProps> = ({ item, setOnOpenMenu }) => {
  const dispatch = useAppDispatch()
  const menuRef = useRef<HTMLUListElement>(null)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const deleteMessageHandler = async () => {
    SocketApi.socket?.emit('server-path', {
      type: 'delete-message',
      id: item.id,
      roomId: activeRoom?.id,
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
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !event.composedPath().includes(menuRef.current)) {
      setOnOpenMenu(null)
    }
  }
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside)
    return () => {
      document.body.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <ul
      ref={menuRef}
      className='absolute z-[100] top-6 right-0 bg-white/70 backdrop-blur-sm rounded-md py-2 border border-slate-300'
    >
      {messageMenuList.map((elem) => {
        return (
          <li
            key={elem}
            onClick={() => menuItemHandler(elem)}
            className='py-1 px-3 flex items-center gap-2 active:bg-stone-300 cursor-pointer'
          >
            <span>
              {elem === 'edit' ? (
                <MdEdit />
              ) : elem === 'delete' ? (
                <MdDelete />
              ) : (
                <MdOutlineReply />
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
