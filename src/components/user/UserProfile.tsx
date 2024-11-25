import { FC, useEffect } from 'react'
import { ModalProps } from '../../hooks/useModal'
import UserLabel from './UserLabel'
import { IResRoom, IResUser } from '../../types/types'
import UserStatusInfo from './UserStatusInfo'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addActiveUser } from '../../store/user/userProfileSlice'
import Modal from '../modal'
import { CiCircleInfo, CiMail } from 'react-icons/ci'
import { IoCloseOutline, IoHandLeftOutline } from 'react-icons/io5'
import { getUserName } from '../sidebar/Sidebar'
import db from '../../helpers/db'
import { addActiveRoom } from '../../store/rooms/roomsSlice'
import ProfileInfoItem from './ProfileInfoItem'

export interface UserProfileProps {
  currentUser: IResUser
  modalProps: ModalProps
}

const UserProfile: FC<UserProfileProps> = ({ modalProps, currentUser }) => {
  const { onClose } = modalProps
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.user)
  const aboutList: (keyof IResUser)[] = ['bio', 'username', 'phone', 'email']
  const profileArray =
    currentUser &&
    aboutList.map((key) => {
      return { [key]: currentUser[key as keyof IResUser] }
    })

  const onSendMail = async () => {
    db.table('users').put(currentUser)
    const currentRoom = await db
      .table('rooms')
      .where('type')
      .equals('dialog')
      .filter((room) =>
        room.users.some(
          (user: { id: number | undefined }) => user.id === currentUser.id,
        ),
      )
      .first()

    const newRoom: IResRoom = {
      id: Date.now(),
      name: currentUser.username || getUserName(currentUser.email!),
      type: 'dialog',
      isTemp: true,
      color: null,
      imageUrl: null,
      owner: null,
      createdAt: new Date().toISOString(),
      messages: [],
      users: [profile!, currentUser],
    }

    if (currentRoom) {
      dispatch(addActiveRoom(currentRoom))
    } else {
      dispatch(addActiveRoom(newRoom))
    }
  }
  useEffect(() => {
    return () => {
      dispatch(addActiveUser(null))
    }
  })
  return (
    <Modal {...modalProps}>
      <div className='flex flex-col w-[300px] gap-2 bg-slate-200'>
        <div className='flex justify-between bg-white p-4'>
          <span>
            <CiCircleInfo size={28} className='text-stone-500' />
          </span>
          <span onClick={onClose}>
            <IoCloseOutline
              size={28}
              className='text-stone-500 hover:text-stone-700 cursor-pointer'
            />
          </span>
        </div>
        <div className='flex gap-2 p-4 bg-white'>
          <UserLabel {...currentUser} parent='' size='' />
          <UserStatusInfo {...currentUser} parent='' size='' />
        </div>
        <div
          onClick={onSendMail}
          className='bg-white hover:bg-slate-100 cursor-pointer p-4 flex gap-2 justify-between items-center'
        >
          <span>Send mail</span>
          <CiMail className='text-slate-500 text-3xl hover:text-slate-700 cursor-pointer' />
        </div>
        <ul className='bg-white flex flex-col gap-2 p-4'>
          {profileArray.map((item, id) => (
            <ProfileInfoItem
              key={`${id}`}
              data={item}
              keyData={aboutList[id]}
            />
          ))}
        </ul>
        <div className='flex justify-center gap-2 p-4 bg-white text-red-700 cursor-pointer hover:bg-red-100'>
          <IoHandLeftOutline size={24} />
          <span>Block user</span>
        </div>
      </div>
    </Modal>
  )
}

export default UserProfile
