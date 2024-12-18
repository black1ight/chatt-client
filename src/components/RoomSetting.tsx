import { FC } from 'react'
import { MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addActiveRoom } from '../store/rooms/roomsSlice'
import SocketApi from '../api/socket-api'
import { IoIosRemoveCircle } from 'react-icons/io'

const settingList = ['Clear history', 'Delete chat']

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

  const settingHandler = (el: string) => {
    if (el === 'Clear history') {
      clearHistory()
    } else if (el === 'Delete chat') {
      deleteChat()
    }
  }

  return (
    <div className='absolute z-[100] top-8 right-0 flex flex-col bg-white border rounded-md text-nowrap shadow-xl'>
      {settingList.map((el, id) => {
        return (
          <button
            key={settingList[id]}
            disabled={el === 'Delete chat' && !roomOwner && !isDialog}
            onClick={() => settingHandler(el)}
            className={`flex gap-2 items-center ${settingList[id] !== settingList.at(-1) && 'border-b'} ${el === 'Delete chat' && !roomOwner && !isDialog && 'hidden'} px-4 py-3 hover:bg-slate-100`}
          >
            {el === 'Clear history' ? (
              <MdDelete size={20} />
            ) : (
              <IoIosRemoveCircle size={20} />
            )}
            <span className={`${el === 'Delete chat' && 'text-rose-700'}`}>
              {el}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default RoomSetting
