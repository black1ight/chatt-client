import { instance } from '../api/axios.api'

export const UsersService = {
  async getUsersByFilter(str: string): Promise<any> {
    const { data } = await instance.get(`users?${str}`)
    if (data) return data
  },
}
