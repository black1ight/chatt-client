import { FC } from 'react'
import { CiLogout } from 'react-icons/ci'
import { removeTokenFromLocalStorage } from '../../helpers/localstorage.helper'
import { toast } from 'react-toastify'
import { addProfile, logOut, setIsOpen } from '../../store/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addSocketId } from '../../store/socket/socketSlice'
import SocketApi from '../../api/socket-api'

const LogOut: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)

  const logoutHandler = () => {
    if (window.confirm('Log out of your account?')) {
      dispatch(logOut())
      dispatch(addProfile(null))
      dispatch(setIsOpen(false))
      dispatch(addSocketId(null))
      SocketApi.socket?.disconnect()
      removeTokenFromLocalStorage('token')
      toast.success('You are logged Out.')
      navigate('/')
    }
  }
  return (
    <div className='flex items-center gap-2 ml-auto'>
      <button
        onClick={logoutHandler}
        className='btn-sm shadow-outer text-stone-900/70 px-1'
      >
        <CiLogout size={24} className='text-rose-700' />
      </button>
      <span className='text-cyan-700'>{user?.email.split('@')[0]}</span>
    </div>
  )
}

export default LogOut
