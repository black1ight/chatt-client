import { FC, SyntheticEvent, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addAreaHeight,
  addText,
  onEndWrite,
  onStartWrite,
} from '../store/form/formSlice'

const TextArea: FC = () => {
  const dispatch = useAppDispatch()
  const { text, onWrite, reply } = useAppSelector((state) => state.form)

  const areaRef = useRef<HTMLTextAreaElement>(null)

  const onChangeText = (event: SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement
    dispatch(addText(target.value))
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

  useEffect(() => {
    if (areaRef.current !== null && areaRef.current.scrollHeight < 200) {
      areaRef.current.style.height = `48px`
      areaRef.current.style.height = `${areaRef.current.scrollHeight}px`
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
