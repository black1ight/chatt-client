import { FC, useEffect } from 'react'
import Header from '../components/Header'
import Room from '../components/room/Room'
import Sidebar from '../components/sidebar/Sidebar'
import { useAppSelector } from '../store/hooks'
import Profile from '../components/sidebar/Profile'
import { MessagesService } from '../services/messages.service'
import db from '../helpers/db'
import { RoomsService } from '../services/rooms.services'
import { IResMessage } from '../store/messenger/messengerSlice'
import { IResRoom, IUser } from '../types/types'
import { UsersService } from '../services/users.service'

const Home: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { isOpen, user } = useAppSelector((state) => state.user)

  const addMessagesToDb = async (serverMessages: IResMessage[]) => {
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

  const removeMessagesFromDb = async (
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

  const addRoomsToDb = async (serverRooms: IResRoom[]) => {
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
        } else if (
          isExist &&
          JSON.stringify(isExist) !== JSON.stringify(room)
        ) {
          await db.table('rooms').put(room)
          console.log(room)
        }
      }
      console.log('rooms has been updated!')
    }
  }

  const removeRoomsFromDb = async (
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

  const addUsersToDb = async (serverRooms: IResRoom[]) => {
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

  const addProfileToDb = async (user: IUser) => {
    const myProfile = await UsersService.getUserById(user.id)
    if (myProfile) {
      await db.table('users').put(myProfile)
    }
  }

  const syncLocalDb = async () => {
    const serverMessages = await MessagesService.getMessages('')
    const serverRooms = await RoomsService.getRooms()
    const localMessages = await db.table('messages').toArray()
    const localRooms = await db.table('rooms').toArray()

    if (serverMessages !== undefined && serverMessages.length > 0) {
      addMessagesToDb(serverMessages)
    }

    if (serverRooms && serverRooms.length > 0) {
      addRoomsToDb(serverRooms)
      addUsersToDb(serverRooms)
    }

    if (serverMessages && serverRooms && localMessages && localRooms) {
      removeMessagesFromDb(serverMessages, localMessages)
    }

    if (serverRooms && localRooms) {
      removeRoomsFromDb(serverRooms, localRooms)
    }

    user && addProfileToDb(user)
  }

  useEffect(() => {
    syncLocalDb()
  }, [])

  return (
    <div className='relative h-[100dvh] overflow-hidden flex gap-1'>
      {isOpen && <Profile />}
      <Sidebar />
      <div className={`${!activeRoom && 'max-sm:hidden'} w-full flex flex-col`}>
        <Header />
        {activeRoom ? (
          <Room />
        ) : (
          <div className='flex items-center max-sm:hidden justify-center h-[100dvh] overflow-hidden bg-stone-200'>
            <h3 className='bg-white p-2 rounded-md shadow-md'>
              Select to chat for start messaging
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
