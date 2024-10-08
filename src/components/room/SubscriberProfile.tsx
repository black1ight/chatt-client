import { FC } from 'react'
import UserLabel from '../user/UserLabel'
import { getUserName } from '../Sidebar'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { IResUser } from '../../types/types'
import { GrUserAdmin } from 'react-icons/gr'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import { RoomsService } from '../../services/rooms.services'
import UserStatusInfo from '../user/UserStatusInfo'

interface SubscriberProfileProps extends IResUser {}

const SubscriberProfile: FC<SubscriberProfileProps> = (props) => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector((state) => state.user.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  const ownerSubscriber = myProfile?.id == props.id

  const promoteUser = async () => {
    if (
      activeRoom &&
      window.confirm(`promote to owner ${getUserName(props.email!)}`)
    ) {
      const data = await RoomsService.updateRoom(activeRoom.id, {
        promoteUser: props.id,
      })
      if (data) {
        dispatch(addActiveRoom(data))
      }
    }
  }
  return (
    <div className='group flex items-center gap-2 p-2 ml-1'>
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
