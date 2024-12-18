import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addSelectedMessages } from '../../store/messenger/messengerSlice'
import SocketApi from '../../api/socket-api'

const SelectedHeader: FC = () => {
  const dispatch = useAppDispatch()
  const { selectedMessages } = useAppSelector((state) => state.messenger)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const clearHistory = async () => {
    if (window.confirm('Clear chat?')) {
      SocketApi.socket?.emit('clearHistory', activeRoom?.id)
      dispatch(addSelectedMessages(null))
    }
  }

  return (
    <div className='h-[72px] bg-stone-100 grid grid-cols-3 items-center p-2 text-cyan-700 text-lg'>
      <div onClick={clearHistory} className=''>
        <span className='cursor-pointer hover:bg-stone-200 px-3 py-1 rounded-xl'>
          Clear chat
        </span>
      </div>
      <div className='text-stone-800 text-center'>
        Selected {selectedMessages?.length}
      </div>
      <div
        onClick={() => dispatch(addSelectedMessages(null))}
        className='text-end'
      >
        {' '}
        <span className='cursor-pointer hover:bg-stone-200 px-3 py-1 rounded-xl'>
          Cancel
        </span>
      </div>
    </div>
  )
}

export default SelectedHeader
