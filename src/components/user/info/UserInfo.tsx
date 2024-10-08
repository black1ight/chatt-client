import { FC } from 'react'
import { useAppSelector } from '../../../store/hooks'
import InfoItem from './InfoItem'
import { IResUser } from '../../../types/types'

const UserInfo: FC = () => {
  const { profile } = useAppSelector((state) => state.user)
  const keysToExtract: (keyof IResUser)[] = ['email', 'user_name']
  const profileArray =
    profile &&
    keysToExtract.map((key) => {
      return { [key]: profile[key as keyof IResUser] }
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
