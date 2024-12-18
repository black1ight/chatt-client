import { FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'
import { IResRoom, IResUser } from '../../types/types'
import TopBar from './TopBar'
import RoomsBlock from '../room/RoomsBlock'
import UsersBlock from '../user/UsersBlock'
import { useNewMessagesDialogsCount } from '../../hooks/useNewMessagesDialogsCount'

export const getUserName = (email: string) => {
  return email.split('@')[0]
}

const Sidebar: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { profile } = useAppSelector((state) => state.user)
  const { searchType, searchValue, globalUsers, globalRooms } = useAppSelector(
    (state) => state.search,
  )

  // check why this hook create 100+ rerenders....!!!!
  useNewMessagesDialogsCount()

  const rooms = useLiveQuery(async (): Promise<IResRoom[] | undefined> => {
    const data: IResRoom[] = await db.table('rooms').reverse().toArray()
    if (searchValue && searchType !== 'users') {
      return data.filter((room) =>
        room.type === 'chat'
          ? room.name.toLowerCase().includes(searchValue.toLowerCase())
          : room.name
              .split(',')
              .find((name) => name !== profile?.username)
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()),
      )
    }
    return data
  }, [searchValue])

  const users = useLiveQuery(async (): Promise<IResUser[] | undefined> => {
    const userData: IResUser[] = await db.table('users').reverse().toArray()
    const roomsData: IResRoom[] = await db.table('rooms').toArray()

    if (searchValue && searchType !== 'users') {
      return userData.filter((user) => {
        const hasRoom = roomsData.some((room) => {
          if (room.type === 'chat') return false
          const roomUsers = room.name.split(',').map((name) => name.trim())
          return (
            roomUsers.includes(profile?.username || '') &&
            roomUsers.includes(user.username!)
          )
        })

        return (
          !hasRoom &&
          user.username?.toLowerCase().includes(searchValue.toLowerCase())
        )
      })
    }
  }, [searchValue, profile?.username])

  const globalRoomsSearchResult = globalRooms?.filter(
    (room) =>
      room.type === 'chat' && !rooms?.some((item) => item.id === room.id),
  )

  const globalUsersSearchResult = globalUsers?.filter(
    (user) => !users?.some((item) => item.id === user.id),
  )

  return (
    <div
      className={`w-full max-w-[300px] h-[100dvh] max-sm:max-w-full bg-white py-4 flex flex-col gap-4 transition-transform ${activeRoom && 'max-sm:-translate-x-full max-sm:hidden'}`}
    >
      <TopBar />
      <div className='flex-grow overflow-y-auto hide-scrollbar'>
        <ul className='flex flex-col'>
          {/* ROOMS */}
          {rooms && rooms.length > 0 && (
            <RoomsBlock type='sideBar' rooms={rooms} />
          )}

          {/* USERS */}
          {users && users.length > 0 && <UsersBlock users={users} />}

          {/* NOTIFICATION FOR GLOBAL SEARCH RESULTS */}
          {((globalUsersSearchResult && globalUsersSearchResult.length > 0) ||
            (globalRoomsSearchResult && globalRoomsSearchResult.length > 0)) &&
            searchValue && (
              <h3 className='text-center text-stone-500 text-sm bg-stone-100 my-1'>
                Global search result:
              </h3>
            )}

          {/* GLOBAL SEARCH RESULTS FOR ROOMS */}
          {searchType == null &&
            searchValue &&
            globalRooms &&
            globalRooms.length > 0 && (
              <RoomsBlock rooms={globalRoomsSearchResult} type='global' />
            )}

          {/* GLOBAL SEARCH RESULTS FOR USERS */}
          {searchType == null &&
            searchValue &&
            globalUsers &&
            globalUsers.length > 0 && (
              <UsersBlock users={globalUsersSearchResult} />
            )}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
