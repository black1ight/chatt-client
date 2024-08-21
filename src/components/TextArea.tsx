import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addEditId, addOnWrite } from '../store/form/formSlice'
import { addText } from '../store/form/textSlise'
import { addAreaHeight } from '../store/form/areaSlice'

const TextArea: FC = () => {
  const dispatch = useAppDispatch()
  const { onWrite, reply } = useAppSelector((state) => state.form)
  const { text } = useAppSelector((state) => state.text)
  const { areaHeight } = useAppSelector((state) => state.area)

  const areaRef = useRef<HTMLTextAreaElement>(null)

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    dispatch(addText(target.value))
  }

  const areaOnFocus = () => {
    dispatch(addOnWrite(true))
  }
  const areaOnBlur = () => {
    dispatch(addOnWrite(false))
  }
  useEffect(() => {
    onWrite && areaRef.current?.focus()
    reply && areaRef.current?.focus()
  }, [onWrite, reply])

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
