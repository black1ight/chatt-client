import { FC } from 'react'
import { CiLogin, CiLogout } from 'react-icons/ci'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logOut } from '../store/user/userSlice'
import { removeTokenFromLocalStorage } from '../helpers/localstorage.helper'
import { toast } from 'react-toastify'
const Header: FC = () => {
  const isAuth = useAuth()
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => {
    if (window.confirm('Log out of your account?')) {
      dispatch(logOut())
      removeTokenFromLocalStorage('token')
      toast.success('You are logged Out.')
      navigate('/')
    }
  }

  return (
    <div className='w-full bg-white p-4 flex items-center'>
      <Link to={'/'} className='font-black text-3xl text-stone-900/70'>
        chatt
      </Link>
      {!isAuth ? (
        <Link to='/auth' className='ml-auto'>
          <button className='btn bg-slate-300  text-stone-900/70'>
            log In
            <CiLogin size={24} />
          </button>
        </Link>
      ) : (
        <button
          onClick={logoutHandler}
          className='btn bg-slate-300 ml-auto text-stone-900/70'
        >
          {user?.email.split('@')[0]}
          <CiLogout size={24} />
        </button>
      )}
    </div>
  )
}

export default Header
