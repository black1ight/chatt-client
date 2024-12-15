import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { LuSendHorizonal } from 'react-icons/lu'
import { addEditId, onReply } from '../store/form/formSlice'
import SocketApi from '../api/socket-api'
import { changeIsLoading } from '../store/helpers/helpersSlice'
import {
  addReplayMessage,
  IResMessage,
} from '../store/messenger/messengerSlice'
import TextArea from './TextArea'
import { removeText } from '../store/form/textSlise'
import db from '../helpers/db'
import { IResRoom, IRoomData } from '../types/types'
import { addActiveRoom } from '../store/rooms/roomsSlice'

const Form: FC = () => {
  const dispatch = useAppDispatch()
  const { editId, onWrite, replyId } = useAppSelector((state) => state.form)
  const { text } = useAppSelector((state) => state.text)
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const areaRef = useRef<HTMLTextAreaElement>(null)

  const patchMessageHandler = async () => {
    SocketApi.socket?.emit('update-message', {
      id: editId,
      text,
      roomId: activeRoom?.id,
      userId: user?.id,
    })
    dispatch(addReplayMessage(null))
    dispatch(onReply(null))
    dispatch(removeText())
    dispatch(addEditId(null))
  }

  const getReplyData = async (replyId: number | null) => {
    if (replyId) {
      const replyMessage: IResMessage = await db.table('messages').get(replyId)
      if (replyMessage) {
        const { text, user } = replyMessage
        return { text, user }
      }
      return null
    }
  }

  const createRoom = async (room: IResRoom) => {
    const roomData: IRoomData = {
      name: room.name,
      type: room.type,
      users: room.users
        .map((user) => user.id)
        .filter((id): id is number => id !== undefined),
      color: room.color,
      owner: room.owner,
    }

    SocketApi.socket?.emit('createRoom', roomData)
  }

  const sendMail = async (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(changeIsLoading('fetch'))
    if (editId && text) {
      e.preventDefault()
      patchMessageHandler()
    } else {
      e.preventDefault()

      const replyData = await getReplyData(replyId)
      let newMessageDto = {
        id: Date.now(),
        reply: replyData,
        replyId,
        text,
        userId: user?.id,
        user,
        roomId: activeRoom?.id,
        readUsers: [user?.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
      }
      if (activeRoom?.isTemp) {
        db.table('messages').add(newMessageDto)
        createRoom(activeRoom)

        SocketApi.socket?.once('newDialog', (newDialog: IResRoom) => {
          SocketApi.socket?.emit('new-message', {
            ...newMessageDto,
            roomId: newDialog.id,
          })
          SocketApi.socket?.once('newMessage', () => {
            dispatch(addActiveRoom(newDialog))
          })
        })
      } else {
        await db.table('messages').add(newMessageDto)
        SocketApi.socket?.emit('new-message', newMessageDto)
      }

      dispatch(addReplayMessage(null))
      dispatch(onReply(null))
      dispatch(removeText())
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    sendMail(e)
    areaRef.current?.focus()
  }

  useEffect(() => {
    if (onWrite) {
      areaRef.current?.focus()
    }
    replyId && areaRef.current?.focus()
  }, [onWrite, replyId])
  return (
    <form
      onSubmit={onSubmit}
      className='relative flex items-end w-full bg-white  max-sm:rounded-none border-t border-stone-300 py-[14px]'
    >
      <TextArea />

      <button
        disabled={!text}
        className={`flex relative ${text ? 'translate-x-0' : 'translate-x-20'} items-center px-4 py-3 rounded-r-md max-sm:rounded-none transition-transform`}
      >
        <LuSendHorizonal className=' text-slate-700' size={28} />
      </button>
    </form>
  )
}

export default Form
