import { instance } from '../api/axios.api'
import { IResUserData, IUser, IUserData } from '../types/types'

export const AuthService = {
  async registration(userData: IUserData): Promise<IResUserData | undefined> {
    const { data } = await instance.post<IResUserData>('users', userData)
    return data
  },
  async login(userData: IUserData): Promise<IUser | undefined> {
    const { data } = await instance.post<IUser>('auth/login', userData)
    return data
  },
  async getProfile(): Promise<IUser | undefined> {
    const { data } = await instance.get<IUser>('auth/profile')
    if (data) return data
  },
}
