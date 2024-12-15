import { FC } from 'react'
import { BsTrash3 } from 'react-icons/bs'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import SocketApi from '../../api/socket-api'
import { addSelectedMessages } from '../../store/messenger/messengerSlice'

const SelectedMenu: FC = () => {
  const dispatch = useAppDispatch()
  const { selectedMessages } = useAppSelector((state) => state.messenger)

  const deleteSelected = async () => {
    if (window.confirm(`delete ${selectedMessages?.length} messages?`)) {
      selectedMessages?.forEach((message) => {
        SocketApi.socket?.emit('delete-message', message)
      })
      dispatch(addSelectedMessages(null))
    }
  }
  return (
    <div className='h-20 flex justify-center items-center bg-stone-100 '>
      <button onClick={deleteSelected} className='hover:text-rose-800 p-2'>
        <BsTrash3 size={24} />
      </button>
    </div>
  )
}

export default SelectedMenu
