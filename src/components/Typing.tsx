import { FC } from 'react'
import { useAppSelector } from '../store/hooks'

const Typing: FC = () => {
  const { typingData } = useAppSelector((state) => state.typing)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const isChat = activeRoom?.type === 'chat'
  return (
    <div className='relative flex gap-1 items-center text-cyan-700 leading-tight'>
      <div className='absolute top-1/2 -translate-y-[40%] flex gap-[3px]'>
        <div className='w-[3px] h-[3px] bg-cyan-700 rounded-full animate-scale-slow '></div>
        <div className='w-[3px] h-[3px] bg-cyan-700 rounded-full animate-scale-middle '></div>
        <div className='w-[3px] h-[3px] bg-cyan-700 rounded-full animate-scale-fast '></div>
      </div>
      <div className='pl-6'>{isChat ? typingData?.userName : 'typing'}</div>
    </div>
  )
}

export default Typing
