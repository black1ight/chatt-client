import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AuthService } from '../services/auth.service'
import { toast } from 'react-toastify'
import { setTokenToLocalStorage } from '../helpers/localstorage.helper'
import { logIn } from '../store/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/Loader'
import { changeIsLoading } from '../store/helpers/helpersSlice'
import { iconColors } from '../components/sidebar/CreateForm'

const Auth: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const isAuth = useAuth()
  const { isLoading } = useAppSelector((state) => state.helpers)

  const getRandomColor = () => {
    const color = iconColors[Math.floor(Math.random() * iconColors.length)]
    return color
  }

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.toLowerCase())
  }

  const onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      dispatch(changeIsLoading('fetch'))
      e.preventDefault()
      const data = await AuthService.registration({
        email,
        password,
        socketId: `${email}-${iconColors[2].first}`,
        color: getRandomColor(),
      })
      if (data) {
        toast.success('SUCCESS')
        setIsLogin(!isLogin)
        dispatch(changeIsLoading('success'))
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
      dispatch(changeIsLoading(null))
    }
  }

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      dispatch(changeIsLoading('fetch'))

      e.preventDefault()
      const data = await AuthService.login({ email, password })
      if (data) {
        setTokenToLocalStorage('token', data.token)
        dispatch(logIn(data))
        dispatch(changeIsLoading(null))

        toast.success('SUCCESS')
        navigate('/')
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
      dispatch(changeIsLoading(null))
    }
  }

  useEffect(() => {
    isAuth && navigate('/')
  }, [isAuth])

  return (
    <div className='flex h-[100dvh] flex-col justify-center text-center'>
      <h1 className='text-center text-xl font-medium pb-6'>
        {isLogin ? 'Log In' : 'Registration'}
      </h1>
      <form
        onSubmit={isLogin ? loginHandler : registrationHandler}
        className='flex flex-col gap-4 w-full max-w-[300px] mx-auto'
      >
        <input
          className='input'
          placeholder='email'
          type='text'
          onChange={onChangeEmail}
        />
        <input
          className='input'
          placeholder='password'
          type='password'
          onChange={onChangePass}
        />
        <button className={`relative btn btn-grey`}>
          <span className={`${isLoading === 'success' && 'animate-bounce'}`}>
            Submit
          </span>
          <span className='absolute right-2'>
            <Loader size='24' />
          </span>
        </button>
      </form>
      <div className='text-center pt-4'>
        {isLogin ? "You don't have an account?" : 'Already have an account?'}
      </div>
      <span
        onClick={() => setIsLogin(!isLogin)}
        className='px-2 text-slate-700 font-bold cursor-pointer hover:text-slate-500 active:text-slate-500'
      >
        {!isLogin ? 'Log In' : 'Registration'}
      </span>
    </div>
  )
}

export default Auth
