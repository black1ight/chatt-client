import { instance } from '../api/axios.api'
import { IResUser, IUserUpdate } from '../types/types'

export const UsersService = {
  async getUsersByFilter(str: string): Promise<any> {
    const { data } = await instance.get(`users?${str}`)
    if (data) return data
  },
  async getUserById(id: number): Promise<IResUser | undefined> {
    const { data } = await instance.get(`users/${id}`)
    if (data) return data
  },
  async updateUser(
    id: number,
    dto: IUserUpdate,
  ): Promise<IResUser | undefined> {
    const { data } = await instance.patch(`users/${id}`, dto)
    if (data) return data
  },
}
