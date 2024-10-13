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
    width: size === 'small' ? '40px' : size === 'big' ? '100px' : '56px',
    height: size === 'small' ? '40px' : size === 'big' ? '100px' : '56px',
  }

  return (
    <div
      onClick={labelHandler}
      className='relative flex gap-2 items-center pl-1 cursor-pointer'
    >
      <div
        style={
          room.imageUrl
            ? backgroundStyle
            : {
                backgroundImage: `linear-gradient(to bottom, ${room.color.first}, ${room.color.second})`,
              }
        }
        className={`min-w-14 min-h-14 text-xl rounded-full flex justify-center items-center text-white`}
      >
        {!room.imageUrl && room.id[0].toLocaleUpperCase()}
      </div>
      <div className={`${type === 'sidebar' && 'hidden'}`}>
        <div>{room.id}</div>
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
