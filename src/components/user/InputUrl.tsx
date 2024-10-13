import debounce from 'lodash.debounce'
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAppSelector } from '../../store/hooks'
import SocketApi from '../../api/socket-api'

interface InputUrlProps {
  isOpen: boolean
  setIsOpen: () => void
  type: string
}

const InputUrl: FC<InputUrlProps> = ({ isOpen, setIsOpen, type }) => {
  const { user } = useAppSelector((state) => state.user)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const inputRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')

  const updateUserImage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: string,
  ) => {
    e.stopPropagation()
    if (type === 'user') {
      SocketApi.socket?.emit('editUser', {
        userId: user?.id,
        dto: { imageUrl: value },
      })
    } else if (type === 'room') {
      SocketApi.socket?.emit('editRoom', {
        roomId: activeRoom?.id,
        dto: { imageUrl: value },
      })
    }
    setIsOpen()
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const updateChangeValue = useCallback(
    debounce((e) => {
      onChangeInput(e)
    }, 500),
    [],
  )

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !event.composedPath().includes(inputRef.current)) {
      setIsOpen()
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`${!isOpen && 'hidden'} absolute w-full h-full z-[100] top-0 left-0 flex justify-center items-center`}
    >
      <div ref={inputRef} className='flex gap-1'>
        <input
          onChange={(e) => updateChangeValue(e)}
          placeholder='...url'
          className='border border-stone-300 rounded-md outline-none px-2 py-1 shadow-xl'
        />
        <button
          onClick={(e) => updateUserImage(e, value)}
          className='btn-sm bg-stone-300 w-14 shadow-xl border border-stone-300'
        >
          add
        </button>
      </div>
    </div>
  )
}

export default InputUrl
