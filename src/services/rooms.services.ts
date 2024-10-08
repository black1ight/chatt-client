import { instance } from '../api/axios.api'
import { IResRoom, IRoomData } from '../types/types'

export const RoomsService = {
  async createRoom(roomData: IRoomData): Promise<IResRoom | undefined> {
    const { data } = await instance.post<IResRoom>('rooms', roomData)
    if (data) return data
  },

  async getRooms(): Promise<IResRoom[] | undefined> {
    const { data } = await instance.get('rooms')
    if (data) return data
  },

  async getRoomById(id: string): Promise<IResRoom | undefined> {
    const { data } = await instance.get(`rooms/${id}`)
    if (data) return data
  },

  async getRoomsBySearch(property: string): Promise<IResRoom[] | undefined> {
    const { data } = await instance.get(`rooms/search?${property}`)
    if (data) return data
  },

  async updateRoom(
    id: string | undefined,
    updateDto: any,
  ): Promise<IResRoom | undefined> {
    const { data } = await instance.patch(`rooms/${id}`, updateDto)
    if (data) return data
  },

  async removeRoom(id: string): Promise<any> {
    const { data } = await instance.delete(`rooms/${id}`)
    return data
  },
}
