import { FC } from 'react'
import { useAppSelector } from '../../store/hooks'
import { CiLogout } from 'react-icons/ci'
import { IResUser, IUser } from '../../types/types'

interface LeaveProps {
  roomOwner: boolean
  removeSubscriber: (user: IResUser | IUser) => void
}

const Leave: FC<LeaveProps> = ({ roomOwner, removeSubscriber }) => {
  const { user } = useAppSelector((state) => state.user)

  return (
    <button
      disabled={roomOwner}
      onClick={() => removeSubscriber(user!)}
      className={`bg-slate-200 py-1 px-2 flex gap-4 hover:bg-slate-300 cursor-pointer ${roomOwner && 'opacity-50'}`}
    >
      <CiLogout size={24} className={`${!roomOwner && 'text-rose-700'}`} />

      <span className='col-span-6'>Leave</span>
    </button>
  )
}

export default Leave
