import { FC } from 'react'
import { useAppSelector } from '../store/hooks'

const Typing: FC = () => {
  const { typingData } = useAppSelector((state) => state.typing)
  return (
    <div className='relative flex gap-1 items-center text-cyan-700 leading-tight'>
      <div className='absolute top-1/2 -translate-y-[40%] flex gap-[3px]'>
        <div className='w-1 h-1 bg-cyan-700 rounded-full animate-scale-slow '></div>
        <div className='w-1 h-1 bg-cyan-700 rounded-full animate-scale-middle '></div>
        <div className='w-1 h-1 bg-cyan-700 rounded-full animate-scale-fast '></div>
      </div>
      <div className='pl-6'>{typingData?.userName}</div>
    </div>
  )
}

export default Typing
