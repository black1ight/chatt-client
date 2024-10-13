import { FC, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { IResUser } from '../../types/types'
import { MdSupervisorAccount } from 'react-icons/md'
import { HiUserAdd } from 'react-icons/hi'
import SearchForm from '../sidebar/SearchForm'
import { ModalProps } from '../../hooks/useModal'

import SearchUsers from './SearchUsers'
import SubscribersList from './SubscribersList'

export interface SubscribersProps extends ModalProps {
  roomOwner: boolean
  removeSubscriber: (user: IResUser) => void
}

const Subscribers: FC<SubscribersProps> = (props) => {
  const { currentUsers } = useAppSelector((state) => state.search)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const [openSearch, setOpenSearch] = useState(false)
  const [openSubscribers, setOpenSubscribers] = useState(false)

  const subscribersHandler = () => {
    if (openSubscribers) {
      setOpenSubscribers(false)
      setOpenSearch(false)
    } else {
      setOpenSubscribers(true)
    }
  }

  return (
    <div>
      <div
        onClick={subscribersHandler}
        className='flex gap-3 items-center bg-slate-200 px-2 py-1 cursor-pointer hover:bg-slate-300'
      >
        <MdSupervisorAccount size={28} />
        <span>{activeRoom?.users.length}</span>
        <h3>Subscribers</h3>
        <HiUserAdd
          onClick={() => setOpenSearch(!openSearch)}
          size={24}
          className='ml-auto'
        />
      </div>
      {openSearch && <SearchForm open={props.open} type='room-profile' />}
      {currentUsers && <SearchUsers setOpenSearch={setOpenSearch} />}
      {openSubscribers && <SubscribersList {...props} />}
    </div>
  )
}

export default Subscribers
