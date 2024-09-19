import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { LuSendHorizonal } from 'react-icons/lu'
import { addEditId, onReply } from '../store/form/formSlice'
import SocketApi from '../api/socket-api'
import { changeIsLoading } from '../store/helpers/helpersSlice'
import { addReplayMessage } from '../store/messenger/messengerSlice'
import TextArea from './TextArea'
import { removeText } from '../store/form/textSlise'

const Form: FC = () => {
  const dispatch = useAppDispatch()
  const { editId, onWrite, reply } = useAppSelector((state) => state.form)
  const { text } = useAppSelector((state) => state.text)
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const areaRef = useRef<HTMLTextAreaElement>(null)

  const patchMessageHandler = async () => {
    SocketApi.socket?.emit('server-path', {
      type: 'update-message',
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

  const sendMail = async (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(changeIsLoading('fetch'))
    if (editId && text) {
      e.preventDefault()
      patchMessageHandler()
    } else {
      e.preventDefault()
      SocketApi.socket?.emit('server-path', {
        reply,
        type: 'new-message',
        text,
        userId: user?.id,
        roomId: activeRoom?.id,
      })
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
    reply && areaRef.current?.focus()
  }, [onWrite, reply])
  return (
    <form
      onSubmit={onSubmit}
      className='relative flex items-end w-full bg-white rounded-b-md max-sm:rounded-none border-t border-stone-300 py-3'
    >
      <TextArea />

      {/* {isLoading && (
        <div className='absolute right-3'>
          <Loader />
        </div>
      )} */}

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
