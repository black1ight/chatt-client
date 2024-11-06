import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { addEditField, addEditValue } from '../../../store/profile/profileSlice'
import { IResUser } from '../../../types/types'

interface BioProps extends IResUser {}

const Bio: FC<BioProps> = ({ bio }) => {
  const dispatch = useAppDispatch()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { editValue, editField } = useAppSelector((state) => state.profile)
  const onClickHandler = () => {
    dispatch(addEditField('bio'))
    dispatch(addEditValue(bio))
    setTimeout(() => {
      if (textareaRef.current) {
        const length = textareaRef.current.value.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(length, length)
      }
    }, 0)
  }

  useEffect(() => {}, [textareaRef])
  return (
    <div className='bg-white p-3'>
      <div onClick={onClickHandler}>
        {editField && editField === 'bio' ? (
          <textarea
            ref={textareaRef}
            value={editValue || ''}
            onChange={(e) => dispatch(addEditValue(e.currentTarget.value))}
            placeholder='Bio'
            className='w-full outline-none resize-none'
            onFocus={() => dispatch(addEditField('bio'))}
          />
        ) : (
          <p className='text-stone-500'>{bio}</p>
        )}
      </div>
    </div>
  )
}

export default Bio
