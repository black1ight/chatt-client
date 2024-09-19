import { FC } from 'react'
import { ModalProps } from '../../hooks/useModal'
import { useAppSelector } from '../../store/hooks'
import Typing from '../Typing'

interface RoomLabelProps extends ModalProps {}

const RoomLabel: FC<RoomLabelProps> = (props) => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)
  const { typingData } = useAppSelector((state) => state.typing)
  return (
    <div
      onClick={props.onOpen}
      className='relative flex-auto flex gap-2 items-center pl-1 cursor-pointer'
    >
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, ${activeRoom?.color.first}, ${activeRoom?.color.second})`,
        }}
        className={`w-14 h-14 rounded-full flex justify-center items-center text-white border-2 border-white`}
      >
        {activeRoom?.id[0].toLocaleUpperCase()}
      </div>
      <div>
        <div>{activeRoom?.id}</div>
        {typingData?.userId !== user?.id &&
          typingData?.roomId === activeRoom?.id &&
          typingData?.typing && <Typing />}
      </div>
    </div>
  )
}

export default RoomLabel
