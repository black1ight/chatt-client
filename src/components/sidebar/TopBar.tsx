import { FC } from 'react'
import CreateForm from './CreateForm'
import { IoCreateOutline, IoSettingsOutline } from 'react-icons/io5'
import SearchForm from './SearchForm'
import useModal from '../../hooks/useModal'
import { useAppDispatch } from '../../store/hooks'
import { setIsOpen } from '../../store/user/userSlice'

const TopBar: FC = () => {
  const dispatch = useAppDispatch()

  const modalProps = useModal()
  const { open, onOpen } = modalProps

  return (
    <>
      {open && <CreateForm {...modalProps} />}
      <div className='flex items-center justify-between gap-4 px-3'>
        <div
          onClick={() => {
            dispatch(setIsOpen(true))
          }}
          className='text-stone-500'
        >
          <IoSettingsOutline size={24} />
        </div>
        <SearchForm open={open} type='sideBar' />
        <div className='text-stone-500'>
          <IoCreateOutline size={24} onClick={onOpen} />
        </div>
      </div>

      {/* <div className='w-full flex items-center justify-between p-2'>
        {unreadDialogs !== null && unreadDialogs > 0 && (
          <span className='text-sm leading-tight w-[22px] h-[22px] shadow-md bg-blue-400 text-white rounded-full flex justify-center items-center'>
            {unreadDialogs}
          </span>
        )}
      </div> */}
    </>
  )
}

export default TopBar
