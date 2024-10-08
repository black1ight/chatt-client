import { FC, useEffect } from 'react'
import Header from '../components/Header'
import Room from '../components/room/Room'
import Sidebar from '../components/Sidebar'
import { useAppSelector } from '../store/hooks'
import Profile from '../components/sidebar/Profile'
import { MessagesService } from '../services/messages.service'
import db from '../helpers/db'
import { toast } from 'react-toastify'
import { RoomsService } from '../services/rooms.services'

const Home: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { isOpen } = useAppSelector((state) => state.user)

  const addMessagesToDb = async () => {
    try {
      const data = await MessagesService.getMessages('')
      if (data) {
        for (const message of data) {
          const isExist = await db
            .table('messages')
            .where('id')
            .equals(message.id)
            .count()
          if (!isExist) {
            await db.table('messages').add(message)
            console.log(message)
          }
        }
        console.log('messages have been updated!')
      }
    } catch (error) {
      toast.error('error for add messages to db')
    }
  }
  const addRoomsToDb = async () => {
    try {
      const data = await RoomsService.getRooms()
      if (data) {
        for (const room of data) {
          const isExist = await db
            .table('rooms')
            .where('id')
            .equals(room.id)
            .count()
          if (!isExist) {
            await db.table('rooms').add(room)
            console.log(room)
          }
        }
        console.log('rooms have been updated!')
      }
    } catch (error) {
      toast.error('error for add messages to db')
    }
  }

  useEffect(() => {
    addMessagesToDb()
    addRoomsToDb()
  }, [])

  return (
    <div className='relative h-[100dvh] overflow-hidden flex gap-1'>
      {isOpen && <Profile />}
      <Sidebar />
      <div className={`${!activeRoom && 'max-sm:hidden'} w-full`}>
        <Header />
        {activeRoom ? (
          <Room />
        ) : (
          <div className='flex items-center max-sm:hidden justify-center h-[90dvh] col-span-3 overflow-hidden bg-stone-100'>
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
