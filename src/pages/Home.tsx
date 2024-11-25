import { FC, useEffect } from 'react'
import Header from '../components/Header'
import Room from '../components/room/Room'
import Sidebar from '../components/sidebar/Sidebar'
import { useAppSelector } from '../store/hooks'
import Profile from '../components/sidebar/Profile'
import { MessagesService } from '../services/messages.service'
import db from '../helpers/db'
import { RoomsService } from '../services/rooms.services'

import {
  addMessagesToDb,
  addProfileToDb,
  addRoomsToDb,
  addUsersToDb,
  removeMessagesFromDb,
  removeRoomsFromDb,
} from '../helpers/db.helper'
import { useLiveQuery } from 'dexie-react-hooks'
import { IResUser } from '../types/types'
import useModal from '../hooks/useModal'
import UserProfile from '../components/user/UserProfile'

const Home: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { activeUser } = useAppSelector((state) => state.userProfile)
  const { isOpen, user } = useAppSelector((state) => state.user)
  const modalProps = useModal()
  const { onOpen, open } = modalProps

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

  const currentUser = useLiveQuery(
    async (): Promise<IResUser | undefined> =>
      await db.table('users').get(activeUser?.id || 0),
    [activeUser],
  )

  useEffect(() => {
    syncLocalDb()
  }, [])

  useEffect(() => {
    if (activeUser) {
      onOpen()
    }
  }, [activeUser])

  return (
    <div className='relative h-[100dvh] overflow-hidden flex gap-1'>
      {isOpen && <Profile />}
      {(activeRoom || activeUser) && currentUser && open && (
        <UserProfile modalProps={modalProps} currentUser={currentUser} />
      )}
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
