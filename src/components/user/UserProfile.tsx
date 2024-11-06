import { FC } from 'react'
import UserLabel from './UserLabel'
import { IResUser } from '../../types/types'
export interface UserProfileProps extends IResUser {
  size: string
  parent: string
}
const UserProfile: FC<UserProfileProps> = (props) => {
  return (
    <div className='w-full'>
      <UserLabel {...props} />
    </div>
  )
}

export default UserProfile
