import { FC, useState } from 'react'
import InputUrl from './InputUrl'
import { useAppSelector } from '../../store/hooks'
import { UserProfileProps } from './UserProfile'

export interface IUserLabel extends UserProfileProps {}

const UserLabel: FC<IUserLabel> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAppSelector((state) => state.user)
  const { id, color, user_name, email, size, imageUrl, parent } = props

  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: size === 'small' ? '40px' : size === 'big' ? '100px' : '56px',
    height: size === 'small' ? '40px' : size === 'big' ? '100px' : '56px',
  }

  return (
    <div
      onClick={() => setIsOpen(true)}
      className='relative flex items-center gap-2 col-span-1'
    >
      <div
        style={
          imageUrl
            ? backgroundStyle
            : {
                backgroundImage: `linear-gradient(to bottom, ${color.first}, ${color.second})`,
              }
        }
        className={`${size === 'small' ? 'w-10 h-10' : size === 'big' ? 'w-[100px] h-[100px] text-2xl' : 'w-14 h-14'} rounded-full flex justify-center items-center text-white`}
      >
        {!imageUrl && user_name
          ? user_name
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
