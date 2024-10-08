import { FC, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Link } from 'react-router-dom'
import { CiLogin } from 'react-icons/ci'
import { setIsOpen } from '../../store/user/userSlice'

import UserProfile from '../user/UserProfile'
import LogOut from '../user/LogOut'
import UserInfo from '../user/info/UserInfo'
import ArrowToBack from '../ArrowToBack'

interface UserProfileProps {}

const Profile: FC<UserProfileProps> = () => {
  const dispatch = useAppDispatch()
  const profileRef = useRef<HTMLDivElement>(null)
  const isAuth = useAuth()
  const { profile, isOpen } = useAppSelector((state) => state.user)

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
  return (
    <div
      ref={profileRef}
      className={`absolute top-0 left-0 z-[100] h-full bg-stone-100 w-full max-w-[300px] max-sm:max-w-full ${isOpen ? 'animate-open-menu' : 'animate-close-menu'}`}
    >
      {!isAuth ? (
        <Link to='/auth' className='ml-auto'>
          <button className='btn bg-slate-300  text-stone-900/70'>
            log In
            <CiLogin size={24} />
          </button>
        </Link>
      ) : (
        profile && (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-2 items-center p-3 bg-white'>
              <ArrowToBack />
              <LogOut />
            </div>
            <div className='bg-white flex justify-center items-center p-3'>
              <UserProfile {...profile} size='big' parent='profile' />
            </div>
            <UserInfo />
          </div>
        )
      )}
    </div>
  )
}

export default Profile
