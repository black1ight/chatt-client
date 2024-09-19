import { Socket } from 'socket.io-client'
import { IRoomColors } from '../components/sidebar/CreateForm'
import { IResMessage } from '../store/messenger/messengerSlice'

export interface IUser {
  id: number
  email: string
  token: string
}

export interface IUserData {
  id: number
  email?: string
  password?: string
  user_name?: string
}

export interface IAuthData {
  email: string
  password: string
  color?: IRoomColors
}

export interface IResUser {
  email: string | undefined
  password: string | undefined
  user_name: string | null | undefined
  id: number | undefined
  color: IRoomColors
  online: Boolean
  lastSeen: Date
  socketId: string
  createdAt: string | undefined
  updatedAt: string | undefined
}

export interface IResUserData {
  token: string
  user: IResUser
}

export interface IPatchData {
  id: number
  text: string
  updatedAt: Date
}

export interface IRoomData {
  roomId: string
  users: number[] | undefined
  color: IRoomColors
}

export interface IResRoom {
  id: string
  users: IResUser[]
  messages: IResMessage[]
  color: IRoomColors
  owner: number
  createdAt: Date
}

export interface TypingData {
  userId: number
  userName: string
  roomId: string
  typing: boolean
}
