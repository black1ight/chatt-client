import { FC } from 'react'
import { getUserName } from '../sidebar/Sidebar'
import { format } from 'date-fns'
import { IUserLabel } from './UserLabel'
import Typing from '../Typing'
import { useAppSelector } from '../../store/hooks'

interface UserStatusInfoProps extends IUserLabel {
  onSelectUser?: () => void
}

const UserStatusInfo: FC<UserStatusInfoProps> = (props) => {
  const { typingData } = useAppSelector((state) => state.typing)
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { email, online, lastSeen, parent, onSelectUser } = props
  const longAgo =
    new Date().getDate() - new Date(lastSeen!).getDate() > 1 ||
    new Date().getDate() - new Date(lastSeen!).getDate() < 0
  const today = new Date(lastSeen!).getDate() == new Date().getDate()
  const yesterday = new Date(lastSeen!).getDate() == new Date().getDate() - 1
  const getlastSeenDay = () => {
    if (today) {
      return 'today'
    }
    if (yesterday) {
      return 'yesterday'
    }
    if (longAgo) {
      return format(lastSeen!, 'dd/MM/yyyy')
    }
  }

  return (
    <div onClick={onSelectUser} className={`flex flex-col col-span-4`}>
      <span>{getUserName(email!)}</span>
      {typingData?.userId !== user?.id &&
      parent !== 'userProfile' &&
      typingData?.roomId === activeRoom?.id &&
      typingData?.typing ? (
        <Typing />
      ) : (
        <div className={`flex gap-1`}>
          {online ? (
            <span className='text-sm text-cyan-700'>online</span>
          ) : (
            <span className='text-sm text-stone-500'>
              Last seen {getlastSeenDay()}
            </span>
          )}
          {!longAgo && !online && (
            <span className='text-sm text-stone-500'>
              at {format(lastSeen, 'HH:mm')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default UserStatusInfo
