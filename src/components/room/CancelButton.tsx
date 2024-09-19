import { FC } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { clearCurrentUser } from '../../store/search/searchSlice'
import SearchUsers from './SearchUsers'

interface CancelButtonProps extends SearchUsers {}

const CancelButton: FC<CancelButtonProps> = ({ setOpenSearch }) => {
  const dispatch = useAppDispatch()
  const onCancel = () => {
    dispatch(clearCurrentUser())
    setOpenSearch(false)
  }
  return (
    <button
      type='button'
      onClick={onCancel}
      className='w-1/3 btn-sm border-none hover:shadow-md'
    >
      Cancel
    </button>
  )
}

export default CancelButton
