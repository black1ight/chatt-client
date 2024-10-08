import debounce from 'lodash.debounce'
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { UsersService } from '../../services/users.service'
import { useAppSelector } from '../../store/hooks'
import { toast } from 'react-toastify'

interface InputUrlProps {
  isOpen: boolean
  setIsOpen: (flag: boolean) => void
}

const InputUrl: FC<InputUrlProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAppSelector((state) => state.user)
  const inputRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')

  const updateUserImage = async (value: string) => {
    try {
      const data = await UsersService.updateUser(user?.id!, { imageUrl: value })
      console.log(data)
      setIsOpen(false)
    } catch (err: any) {
      const error = err.response?.data.message
      toast.error(error.toString())
    }
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
      setIsOpen(false)
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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
          onClick={() => updateUserImage(value)}
          className='btn-sm bg-stone-300 w-14 shadow-xl border border-stone-300'
        >
          add
        </button>
      </div>
    </div>
  )
}

export default InputUrl