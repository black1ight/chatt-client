import { FC, useEffect } from 'react'
import Modal from '../modal'
import { ModalProps } from '../../hooks/useModal'
import RoomLabel from './RoomLabel'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getUserName } from '../sidebar/Sidebar'
import { IResRoom, IResUser, IUser } from '../../types/types'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import Subscribers from './Subscribers'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'
import SocketApi from '../../api/socket-api'
import Join from './Join'
import Leave from './Leave'
import { removeGlobalRoomMessages } from '../../helpers/db.helper'

interface RoomProfileProps extends ModalProps {}

export const checkSubscribe = (room: IResRoom, id: number) => {
  const find = room.users.find((user) => user.id === id)
  if (find) return true
  return false
}

const RoomProfile: FC<RoomProfileProps> = (props) => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const myProfile = useAppSelector((state) => state.user.user)

  const room = useLiveQuery(
    async (): Promise<IResRoom | undefined> =>
      await db.table('rooms').get(activeRoom?.id!),
    [],
  )

  useEffect(() => {
    room && dispatch(addActiveRoom(room))
  }, [room])

  const roomOwner = myProfile?.id == activeRoom?.owner
  const isSubscribe = checkSubscribe(activeRoom!, myProfile!.id)

  const removeSubscriber = async (user: IResUser | IUser) => {
    if (
      isSubscribe &&
      window.confirm(
        `${user.id == myProfile?.id ? 'Leave from ' + activeRoom?.id : `Remove ${user.email && getUserName(user.email)}`}`,
      )
    ) {
      if (activeRoom && user.id != myProfile?.id) {
        SocketApi.socket?.emit('excludeFromRoom', {
          roomId: activeRoom.id,
          removeUser: user.id,
        })
      } else if (activeRoom && user.id == myProfile?.id) {
        SocketApi.socket?.emit('excludeFromRoom', {
          roomId: activeRoom.id,
          removeUser: user.id,
        })
        removeGlobalRoomMessages(activeRoom.id)
        dispatch(addActiveRoom(null))
      }
    }
  }

  useEffect(() => {
    return () => {
      props.onClose()
    }
  }, [])

  return (
    <Modal {...props}>
      <div className='w-[300px] py-3.5 flex flex-col gap-2'>
        <div className='p-2 bg-slate-200'>
          <RoomLabel {...props} room={activeRoom!} type='roomProfile' />
        </div>
        <Subscribers
          {...props}
          roomOwner={roomOwner}
          removeSubscriber={removeSubscriber}
        />
        {isSubscribe ? (
          <Leave
            roomOwner={roomOwner}
            removeSubscriber={(user: IResUser | IUser) =>
              removeSubscriber(user)
            }
          />
        ) : (
          <Join />
        )}
      </div>
    </Modal>
  )
}

export default RoomProfile
