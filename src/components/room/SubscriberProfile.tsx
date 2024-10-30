import { FC } from 'react'
import UserLabel from '../user/UserLabel'
import { getUserName } from '../sidebar/Sidebar'
import { useAppSelector } from '../../store/hooks'
import { IResUser } from '../../types/types'
import { GrUserAdmin } from 'react-icons/gr'
import UserStatusInfo from '../user/UserStatusInfo'
import SocketApi from '../../api/socket-api'

interface SubscriberProfileProps extends IResUser {
  setProfile: () => void
}

const SubscriberProfile: FC<SubscriberProfileProps> = (props) => {
  const myProfile = useAppSelector((state) => state.user.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const ownerSubscriber = myProfile?.id == props.id

  const promoteUser = async () => {
    if (
      activeRoom &&
      myProfile?.id === activeRoom.owner &&
      window.confirm(`promote to owner ${getUserName(props.email!)}`)
    ) {
      SocketApi.socket?.emit('promoteUser', {
        roomId: activeRoom.id,
        dto: {
          promoteUser: props.id,
        },
      })
    }
  }

  return (
    <div
      onClick={() => props.setProfile()}
      className='group flex items-center gap-2 py-2'
    >
      <UserLabel size='' parent='' {...props} />
      <UserStatusInfo size='' parent='' {...props} />
      {!ownerSubscriber && props.id !== activeRoom?.owner ? (
        <GrUserAdmin
          onClick={promoteUser}
          size={20}
          className='opacity-20 hover:opacity-100 ml-auto cursor-pointer'
        />
      ) : (
        <span className='ml-auto opacity-50'>owner</span>
      )}
    </div>
  )
}

export default SubscriberProfile
