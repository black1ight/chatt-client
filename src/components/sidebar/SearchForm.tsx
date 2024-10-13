import { FC, useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IUserData } from '../../types/types'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addCurrentUser,
  addSearchType,
  addValue,
} from '../../store/search/searchSlice'
import { MdClear } from 'react-icons/md'
import { getUserName } from '../Sidebar'
import db from '../../helpers/db'

interface SearchFormProps {
  open: boolean
  type: string
}

const SearchForm: FC<SearchFormProps> = ({ open, type }) => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const { searchValue } = useAppSelector((state) => state.search)
  const [userValue, setUserValue] = useState('')
  const [userData, setUserData] = useState<IUserData[]>([])

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

  const updateSearchValue = (str: string) => {
    dispatch(addValue(str))
    type === 'sideBar'
      ? dispatch(addSearchType('rooms'))
      : dispatch(addSearchType('users'))
  }

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValue(event.target.value)
    updateSearchValue(event.target.value)
  }

  const onClickUser = (item: IUserData) => {
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
    }
    dispatch(addValue(null))
    inputRef.current?.focus()
  }

  useEffect(() => {
    searchValue && searchUsers(searchValue)
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

      {type === 'modal' && userData?.length > 0 && userValue && (
        <ul className='absolute p-1 top-10 flex flex-col gap-1 bg-stone-100 w-full rounded-md z-[100]'>
          {userData?.length > 0 &&
            userData.map((item) => {
              return (
                <li
                  key={item.email ?? item.id}
                  onClick={() => onClickUser(item)}
                  className='p-1 bg-white cursor-pointer'
                >
                  {item.user_name ?? item.email?.split('@')[0]}
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default SearchForm
