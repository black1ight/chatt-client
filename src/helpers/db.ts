import { Dexie } from 'dexie'

const db = new Dexie('chattApp')
db.version(1).stores({
  rooms: 'id, users, messages, color, owner, createdAt',
  messages:
    '++id, id, text, readUsers, status, createdAt, updatedAt, userId, roomId, reply, user, rooms',
})
db.open().catch((error) => {
  console.error('Ошибка при открытии базы данных: ' + error)
})

export default db