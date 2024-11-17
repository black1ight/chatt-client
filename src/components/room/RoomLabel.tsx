import { FC, useState } from 'react'
import { ModalProps } from '../../hooks/useModal'
import { useAppSelector } from '../../store/hooks'
import Typing from '../Typing'
import { IResRoom } from '../../types/types'
import InputUrl from '../user/InputUrl'

interface RoomLabelProps extends Partial<ModalProps> {
  room: IResRoom
  type?: string
  size?: string
}

const RoomLabel: FC<RoomLabelProps> = ({ room, type, size, ...props }) => {
  const { onOpen } = props
  const { user } = useAppSelector((state) => state.user)
  const { typingData } = useAppSelector((state) => state.typing)
  const [isOpen, setIsOpen] = useState(false)

  const labelHandler = () => {
    onOpen != undefined && onOpen()
    type === 'roomProfile' && setIsOpen(true)
  }

  const backgroundStyle = {
    backgroundImage: `url(${room.imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: size === 'sm' ? '40px' : size === 'xl' ? '100px' : '56px',
    height: size === 'sm' ? '40px' : size === 'xl' ? '100px' : '56px',
  }

  const global = type === 'global'

  return (
    <div
      onClick={labelHandler}
      className='relative flex gap-2 items-center cursor-pointer'
    >
      <div
        style={
          room.imageUrl
            ? backgroundStyle
            : {
                backgroundImage: `linear-gradient(to bottom, ${room.color?.first}, ${room.color?.second})`,
              }
        }
        className={`min-w-14 min-h-14 ${global && 'min-w-[40px] min-h-[40px]'} text-xl rounded-full flex justify-center items-center text-white`}
      >
        {!room.imageUrl && room.name[0].toLocaleUpperCase()}
      </div>
      <div
        className={`${(type === 'sideBar' || type === 'global') && 'hidden'}`}
      >
        <div>{room.name}</div>
        {typingData?.userId !== user?.id &&
          typingData?.roomId === room.id &&
          typingData?.typing && <Typing />}
      </div>
      {isOpen && type === 'roomProfile' && (
        <InputUrl
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(false)}
          type='room'
        />
      )}
    </div>
  )
}

export default RoomLabel
