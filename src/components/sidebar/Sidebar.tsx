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
  const { searchType, searchValue, globalUsers, globalRooms } = useAppSelector(
    (state) => state.search,
  )

  useNewMessagesDialogsCount()

  const rooms = useLiveQuery(async (): Promise<IResRoom[] | undefined> => {
    const data: IResRoom[] = await db.table('rooms').reverse().toArray()
    if (searchValue && searchType !== 'users') {
      return data.filter((room) =>
        room.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }
    return data
  }, [searchValue])

  const users = useLiveQuery(async (): Promise<IResUser[] | undefined> => {
    const userData: IResUser[] = await db.table('users').reverse().toArray()
    // const dialogData: IResRoom[] = await db
    //   .table('rooms')
    //   .where('type')
    //   .equals('dialog')
    //   .reverse()
    //   .toArray()
    // const searchDialogData = dialogData.filter((d) =>
    //   d.users
    //     .find((u) => u.id !== user?.id)
    //     ?.username?.toLowerCase()
    //     .includes(searchValue?.toLowerCase() || ''),
    // )

    if (searchValue && searchType !== 'users') {
      return userData.filter((user) =>
        user.username?.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }
  }, [searchValue])

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
          {rooms && rooms.length > 0 && (
            <RoomsBlock type='sideBar' rooms={rooms} />
          )}
          {users && users.length > 0 && <UsersBlock users={users} />}
          {((globalUsersSearchResult && globalUsersSearchResult.length > 0) ||
            (globalRoomsSearchResult &&
              globalRoomsSearchResult.length > 0)) && (
            <h3 className='text-center text-stone-500 text-sm bg-stone-100 my-1'>
              Global search result:
            </h3>
          )}
          {searchType == null &&
            searchValue &&
            globalRooms &&
            globalRooms.length > 0 && (
              <RoomsBlock rooms={globalRoomsSearchResult} type='global' />
            )}
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
