import { FC, useState } from 'react'
import InputUrl from './InputUrl'
import { useAppSelector } from '../../store/hooks'
import { UserProfileProps } from './UserProfile'

export interface IUserLabel extends UserProfileProps {}

const UserLabel: FC<IUserLabel> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAppSelector((state) => state.user)
  const { id, color, username, email, size, imageUrl, parent, online } = props

  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: size === 'sm' ? '40px' : size === 'xl' ? '100%' : '56px',
    height: size === 'sm' ? '40px' : size === 'xl' ? '200px' : '56px',
  }

  return (
    <div
      onClick={() => setIsOpen(true)}
      className='relative flex items-center col-span-1'
    >
      <div
        className={`absolute ${size === 'sm' ? 'w-3 h-3' : 'w-[14px] h-[14px]'} ${!online && 'hidden'} ${size === 'xl' && 'hidden'} ${(parent === 'header' || parent === 'room') && 'hidden'} ${size === 'sm' ? 'bottom-0 right-1' : 'bottom-2 right-0'} bg-green-500 rounded-full border-2 border-white`}
      ></div>
      {parent === 'profile' && imageUrl && (
        <img src={`${imageUrl}`} className='mx-auto' />
      )}

      <div
        style={
          imageUrl
            ? backgroundStyle
            : color && {
                backgroundImage: `linear-gradient(to bottom, ${color.first}, ${color.second})`,
              }
        }
        className={`${size === 'sm' ? 'w-10 h-10' : size === 'xl' ? 'w-[100px] h-[100px] text-2xl' : 'w-14 h-14'} ${parent === 'profile' && imageUrl ? 'hidden' : 'rounded-full'} flex justify-center items-center text-white mx-auto`}
      >
        {!imageUrl && username
          ? username[0].toLocaleUpperCase()
          : !imageUrl && email && email[0].toLocaleUpperCase()}
      </div>

      {id === user?.id && parent === 'profile' && (
        <InputUrl
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(false)}
          type='user'
        />
      )}
    </div>
  )
}

export default UserLabel
