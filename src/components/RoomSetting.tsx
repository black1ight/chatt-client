import { FC } from 'react'
import { MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addActiveRoom } from '../store/rooms/roomsSlice'
import SocketApi from '../api/socket-api'

const RoomSetting: FC = () => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)

  const roomOwner = activeRoom?.owner === user?.id
  const isDialog = activeRoom?.type === 'dialog'

  const clearHistory = async () => {
    if (window.confirm('Clear history?')) {
      SocketApi.socket?.emit('clearHistory', activeRoom?.id)
    }
  }

  const deleteChat = async () => {
    if (window.confirm('Delete this chat?') && activeRoom) {
      SocketApi.socket?.emit('deleteRoom', activeRoom)
      dispatch(addActiveRoom(null))
    }
  }

  return (
    <div className='absolute z-[100] top-8 right-0 flex flex-col gap-2 bg-white border rounded-md px-3 py-2 text-nowrap'>
      <div onClick={clearHistory} className='flex gap-2 items-center'>
        <MdDelete />
        <span>Clear history</span>
      </div>
      {(roomOwner || isDialog) && (
        <button
          disabled={!roomOwner && !isDialog}
          onClick={deleteChat}
          className='flex gap-2 items-center'
        >
          <span className='text-rose-700'>Delete chat</span>
        </button>
      )}
    </div>
  )
}

export default RoomSetting
