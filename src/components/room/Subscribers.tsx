import { FC, useEffect, useRef, useState } from 'react'
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
  promoteSubscriber: (user: IResUser) => void
}

const Subscribers: FC<SubscribersProps> = (props) => {
  const subRef = useRef<HTMLDivElement | null>(null)
  const addSubRef = useRef<HTMLDivElement | null>(null)
  const { currentUsers } = useAppSelector((state) => state.search)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const [openSearch, setOpenSearch] = useState(false)
  const [openSubscribers, setOpenSubscribers] = useState(true)

  const subscribersHandler = (e: MouseEvent) => {
    if (addSubRef.current && !e.composedPath().includes(addSubRef.current)) {
      if (openSubscribers) {
        setOpenSubscribers(false)
        setOpenSearch(false)
      } else {
        setOpenSubscribers(true)
      }
    }
  }

  useEffect(() => {
    subRef.current?.addEventListener('click', subscribersHandler)
    return () => {
      subRef.current?.removeEventListener('click', subscribersHandler)
    }
  }, [])

  return (
    <div>
      <div
        ref={subRef}
        className='flex gap-3 items-center bg-slate-200 px-2 py-1 cursor-pointer hover:bg-slate-300'
      >
        <MdSupervisorAccount size={28} />
        <span>{activeRoom?.users.length}</span>
        <h3>Subscribers</h3>
        <div
          onClick={() => setOpenSearch(!openSearch)}
          ref={addSubRef}
          className='ml-auto'
        >
          <HiUserAdd size={24} />
        </div>
      </div>
      {openSearch && <SearchForm open={props.open} type='room-profile' />}
      {currentUsers && <SearchUsers setOpenSearch={setOpenSearch} />}
      {openSubscribers && <SubscribersList {...props} />}
    </div>
  )
}

export default Subscribers
