import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addEditField, addEditValue } from '../../store/profile/profileSlice'
import SocketApi from '../../api/socket-api'

const Buttons: FC = () => {
  const dispatch = useAppDispatch()
  const { editValue, editField } = useAppSelector((state) => state.profile)
  const { user } = useAppSelector((state) => state.user)

  const saveHandler = () => {
    if (editField) {
      const patchData = {
        [editField]: editValue,
      }
      SocketApi.socket?.emit('editUser', {
        userId: user?.id,
        dto: patchData,
      })
    }
    dispatch(addEditField(null))
    dispatch(addEditValue(null))
  }
  const cancelHandler = () => {
    dispatch(addEditField(null))
    dispatch(addEditValue(null))
  }

  useEffect(() => {
    return () => {
      saveHandler()
    }
  }, [])
  return (
    <div className='flex gap-2 justify-center px-3 text-stone-500'>
      <button
        onClick={cancelHandler}
        className='btn-sm w-1/2 bg-white hover:text-stone-700 hover:shadow-sm'
      >
        Cancel
      </button>
      <button
        disabled={!editValue}
        onClick={saveHandler}
        className={`btn-sm w-1/2 bg-white hover:text-stone-700 hover:shadow-sm ${!editValue && 'opacity-50'}`}
      >
        Save
      </button>
    </div>
  )
}

export default Buttons
