import { FC, useEffect, useRef, useState } from 'react'
import { UsersService } from '../../services/users.service'
import { IResRoom, IRoomData } from '../../types/types'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addCurrentUser,
  addValue,
  clearCurrentUser,
  minusCurrentUser,
} from '../../store/search/searchSlice'
import { MdClear } from 'react-icons/md'
import Modal from '../modal'
import { ModalProps } from '../../hooks/useModal'
import { RoomsService } from '../../services/rooms.services'
import { getRooms } from '../../store/rooms/roomsSlice'
import SearchForm from './SearchForm'
import SocketApi from '../../api/socket-api'

export interface IRoomColors {
  first: string
  second: string
}

export const iconColors: IRoomColors[] = [
  { first: '#cbd5e1', second: '#475569' },
  { first: '#d4d4d4', second: '#525252' },
  { first: '#fca5a5', second: '#dc2626' },
  { first: '#fdba74', second: '#ea580c' },
  { first: '#fde047', second: '#ca8a04' },
  { first: '#86efac', second: '#16a34a' },
  { first: '#6ee7b7', second: '#059669' },
  { first: '#67e8f9', second: '#0891b2' },
  { first: '#93c5fd', second: '#2563eb' },
  { first: '#c4b5fd', second: '#7c3aed' },
  { first: '#f0abfc', second: '#c026d3' },
  { first: '#f9a8d4', second: '#db2777' },
  { first: '#fda4af', second: '#e11d48' },
]

interface CreateFormProps extends ModalProps {}

const CreateForm: FC<CreateFormProps> = (props) => {
  const dispatch = useAppDispatch()
  const inputUserRef = useRef<HTMLInputElement>(null)
  const inputNameRef = useRef<HTMLInputElement>(null)
  const { searchValue, currentUsers } = useAppSelector((state) => state.search)
  const { user } = useAppSelector((state) => state.user)
  const [userValue, setUserValue] = useState('')
  const [nameValue, setNameValue] = useState('')

  const getUsersByName = async () => {
    const property = `search=${searchValue}`

    try {
      await UsersService.getUsersByFilter(property)
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  }

  const onChangeNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value)
  }

  const onClear = () => {
    setUserValue('')
    dispatch(addValue(null))
    dispatch(clearCurrentUser())
    inputUserRef.current?.focus()
  }

  const onCloseForm = () => {
    dispatch(addValue(null))
    dispatch(clearCurrentUser())
    props.onClose()
  }

  const invateUsersToChat = async (data: IResRoom) => {
    SocketApi.socket?.emit('server-path', {
      type: 'invate-users',
      userId: currentUsers?.map((user) => user.id),
      roomId: data.id,
    })
  }

  const createHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    const roomData: IRoomData = {
      roomId: nameValue,
      users: currentUsers?.map((user) => {
        return user.id
      }),
      color: iconColors[Math.floor(Math.random() * iconColors.length)],
    }
    try {
      e.preventDefault()
      const data = await RoomsService.createRoom(roomData)
      if (data) {
        invateUsersToChat(data)
        dispatch(getRooms())
        onCloseForm()
      }
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
  }

  useEffect(() => {
    searchValue && getUsersByName()
  }, [searchValue])

  useEffect(() => {
    user && dispatch(addCurrentUser(user))
  }, [])

  return (
    <Modal {...props}>
      <form onSubmit={createHandler} className='p-4 flex flex-col gap-4'>
        <h3 className='text-center text-slate-500'>New Group</h3>
        <div className='relative'>
          <input
            placeholder='name'
            ref={inputNameRef}
            value={nameValue}
            onChange={onChangeNameInput}
            className='input-2 py-3'
          />
          {userValue && (
            <button
              onClick={onClear}
              type='button'
              className='absolute right-1 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 active:opacity-100'
            >
              <MdClear size={20} />
            </button>
          )}
        </div>

        <SearchForm open={props.open} type='modal' />
        {currentUsers && currentUsers.length > 1 && (
          <ul className='bg-stone-100 px-3 py-1'>
            {currentUsers.map((_user) => {
              if (user?.id !== _user.id)
                return (
                  <li className='flex gap-1 items-end' key={_user.email}>
                    {_user.email}
                    <MdClear
                      onClick={() => dispatch(minusCurrentUser(_user))}
                      size={20}
                      opacity={0.5}
                    />
                  </li>
                )
            })}
          </ul>
        )}
        <div className='flex justify-center gap-2 text-slate-600'>
          <button className='w-full btn-sm border-none hover:bg-slate-200 active:bg-slate-200'>
            Create
          </button>
          <button
            onClick={onCloseForm}
            type='button'
            className='btn-sm border-none w-full hover:bg-slate-200 active:bg-slate-200'
          >
            cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateForm
