import { FC } from 'react'
import { useAppDispatch } from '../store/hooks'
import SocketApi from '../api/socket-api'
import {
  addEditId,
  addText,
  onReply,
  onStartWrite,
  removeText,
} from '../store/form/formSlice'
import {
  addReplayMessage,
  IResMessage,
} from '../store/messenger/messengerSlice'
import { MdDelete, MdEdit, MdOutlineReply } from 'react-icons/md'
const messageMenuList = ['reply', 'edit', 'delete']

interface IMenuListProps {
  item: IResMessage
}

const MenuList: FC<IMenuListProps> = ({ item }) => {
  const dispatch = useAppDispatch()

  const deleteMessageHandler = async () => {
    SocketApi.socket?.emit('server-path', {
      type: 'delete-message',
      id: item.id,
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
      dispatch(onStartWrite())

      dispatch(addEditId(item.id))
    } else if (elem === 'delete') {
      deleteMessageHandler()
      dispatch(removeText())
    } else if (elem === 'reply') {
      dispatch(onReply(item.id))
    }
  }

  return (
    <ul className='absolute z-[100] top-6 right-0 bg-white/70 backdrop-blur-sm rounded-md py-2 border border-slate-300'>
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
