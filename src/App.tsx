import { FC, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
  getTokenExpiryFromLocalStorage,
  getTokenFromLocalStorage,
  removeTokenExpiryFromLocalStorage,
  removeTokenFromLocalStorage,
} from './helpers/localstorage.helper'
import { AuthService } from './services/auth.service'
import { getMyProfile, logIn, logOut } from './store/user/userSlice'
import useModal from './hooks/useModal'
import Modal from './components/modal'
import { useConnectSocket } from './hooks/useConnectSocket'
import SocketApi from './api/socket-api'
import { useLiveQuery } from 'dexie-react-hooks'
import { IResRoom, IResUser } from './types/types'
import db from './helpers/db'

const App: FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const { socketId } = useAppSelector((state) => state.socket)
  const modalProps = useModal()

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage()
    const tokenExpiry = getTokenExpiryFromLocalStorage()
    const nowDate = new Date().getTime()
    try {
      if (token && Number(tokenExpiry) > nowDate) {
        const data = await AuthService.getProfile()
        if (data) {
          dispatch(logIn(data))
          dispatch(getMyProfile(data.id))
        } else {
          dispatch(logOut())
          removeTokenFromLocalStorage('token')
          removeTokenExpiryFromLocalStorage('tokenExpiry')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const rooms = useLiveQuery(
    async (): Promise<IResRoom[] | undefined> =>
      await db.table('rooms').reverse().toArray(),
    [],
  )

  const users = useLiveQuery(
    async (): Promise<IResUser[] | undefined> =>
      await db.table('users').reverse().toArray(),
    [],
  )
  useConnectSocket()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    rooms && rooms.length > 0 && socketId && SocketApi.joinRooms(rooms, user)
    return () => {
      user && rooms && SocketApi.leaveRooms(rooms, user)
    }
  }, [rooms?.length, socketId])

  useEffect(() => {
    users && users.length > 0 && socketId && SocketApi.joinUsers(users, user)
    return () => {
      user && users && SocketApi.leaveUsers(users, user)
    }
  }, [users?.length, socketId])

  return (
    <>
      <RouterProvider router={router} />
      <Modal {...modalProps} />
    </>
  )
}

export default App
