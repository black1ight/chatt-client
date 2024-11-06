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
  username?: string
}

export interface IAuthData {
  email: string
  password: string
  color?: IRoomColors
  socketId?: string
}

export interface IResUser {
  id: number | undefined
  socketId: string
  email: string | undefined
  password?: string | undefined
  username: string | null | undefined
  phone: string | null
  bio: string | null
  color: IRoomColors
  imageUrl: string
  online: Boolean
  lastSeen: Date
  createdAt: string | undefined
  updatedAt: string | undefined
}

export interface IUserUpdate {
  imageUrl?: string
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
  name: string
  type: string
  users: number[]
  color: IRoomColors
  owner: number
}

export interface IResRoom {
  id: number
  name: string
  type: string
  users: IResUser[]
  messages: IResMessage[]
  color: IRoomColors
  owner: number
  createdAt: Date
  imageUrl: string
}

export interface TypingData {
  userId: number
  userName: string
  roomId: number
  typing: boolean
}
