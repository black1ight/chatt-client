import { FC } from 'react'
import SocketApi from '../../api/socket-api'
import { HiUserAdd } from 'react-icons/hi'
import { useAppSelector } from '../../store/hooks'
import { getGlobalRoomMessages } from '../../helpers/db.helper'

interface JoinProps {
  position?: string
}

const Join: FC<JoinProps> = ({ position }) => {
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const joinToChat = () => {
    const dto = {
      addUsers: [user?.id],
    }
    SocketApi.socket?.emit('inviteToRoom', { roomId: activeRoom?.id, dto })
    activeRoom && getGlobalRoomMessages(activeRoom.id)
  }
  return (
    <button
      onClick={() => joinToChat()}
      className={`bg-slate-200 py-1 px-2 flex gap-4 hover:bg-slate-300 cursor-pointer ${position === 'center' && 'justify-center py-2'} items-center`}
    >
      <HiUserAdd size={24} />

      <span className='col-span-6'>Join</span>
    </button>
  )
}

export default Join
