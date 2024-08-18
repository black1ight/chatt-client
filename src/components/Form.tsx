import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { LuSendHorizonal } from 'react-icons/lu'
import {
  addText,
  onEndWrite,
  onReply,
  onStartWrite,
  removeEditId,
  removeText,
} from '../store/form/formSlice'
import SocketApi from '../api/socket-api'
import Reply from './Reply'
import Loader from './Loader'
import { changeIsLoading } from '../store/helpers/helpersSlice'

const Form: FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.helpers)
  const { text, editId, onWrite, reply } = useAppSelector((state) => state.form)

  const { user } = useAppSelector((state) => state.user)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(addText(event.target.value))
  }

  const patchMessageHandler = async () => {
    SocketApi.socket?.emit('server-path', {
      type: 'update-message',
      id: editId,
      text,
    })
    dispatch(removeText())
    dispatch(removeEditId())
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
      })
      dispatch(onReply(null))
      dispatch(removeText())
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    sendMail(e)
    areaRef.current?.focus()
  }

  const areaOnFocus = () => {
    dispatch(onStartWrite())
  }
  const areaOnBlur = () => {
    dispatch(onEndWrite())
  }

  useEffect(() => {
    onWrite && areaRef.current?.focus()
    reply && areaRef.current?.focus()
  }, [onWrite, reply])
  return (
    <form
      onSubmit={onSubmit}
      className='relative flex items-center w-full bg-white rounded-b-md max-sm:rounded-none '
    >
      {reply && (
        <div className='absolute bg-slate-100 w-full -translate-y-full border'>
          <Reply />
        </div>
      )}

      <textarea
        ref={areaRef}
        onFocus={areaOnFocus}
        onBlur={areaOnBlur}
        onChange={onChangeText}
        placeholder='write...'
        value={text}
        className='p-2 rounded-l-md max-sm:rounded-none resize-none w-full border-none outline-none'
        rows={2}
      />
      {isLoading && (
        <div className='absolute right-3'>
          <Loader />
        </div>
      )}

      <button
        disabled={!text}
        className={`flex relative ${text ? 'translate-x-0' : 'translate-x-20'} items-center px-4 rounded-r-md max-sm:rounded-none transition-transform`}
      >
        <LuSendHorizonal className=' text-slate-700' size={28} />
      </button>
    </form>
  )
}

export default Form
