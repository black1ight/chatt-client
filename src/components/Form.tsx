import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { LuSendHorizonal } from 'react-icons/lu'
import { addText, onEndWrite, onStartWrite } from '../store/form/formSlice'
import SocketApi from '../api/socket-api'

const Form: FC = () => {
  const dispatch = useAppDispatch()
  const { text, editId, onWrite } = useAppSelector((state) => state.form)
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
  }

  const sendMail = async (e: React.FormEvent<HTMLFormElement>) => {
    if (editId && text) {
      e.preventDefault()
      patchMessageHandler()
    } else {
      e.preventDefault()
      SocketApi.socket?.emit('server-path', {
        type: 'new-message',
        text,
        userId: user?.id,
      })
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
  }, [onWrite])
  return (
    <form
      onSubmit={onSubmit}
      className='flex w-full bg-white rounded-b-md max-sm:rounded-none '
    >
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
