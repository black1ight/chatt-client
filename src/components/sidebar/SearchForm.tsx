import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { UsersService } from '../../services/users.service'
import { IUserData } from '../../types/types'
import debounce from 'lodash.debounce'

import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addCurrentUser, addValue } from '../../store/search/searchSlice'
import { MdClear } from 'react-icons/md'
import { getUserName } from '../Sidebar'
import { RoomsService } from '../../services/rooms.services'

interface SearchFormProps {
  open: boolean
  type: string
}

const SearchForm: FC<SearchFormProps> = ({ open, type }) => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const { searchValue } = useAppSelector((state) => state.search)
  const [userValue, setUserValue] = useState('')
  const [users, setUsers] = useState<IUserData[]>([])

  const getUsersByName = async () => {
    const property = `search=${searchValue}`

    try {
      const data = await UsersService.getUsersByFilter(property)
      if (data) {
        setUsers(data)
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  }

  const getRoomsByName = async () => {
    const property = `search=${searchValue}`

    try {
      const data = await RoomsService.getRoomsBySearch(property)
      if (data) {
        // dispatch(addRooms(data))
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  }

  const updateSearchValue = useCallback(
    debounce((str: string) => {
      dispatch(addValue(str))
    }, 500),
    [],
  )

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
    setUsers([])
    if (open && searchValue) {
      getUsersByName()
    } else if (!open && searchValue !== null) {
      getRoomsByName()
    }
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

      {users.length > 0 && userValue && (
        <ul className='absolute p-1 top-10 flex flex-col gap-1 bg-stone-100 w-full rounded-md'>
          {users &&
            users.map((item) => {
              return (
                <li
                  key={item.email}
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
