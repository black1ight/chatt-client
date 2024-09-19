import { FC } from 'react'
import { CiLogin, CiLogout } from 'react-icons/ci'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logOut } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localstorage.helper'
import { toast } from 'react-toastify'
import { addActiveRoom } from '../store/rooms/roomsSlice'

import { GoArrowLeft } from 'react-icons/go'
import { getMessages } from '../store/messenger/messengerSlice'
import { useGetUnreadChats } from '../hooks/useGetUnreadChats'
import useModal from '../hooks/useModal'
import RoomProfile from './room/RoomProfile'
import RoomLabel from './room/RoomLabel'
const Header: FC = () => {
  const isAuth = useAuth()
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { dialogCount } = useGetUnreadChats()
  const props = useModal()

  const logoutHandler = () => {
    if (window.confirm('Log out of your account?')) {
      dispatch(logOut())
      removeTokenFromLocalStorage('token')
      toast.success('You are logged Out.')
      navigate('/')
    }
  }

  const backToSideBar = () => {
    dispatch(addActiveRoom(null))
    dispatch(getMessages(''))
  }

  return (
    <div className={`w-full h-20 bg-white p-2 flex items-center border-b`}>
      {activeRoom && (
        <div className='hidden max-sm:flex items-center gap-1 bg-white'>
          <div
            onClick={backToSideBar}
            className='flex relative justify-center items-center w-10 h-10 border rounded-full'
          >
            {dialogCount > 0 && (
              <span className='w-6 h-6 absolute -left-1 -top-1 flex justify-center items-center rounded-full text-xs bg-blue-400 shadow-md text-white'>
                {dialogCount}
              </span>
            )}
            <GoArrowLeft size={24} />
          </div>
        </div>
      )}

      {activeRoom && <RoomLabel {...props} />}

      {!isAuth ? (
        <Link to='/auth' className='ml-auto'>
          <button className='btn bg-slate-300  text-stone-900/70'>
            log In
            <CiLogin size={24} />
          </button>
        </Link>
      ) : (
        <div className='flex items-center gap-2 ml-auto'>
          <span className='text-cyan-700'>{user?.email.split('@')[0]}</span>
          <button
            onClick={logoutHandler}
            className='btn-sm shadow-outer text-stone-900/70 px-1'
          >
            <CiLogout size={24} className='text-rose-700' />
          </button>
        </div>
      )}
      {props.open && <RoomProfile {...props} />}
    </div>
  )
}

export default Header
