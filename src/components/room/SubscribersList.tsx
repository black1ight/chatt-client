import { FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { IResUser } from '../../types/types'
import UserLabel from '../user/UserLabel'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { SubscribersProps } from './Subscribers'
import UserStatusInfo from '../user/UserStatusInfo'

interface SubscribersListProps extends SubscribersProps {
  setOpenSubscriberProfile: (user: IResUser) => void
}

const SubscribersList: FC<SubscribersListProps> = (props) => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const myProfile = useAppSelector((state) => state.user.user)

  return (
    <ul className='p-2'>
      {activeRoom?.users.map((user) => {
        const userOwner = myProfile?.id == user.id
        return (
          <li
            key={user.email}
            onClick={() => {
              props.setOpenSubscriberProfile(user)
            }}
            className='grid grid-cols-6 gap-1 items-center py-[2px] cursor-pointer'
          >
            <UserLabel parent='room' {...user} size='small' />
            <UserStatusInfo parent='room' {...user} size='small' />

            {props.roomOwner && !userOwner ? (
              <button className='opacity-50 hover:opacity-100 ml-auto col-span-2'>
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
              user.id == activeRoom.owner && (
                <span className='text-stone-500 ml-auto col-span-2'>owner</span>
              )
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default SubscribersList
