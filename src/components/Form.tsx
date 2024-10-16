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

const Form: FC = () => {
  const dispatch = useAppDispatch()
  const { editId, onWrite, replyId } = useAppSelector((state) => state.form)
  const { text } = useAppSelector((state) => state.text)
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { lastId } = useAppSelector((state) => state.messenger)

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

  const sendMail = async (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(changeIsLoading('fetch'))
    if (editId && text) {
      e.preventDefault()
      patchMessageHandler()
    } else {
      e.preventDefault()
      const replyData = await getReplyData(replyId)
      const newMessageDto = {
        id: lastId! + 1,
        reply: replyData,
        replyId,
        text,
        userId: user?.id,
        user,
        roomId: activeRoom?.id,
        readUsers: [user?.id],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
      }

      await db.table('messages').add(newMessageDto)

      SocketApi.socket?.emit('new-message', newMessageDto)
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
      className='relative flex items-end w-full bg-white rounded-b-md max-sm:rounded-none border-t border-stone-300 py-3'
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
