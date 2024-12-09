import { FC } from 'react'
import InfoItem from './InfoItem'
import { IResUser } from '../../../types/types'

interface UserInfoProps extends IResUser {}

const UserInfo: FC<UserInfoProps> = (props) => {
  const keysToExtract: (keyof IResUser)[] = ['username', 'phone', 'email']
  const profileArray =
    props &&
    keysToExtract.map((key) => {
      return { [key]: props[key as keyof IResUser] }
    })

  return (
    <div className='flex flex-col gap-8 bg-white px-3 py-6'>
      {profileArray?.map((item) => (
        <InfoItem data={item} key={`${Object.keys(item)}`} />
      ))}
    </div>
  )
}

export default UserInfo
