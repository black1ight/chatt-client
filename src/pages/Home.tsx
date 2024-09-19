import { FC, useEffect } from 'react'
import Header from '../components/Header'
import Room from '../components/room/Room'
import Sidebar from '../components/sidebar/Sidebar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getRooms } from '../store/rooms/roomsSlice'
import { useConnectSocket } from '../hooks/useConnectSocket'
import { getMessages } from '../store/messenger/messengerSlice'

const Home: FC = () => {
  const dispatch = useAppDispatch()
  const { activeRoom } = useAppSelector((state) => state.rooms)
  useConnectSocket()

  useEffect(() => {
    dispatch(getMessages(''))
    dispatch(getRooms())
  }, [])
  return (
    <div className='h-[100dvh] overflow-hidden flex gap-1'>
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
