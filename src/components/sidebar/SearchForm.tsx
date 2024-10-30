import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IResRoom, IResUser } from '../../types/types'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addCurrentUser,
  addGlobalRooms,
  addGlobalUsers,
  addSearchType,
  addValue,
} from '../../store/search/searchSlice'
import { MdClear } from 'react-icons/md'
import { getUserName } from './Sidebar'
import db from '../../helpers/db'
import UserLabel from '../user/UserLabel'
import UserStatusInfo from '../user/UserStatusInfo'
import { UsersService } from '../../services/users.service'
import { RoomsService } from '../../services/rooms.services'
import debounce from 'lodash.debounce'

interface SearchFormProps {
  open: boolean
  type: string
}

const SearchForm: FC<SearchFormProps> = ({ open, type }) => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const { searchValue, globalUsers, searchType } = useAppSelector(
    (state) => state.search,
  )
  const { user } = useAppSelector((state) => state.user)
  const [userValue, setUserValue] = useState('')
  const [userData, setUserData] = useState<IResUser[]>([])

  const searchUsers = async (searchValue: string) => {
    const users = await db
      .table('users')
      .filter((user) =>
        user.email.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .toArray()
    if (users) {
      setUserData(users)
    }
  }

  const searchUsersGlobal = async (searchValue: string) => {
    const users: IResUser[] = await UsersService.getUsersByFilter(
      `search=${searchValue}`,
    )
    dispatch(addGlobalUsers(users ?? null))
  }

  const searchRoomsGlobal = async (searchValue: string) => {
    const rooms: IResRoom[] | undefined = await RoomsService.getRoomsBySearch(
      `search=${searchValue}`,
    )
    dispatch(addGlobalRooms(rooms ?? null))
  }

  const updateSearchValue = useCallback(
    debounce((str: string) => {
      if (str.length == 0) {
        dispatch(addValue(null))
        dispatch(addGlobalUsers(null))
        dispatch(addGlobalRooms(null))
      } else {
        dispatch(addValue(str))
      }

      type === 'sideBar'
        ? dispatch(addSearchType(null))
        : dispatch(addSearchType('users'))
    }, 300),
    [],
  )

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValue(event.target.value)
    updateSearchValue(event.target.value)
  }

  const onClickUser = (item: IResUser) => {
    dispatch(addCurrentUser(item))
    setUserValue(getUserName(item.email!))
    dispatch(addValue(null))
    setUserValue('')
    inputRef.current?.focus()
  }

  const onClear = () => {
    if (open) {
      setUserValue('')
    } else if (!open) {
      setUserValue('')
      dispatch(addGlobalUsers(null))
      dispatch(addGlobalRooms(null))
    }
    dispatch(addValue(null))
    inputRef.current?.focus()
  }

  useEffect(() => {
    searchValue && searchUsers(searchValue)
    searchValue && searchUsersGlobal(searchValue)
    searchValue && searchType == null && searchRoomsGlobal(searchValue)
  }, [searchValue])

  return (
    <div className='relative w-full'>
      <input
        placeholder='Search'
        ref={inputRef}
        value={userValue}
        onChange={onChangeInput}
        className={`input-2 py-3 ${type === 'sideBar' && 'border-none rounded-full'}`}
      />

      {userValue ? (
        <button
          onClick={onClear}
          type='button'
          className='absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 active:opacity-100'
        >
          <MdClear size={20} />
        </button>
      ) : (
        <button
          type='button'
          className='absolute right-2 top-1/2 -translate-y-1/2 opacity-50'
        >
          <CiSearch size={20} />
        </button>
      )}

      {type !== 'sideBar' && userValue && (
        <ul className='absolute p-1 top-10 flex flex-col gap-1 bg-stone-100 w-full max-h-[300px] overflow-y-auto hide-scrollbar rounded-md z-[100]'>
          {userData?.length > 0 &&
            userData.map((item) => {
              if (item.id !== user?.id) {
                return (
                  <li
                    key={item.email ?? item.id}
                    onClick={() => onClickUser(item)}
                    className='p-1 bg-white cursor-pointer flex gap-2 rounded-md'
                  >
                    <UserLabel size='sm' parent='search' {...item} />
                    <UserStatusInfo size='sm' parent='search' {...item} />
                  </li>
                )
              }
            })}
          {globalUsers &&
            globalUsers?.length > 0 &&
            globalUsers
              .filter((item) => !userData.some((el) => el.id === item.id))
              .map((item) => {
                if (item.id !== user?.id) {
                  const firstItem = globalUsers[0]
                  return (
                    <li
                      key={item.email ?? item.id}
                      onClick={() => onClickUser(item)}
                      className={`p-1 bg-stone-100 cursor-pointer flex gap-2 rounded-md ${firstItem && 'border-top'}`}
                    >
                      <UserLabel size='sm' parent='search' {...item} />
                      <UserStatusInfo size='sm' parent='search' {...item} />
                    </li>
                  )
                }
              })}
        </ul>
      )}
    </div>
  )
}

export default SearchForm
