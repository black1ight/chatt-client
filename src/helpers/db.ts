import { Dexie } from 'dexie'

const db = new Dexie('chattApp')
db.version(2).stores({
  rooms: 'id, name, type, users, messages, color, owner, createdAt',
  messages:
    'id, text, readUsers, status, createdAt, updatedAt, userId, roomId, reply, replyId, user, rooms',
  users:
    'id, socketId, email, username, phone, bio, color, imageUrl, online, lastSeen, createdAt',
})
db.open().catch((error) => {
  console.error('Ошибка при открытии базы данных: ' + error)
})

export default db
