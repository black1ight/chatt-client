import { FC, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Link } from 'react-router-dom'
import { CiLogin } from 'react-icons/ci'
import { setIsOpen } from '../../store/user/userSlice'

import LogOut from '../user/LogOut'
import UserInfo from '../user/info/UserInfo'
import ArrowToBack from '../ArrowToBack'
import db from '../../helpers/db'
import { IResUser } from '../../types/types'
import { useLiveQuery } from 'dexie-react-hooks'
import Loader from '../Loader'
import Bio from '../user/info/Bio'
import Buttons from '../user/Buttons'
import { scrollToBottom } from '../Messages'
import UserLabel from '../user/UserLabel'

interface UserProfileProps {}

const Profile: FC<UserProfileProps> = () => {
  const dispatch = useAppDispatch()
  const profileRef = useRef<HTMLDivElement>(null)
  const isAuth = useAuth()
  const { user, isOpen, profile } = useAppSelector((state) => state.user)
  const { editField } = useAppSelector((state) => state.profile)

  const myProfile = useLiveQuery(
    async (): Promise<IResUser | undefined> =>
      await db.table('users').get(user?.id!),
    [profile],
  )

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !event.composedPath().includes(profileRef.current)
    ) {
      dispatch(setIsOpen(false))
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    editField && profileRef.current && scrollToBottom(profileRef.current)
  }, [editField])
  return (
    <div
      ref={profileRef}
      className={`absolute top-0 left-0 z-[100] h-full overflow-y-auto bg-stone-100 w-full max-w-[300px] max-sm:max-w-full pb-4 ${isOpen ? 'animate-open-menu' : 'animate-close-menu'}`}
    >
      {!isAuth && (
        <Link to='/auth' className='ml-auto'>
          <button className='btn bg-slate-300  text-stone-900/70'>
            log In
            <CiLogin size={24} />
          </button>
        </Link>
      )}
      {myProfile && (
        <div className='flex flex-col gap-4'>
          <div className='flex gap-2 items-center p-3 bg-white'>
            <ArrowToBack type='profile' />
            <LogOut />
          </div>
          <div className='bg-white flex justify-center items-center p-3'>
            <UserLabel {...myProfile} size='xl' parent='profile' />
          </div>
          <Bio {...myProfile} />
          <UserInfo {...myProfile} />
          {editField && <Buttons />}
        </div>
      )}
      {!myProfile && <Loader size='96' />}
    </div>
  )
}

export default Profile
