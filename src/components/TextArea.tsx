import { FC, useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addEditId, addOnWrite } from '../store/form/formSlice'
import { addText } from '../store/form/textSlise'
import { addAreaHeight } from '../store/form/areaSlice'
import SocketApi from '../api/socket-api'
import debounce from 'lodash.debounce'
import { getUserName } from './Sidebar'

const TextArea: FC = () => {
  const dispatch = useAppDispatch()
  const { onWrite, replyId } = useAppSelector((state) => state.form)
  const { text } = useAppSelector((state) => state.text)
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { areaHeight } = useAppSelector((state) => state.area)

  const areaRef = useRef<HTMLTextAreaElement>(null)

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    dispatch(addText(target.value))
    onTyping()
  }

  const areaOnFocus = () => {
    dispatch(addOnWrite(true))
  }
  const areaOnBlur = () => {
    dispatch(addOnWrite(false))
  }

  const onTyping = useCallback(
    debounce(async () => {
      SocketApi.socket?.emit('typing', {
        userId: user?.id,
        userName: getUserName(user?.email!),
        roomId: activeRoom?.id,
      })
      console.log('write')
    }, 500),
    [activeRoom],
  )

  useEffect(() => {
    onWrite && areaRef.current?.focus()
    replyId && areaRef.current?.focus()
  }, [onWrite, replyId])

  useEffect(() => {
    !text && dispatch(addEditId(null))
    if (areaRef.current !== null && areaRef.current.scrollHeight < 200) {
      areaRef.current.style.height = `48px`
      areaRef.current.style.height = `${areaRef.current.scrollHeight}px`
      areaRef.current.scrollHeight !== areaHeight &&
        dispatch(addAreaHeight(areaRef.current.scrollHeight))
    }
  }, [text])

  return (
    <textarea
      style={{}}
      ref={areaRef}
      onFocus={areaOnFocus}
      onBlur={areaOnBlur}
      onChange={onChangeText}
      placeholder='write...'
      value={text}
      className='px-2 rounded-l-md max-sm:rounded-none resize-none w-full border-none outline-none leading-tight'
      rows={1}
    />
  )
}

export default TextArea
