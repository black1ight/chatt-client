import { FC, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { useAppDispatch } from './store/hooks'
import { getTokenFromLocalStorage } from './helpers/localstorage.helper'
import { AuthService } from './services/auth.service'
import { logIn, logOut } from './store/user/userSlice'
import useModal from './hooks/useModal'
import Modal from './components/modal'

const App: FC = () => {
  const dispatch = useAppDispatch()
  const modalProps = useModal()

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage()
    try {
      if (token) {
        const data = await AuthService.getProfile()
        if (data) {
          dispatch(logIn(data))
        } else {
          dispatch(logOut())
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log('new user online')

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Modal {...modalProps} />
    </>
  )
}

export default App
