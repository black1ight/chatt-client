import { FC, useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { AuthService } from '../services/auth.service'
import { toast } from 'react-toastify'
import { setTokenToLocalStorage } from '../helpers/localstorage.helper'
import { logIn } from '../store/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Oval, Puff } from 'react-loader-spinner'

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isFetch, setIsFetch] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const isAuth = useAuth()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.toLowerCase())
  }

  const onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsFetch('fetch')
      e.preventDefault()
      const data = await AuthService.registration({ email, password })
      if (data) {
        toast.success('SUCCESS')
        setIsLogin(!isLogin)
        setIsFetch('success')
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
      setIsFetch(null)
    }
  }

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsFetch('fetch')

      e.preventDefault()
      const data = await AuthService.login({ email, password })
      if (data) {
        setTokenToLocalStorage('token', data.token)
        dispatch(logIn(data))
        setIsFetch(null)
        toast.success('Вхід успішний.')
        navigate('/')
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
      setIsFetch(null)
    }
  }

  useEffect(() => {
    isAuth && navigate('/')
  }, [isAuth])

  return (
    <div className='pt-[100px] text-center'>
      <h1 className='text-center text-xl font-medium pb-6'>
        {isLogin ? 'Log In' : 'Registration'}
      </h1>
      <form
        onSubmit={isLogin ? loginHandler : registrationHandler}
        className='flex flex-col gap-4 max-w-[250px] mx-auto'
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
        <button className={`relative btn btn-grey `}>
          <span className={`${isFetch === 'success' && 'animate-bounce'}`}>
            Submit
          </span>
          <span className='absolute right-2'>
            <Oval
              visible={isFetch === 'fetch'}
              height='24'
              width='24'
              color='#4fa94d'
              ariaLabel='oval-loading'
              wrapperStyle={{}}
              wrapperClass=''
              strokeWidth='4'
            />
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
