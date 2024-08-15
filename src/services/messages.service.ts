import { instance } from '../api/axios.api'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IPatchData } from '../types/types'

export const MessagesService = {
  async getMessages(): Promise<IResMessage[] | undefined> {
    const { data } = await instance.get<IResMessage[]>('messages')
    if (data) return data
  },

  async patchMesssage(patchData: IPatchData): Promise<any> {
    const text = {
      text: patchData.text,
    }
    const { data } = await instance.patch<any>(`messages/${patchData.id}`, text)
    return data
  },

  async deleteMessage(id: number): Promise<any> {
    const { data } = await instance.delete(`messages/${id}`)
    return data
  },
}
