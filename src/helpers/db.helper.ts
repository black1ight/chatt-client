import { MessagesService } from '../services/messages.service'
import db from './db'

export const getGlobalRoomMessages = async (roomId: number) => {
  const messages = await MessagesService.getMessages(`room=${roomId}`)
  if (messages) {
    await db.table('messages').bulkPut(messages)
  }
}

export const removeGlobalRoomMessages = async (roomId: number) => {
  await db.table('messages').where('roomId').equals(roomId).delete()
}
