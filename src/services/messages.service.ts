import { instance } from '../api/axios.api'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IPatchData } from '../types/types'

export const MessagesService = {
  async getMessages(property: string): Promise<IResMessage[] | undefined> {
    const { data } = await instance.get<IResMessage[]>(`messages?${property}`)
    if (data) return data
  },

  async getMessagesByFilter(
    property: string,
  ): Promise<IResMessage[] | undefined> {
    const { data } = await instance.get<IResMessage[]>(
      `messages?sortBy=${property}`,
    )
    if (data) return data
  },

  async patchMesssage(patchData: IPatchData): Promise<any> {
    const text = {
      text: patchData.text,
    }
    const { data } = await instance.patch<any>(`messages/${patchData.id}`, text)
    return data
  },

  async readMessage(id: number): Promise<IResMessage> {
    const { data } = await instance.patch<IResMessage>(`messages/read/${id}`)
    return data
  },

  async deleteMessage(id: number): Promise<any> {
    const { data } = await instance.delete(`messages/${id}`)
    return data
  },

  async deleteMessagesByRoomId(id: string): Promise<any> {
    const { data } = await instance.delete(`messages/byRoom/${id}`)
    return data
  },
}
