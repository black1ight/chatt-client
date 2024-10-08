import { FC } from 'react'
import Modal from '../modal'
import { ModalProps } from '../../hooks/useModal'
import RoomLabel from './RoomLabel'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getUserName } from '../Sidebar'

import { IResUser, IUser } from '../../types/types'
import { RoomsService } from '../../services/rooms.services'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import { CiLogout } from 'react-icons/ci'

import Subscribers from './Subscribers'

interface RoomProfileProps extends ModalProps {}

const RoomProfile: FC<RoomProfileProps> = (props) => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const myProfile = useAppSelector((state) => state.user.user)

  const roomOwner = myProfile?.id == activeRoom?.owner

  const removeSubscriber = async (user: IResUser | IUser) => {
    if (
      window.confirm(
        `${user.id == myProfile?.id ? 'Leave from ' + activeRoom?.id : `Remove ${user.email && getUserName(user.email)}`}`,
      )
    ) {
      if (activeRoom && user.id != myProfile?.id) {
        const data = await RoomsService.updateRoom(activeRoom?.id, {
          removeUser: user.id,
        })
        if (data) {
          dispatch(addActiveRoom(data))
        }
      } else if (activeRoom && user.id == myProfile?.id) {
        const data = await RoomsService.updateRoom(activeRoom?.id, {
          removeUser: user.id,
        })
        if (data) {
          dispatch(addActiveRoom(null))
          props.onClose()
        }
      }
    }
  }

  return (
    <Modal {...props}>
      <div className='w-[300px] py-3.5 flex flex-col gap-2'>
        <div className='p-2 bg-slate-200'>
          <RoomLabel {...props} room={activeRoom!} />
        </div>
        <Subscribers
          {...props}
          roomOwner={roomOwner}
          removeSubscriber={removeSubscriber}
        />
        <button
          disabled={roomOwner}
          onClick={() => removeSubscriber(myProfile!)}
          className={`bg-slate-200 py-1 px-2 flex gap-4 hover:bg-slate-300 cursor-pointer ${roomOwner && 'opacity-50'}`}
        >
          <CiLogout size={24} className={`${!roomOwner && 'text-rose-700'}`} />
          <span className='col-span-6'>Leave</span>
        </button>
      </div>
    </Modal>
  )
}

export default RoomProfile
