import { FC } from 'react'
import { IResUser } from '../../types/types'
import UserLabel from './UserLabel'
import UserStatusInfo from './UserStatusInfo'

interface UsersBlockProps {
  users: IResUser[] | undefined
}

const UsersBlock: FC<UsersBlockProps> = ({ users }) => {
  return (
    <div className='flex flex-col gap-2 p-3'>
      {users?.map((user) => {
        return (
          <div
            key={`${user.email}-${user.socketId}`}
            className='flex gap-2 items-center'
          >
            <UserLabel size='sm' parent='' {...user} />
            <UserStatusInfo size='sm' parent='' {...user} />
          </div>
        )
      })}
    </div>
  )
}

export default UsersBlock
