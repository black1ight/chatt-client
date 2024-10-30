import { FC } from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addActiveRoom } from '../store/rooms/roomsSlice'
import { setIsOpen } from '../store/user/userSlice'

interface ArrowProps {
  type: string
}

const ArrowToBack: FC<ArrowProps> = ({ type }) => {
  const dispatch = useAppDispatch()
  const { unreadDialogs } = useAppSelector((state) => state.messenger)

  const backToSideBar = () => {
    type === 'header' && dispatch(addActiveRoom(null))
    dispatch(setIsOpen(false))
  }
  return (
    <div
      onClick={backToSideBar}
      className='flex relative justify-center items-center w-14 h-14 border rounded-full'
    >
      {unreadDialogs !== null && unreadDialogs > 0 && (
        <span className='w-6 h-6 absolute -left-1 -top-1 flex justify-center items-center rounded-full text-xs bg-blue-400 shadow-md text-white'>
          {unreadDialogs}
        </span>
      )}
      <GoArrowLeft size={24} />
    </div>
  )
}

export default ArrowToBack
