import { MessagesService } from '../services/messages.service'
import { UsersService } from '../services/users.service'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IResRoom, IUser } from '../types/types'
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

export const addMessagesToDb = async (serverMessages: IResMessage[]) => {
  if (serverMessages) {
    for (const message of serverMessages) {
      const isExist = await db
        .table('messages')
        .where('id')
        .equals(message.id)
        .count()
      if (!isExist) {
        await db.table('messages').add(message)
        console.log(message)
      } else if (
        isExist &&
        JSON.stringify(isExist) !== JSON.stringify(message)
      ) {
        await db.table('messages').put(message)
        console.log(message)
      }
    }
    console.log('messages has been been updated!')
  }
}

export const removeMessagesFromDb = async (
  serverMessages: IResMessage[],
  localMessages: IResMessage[],
) => {
  localMessages.forEach(async (message) => {
    const isExist = serverMessages.find((item) => item.id === message.id)
    if (!isExist) {
      await db.table('messages').delete(message.id)
    }
  })
  console.log('messages has been removed from db!')
}

export const addRoomsToDb = async (serverRooms: IResRoom[]) => {
  if (serverRooms) {
    for (const room of serverRooms) {
      const isExist = await db
        .table('rooms')
        .where('id')
        .equals(room.id)
        .count()
      if (!isExist) {
        await db.table('rooms').add(room)
        console.log(room)
      } else if (isExist && JSON.stringify(isExist) !== JSON.stringify(room)) {
        await db.table('rooms').put(room)
        console.log(room)
      }
    }
    console.log('rooms has been updated!')
  }
}

export const removeRoomsFromDb = async (
  serverRooms: IResRoom[],
  localRooms: IResRoom[],
) => {
  localRooms.forEach(async (room) => {
    const isExist = serverRooms.find((item) => item.id === room.id)
    if (!isExist) {
      await db.table('rooms').delete(room.id)
    }
  })
  console.log('rooms has been removed from db!')
}

export const addUsersToDb = async (serverRooms: IResRoom[]) => {
  if (serverRooms) {
    for (const room of serverRooms) {
      for (const user of room.users) {
        if (user.id) {
          const isExist = await db
            .table('users')
            .where('id')
            .equals(user.id)
            .count()
          if (!isExist) {
            await db.table('users').add(user)
            console.log(user)
          } else if (
            isExist &&
            JSON.stringify(isExist) !== JSON.stringify(user)
          ) {
            await db.table('users').put(user)
            console.log(user)
          }
        }
      }
    }
    console.log('users has been updated!')
  }
}

export const addProfileToDb = async (user: IUser) => {
  const myProfile = await UsersService.getUserById(user.id)
  if (myProfile) {
    await db.table('users').put(myProfile)
  }
}
