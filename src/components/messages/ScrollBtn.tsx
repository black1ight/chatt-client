import { FC } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { useAppSelector } from '../../store/hooks'

interface ScrollBtnProps {
  showBtn: boolean
  setOnScroll: (value: boolean) => void
}

const ScrollBtn: FC<ScrollBtnProps> = ({ setOnScroll, showBtn }) => {
  const { unreadMessagesCount } = useAppSelector((state) => state.messenger)

  return (
    <div
      onClick={() => setOnScroll(true)}
      className={`absolute flex justify-center items-center ${showBtn && '-translate-y-[130px]'} -bottom-10 right-4 z-[100] rounded-full bg-black/20 w-10 h-10 border border-stone-100 transition-transform`}
    >
      {unreadMessagesCount && (
        <span className='w-[20px] h-[20px] absolute  -top-3 flex justify-center items-center rounded-full text-xs bg-blue-400 shadow-md text-white border border-stone-100'>
          {unreadMessagesCount}
        </span>
      )}
      <IoIosArrowDown size={24} className='text-stone-600' />
    </div>
  )
}

export default ScrollBtn
