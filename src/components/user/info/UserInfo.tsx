import { FC } from 'react'
import InfoItem from './InfoItem'
import { IResUser } from '../../../types/types'

interface UserInfoProps extends IResUser {}

const UserInfo: FC<UserInfoProps> = (props) => {
  const keysToExtract: (keyof IResUser)[] = ['email', 'user_name']
  const profileArray =
    props &&
    keysToExtract.map((key) => {
      return { [key]: props[key as keyof IResUser] }
    })

  return (
    <div className='flex flex-col gap-2 bg-white p-3'>
      {profileArray?.map((item) => (
        <InfoItem data={item} key={`${Object.keys(item)}`} />
      ))}
    </div>
  )
}

export default UserInfo
