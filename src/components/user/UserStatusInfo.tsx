import { FC } from 'react'
import { getUserName } from '../sidebar/Sidebar'
import { format } from 'date-fns'
import { IUserLabel } from './UserLabel'

interface UserStatusInfoProps extends IUserLabel {}

const UserStatusInfo: FC<UserStatusInfoProps> = (props) => {
  const { email, online, lastSeen, parent } = props
  const longAgo = new Date().getDate() - new Date(lastSeen!).getDate() > 1
  const today = new Date(lastSeen!).getDate() == new Date().getDate()
  const yesterday = new Date(lastSeen!).getDate() == new Date().getDate() - 1
  const room = parent === 'room'
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
    <div className={`flex flex-col col-span-3`}>
      <span>{getUserName(email!)}</span>
      <div className={`${room && 'hidden'} flex gap-1`}>
        {online ? (
          <span className='text-sm text-stone-500'>online</span>
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
    </div>
  )
}

export default UserStatusInfo
