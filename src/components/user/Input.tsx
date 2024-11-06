import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addEditValue } from '../../store/profile/profileSlice'

const Input: FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()
  const { editValue } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (inputRef.current) {
      const length = inputRef.current.value.length
      inputRef.current.focus()
      inputRef.current.setSelectionRange(length, length)
    }
  }, [])
  return (
    <div>
      <input
        ref={inputRef}
        value={editValue || ''}
        onChange={(e) => dispatch(addEditValue(e.currentTarget.value))}
        placeholder='input'
        className='outline-none'
      />
    </div>
  )
}

export default Input
