import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearCurrentUser } from '../../store/search/searchSlice'
import SocketApi from '../../api/socket-api'

interface AddButtonProps {
  setOpenSearch: (arg: boolean) => void
}

const addButton: FC<AddButtonProps> = ({ setOpenSearch }) => {
  const dispatch = useAppDispatch()
  const { currentUsers } = useAppSelector((state) => state.search)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const addUsers = async () => {
    const dto = {
      addUsers: currentUsers?.map((user) => user.id),
    }
    if (activeRoom) {
      SocketApi.socket?.emit('inviteToRoom', { roomId: activeRoom.id, dto })
      dispatch(clearCurrentUser())
      setOpenSearch(false)
    }
  }
  return (
    <button
      onClick={addUsers}
      type='button'
      className='w-1/3 btn-sm border-none hover:shadow-md'
    >
      Add
    </button>
  )
}

export default addButton
