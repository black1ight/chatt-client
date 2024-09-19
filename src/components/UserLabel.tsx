import { FC } from 'react'
import { IResUser } from '../types/types'
import { getUserName } from './sidebar/Sidebar'
import { format } from 'date-fns'

interface IUserLabel extends IResUser {
  type: string
}

const UserLabel: FC<IUserLabel> = ({
  color,
  email,
  user_name,
  type,
  lastSeen,
  online,
}) => {
  const longAgo = new Date().getDate() - new Date(lastSeen!).getDate() > 1
  const today = new Date(lastSeen!).getDate() == new Date().getDate()
  const yesterday = new Date(lastSeen!).getDate() == new Date().getDate() - 1
  const small = type === 'small'
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
    <div className='flex items-center gap-2 col-span-5'>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, ${color.first}, ${color.second})`,
        }}
        className={`${type === 'small' ? 'w-8 h-8' : 'w-14 h-14'} border-2 border-white rounded-full flex justify-center items-center text-white`}
      >
        {user_name ? user_name : email && email[0].toLocaleUpperCase()}
      </div>
      <div className={`flex flex-col`}>
        <span>{getUserName(email!)}</span>
        <div className={`${small && 'hidden'}`}>
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
    </div>
  )
}

export default UserLabel
