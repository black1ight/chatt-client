import { FC } from 'react'
import { IResUser, IUserData } from '../../types/types'
import { getUserName } from '../sidebar/Sidebar'
import { IoClose } from 'react-icons/io5'
import { minusCurrentUser } from '../../store/search/searchSlice'
import { useAppDispatch } from '../../store/hooks'
interface SubscriberItemProps {
  user: IResUser
  id: number
}
const CurrentUserItem: FC<SubscriberItemProps> = ({ user, id }) => {
  const dispatch = useAppDispatch()

  const removeSearchUser = (user: IResUser) => {
    dispatch(minusCurrentUser(user))
  }
  return (
    <li
      className='grid grid-cols-8 items-center gap-2 px-2 py-1 text-stone-500 border-b'
      key={user.email}
    >
      <span className='mx-auto'>{id + 1}.</span>
      <span className='col-span-6'>
        {user.user_name ?? getUserName(user.email!)}
      </span>
      <span
        onClick={() => removeSearchUser(user)}
        className='cursor-pointer mx-auto'
      >
        <IoClose size={20} />
      </span>
    </li>
  )
}

export default CurrentUserItem
