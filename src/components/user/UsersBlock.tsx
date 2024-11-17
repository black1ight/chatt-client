import { FC } from 'react'
import { IResRoom, IResUser } from '../../types/types'
import UserLabel from './UserLabel'
import UserStatusInfo from './UserStatusInfo'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getUserName } from '../sidebar/Sidebar'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import db from '../../helpers/db'

interface UsersBlockProps {
  users: IResUser[] | undefined
}

const UsersBlock: FC<UsersBlockProps> = ({ users }) => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.user?.profile)

  const onSelectUser = (opponent: IResUser) => {
    db.table('users').put(opponent)
    const newRoom: IResRoom = {
      id: Date.now(),
      name: opponent.username || getUserName(opponent.email!),
      type: 'dialog',
      isTemp: true,
      color: null,
      imageUrl: null,
      owner: null,
      createdAt: new Date().toISOString(),
      messages: [],
      users: [profile!, opponent],
    }
    dispatch(addActiveRoom(newRoom))
  }
  return (
    <div className='flex flex-col gap-2 p-3'>
      {users?.map((user) => {
        return (
          <div
            onClick={() => onSelectUser(user)}
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
