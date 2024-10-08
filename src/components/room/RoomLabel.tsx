import { FC } from 'react'
import { ModalProps } from '../../hooks/useModal'
import { useAppSelector } from '../../store/hooks'
import Typing from '../Typing'
import { IResRoom } from '../../types/types'

interface RoomLabelProps extends Partial<ModalProps> {
  room: IResRoom
  type?: string
}

const RoomLabel: FC<RoomLabelProps> = ({ room, type, ...props }) => {
  const { user } = useAppSelector((state) => state.user)
  const { typingData } = useAppSelector((state) => state.typing)
  return (
    <div
      onClick={props.onOpen}
      className='relative flex gap-2 items-center pl-1 cursor-pointer'
    >
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, ${room.color.first}, ${room.color.second})`,
        }}
        className={`min-w-14 min-h-14 text-xl rounded-full flex justify-center items-center text-white`}
      >
        {room.id[0].toLocaleUpperCase()}
      </div>
      <div className={` ${type === 'sidebar' && 'hidden'}`}>
        <div>{room.id}</div>
        {typingData?.userId !== user?.id &&
          typingData?.roomId === room.id &&
          typingData?.typing && <Typing />}
      </div>
    </div>
  )
}

export default RoomLabel
