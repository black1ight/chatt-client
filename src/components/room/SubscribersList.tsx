import { FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { IResUser } from '../../types/types'
import UserLabel from '../user/UserLabel'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { SubscribersProps } from './Subscribers'
import UserStatusInfo from '../user/UserStatusInfo'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'

interface SubscribersListProps extends SubscribersProps {}

const SubscribersList: FC<SubscribersListProps> = (props) => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const myProfile = useAppSelector((state) => state.user.user)

  const roomUsers = activeRoom?.users
    .map((user) => user.id)
    .filter((id) => id !== undefined)

  const users =
    roomUsers &&
    useLiveQuery(
      async (): Promise<IResUser[] | undefined> =>
        await db.table('users').bulkGet(roomUsers),
      [roomUsers.length],
    )

  return (
    <ul className='p-2 max-h-[40vh] overflow-y-auto hide-scrollbar'>
      {users?.map((user) => {
        const userOwner = myProfile?.id === user.id
        return (
          <li
            key={user.email}
            className={`grid grid-cols-6 gap-1 items-center py-[2px] cursor-pointer`}
          >
            <UserLabel parent='room' {...user} size='sm' />
            <UserStatusInfo parent='room' {...user} size='sm' />

            {props.roomOwner && !userOwner ? (
              <button className='opacity-50 hover:opacity-100 ml-auto col-span-1'>
                <IoRemoveCircleOutline
                  onClick={(e) => {
                    e.stopPropagation()
                    props.removeSubscriber(user)
                  }}
                  className=''
                  size={20}
                />
              </button>
            ) : (
              user.id == activeRoom?.owner && (
                <span className='text-stone-500 ml-auto col-span-1'>owner</span>
              )
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default SubscribersList
