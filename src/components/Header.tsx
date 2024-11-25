import { FC, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../store/hooks'

import { GoKebabHorizontal } from 'react-icons/go'

import useModal from '../hooks/useModal'
import RoomProfile from './room/RoomProfile'
import RoomLabel from './room/RoomLabel'
import RoomSetting from './RoomSetting'
import ArrowToBack from './ArrowToBack'
import UserLabel from './user/UserLabel'
import UserStatusInfo from './user/UserStatusInfo'
import { useLiveQuery } from 'dexie-react-hooks'
import { IResUser } from '../types/types'
import db from '../helpers/db'

const Header: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)
  const [openSetting, setOpenSetting] = useState(false)
  const settingRef = useRef<HTMLDivElement>(null)

  const modalProps = useModal()
  const companioinGlobal = activeRoom?.users.find((el) => el.id !== user?.id)
  const companion = useLiveQuery(async (): Promise<IResUser | undefined> => {
    return await db.table('users').get(companioinGlobal?.id || 0)
  }, [activeRoom])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      settingRef.current &&
      !event.composedPath().includes(settingRef.current)
    ) {
      setOpenSetting(false)
    }
  }
  useEffect(() => {
    if (openSetting) {
      document.body.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openSetting])

  return (
    <div className={`w-full h-[72px] bg-white p-2 flex items-center border-b`}>
      {activeRoom && (
        <div className='hidden max-sm:flex items-center gap-1 bg-white mr-1'>
          <ArrowToBack type='header' />
        </div>
      )}

      {activeRoom && activeRoom.type === 'chat' && (
        <RoomLabel {...modalProps} room={activeRoom} />
      )}
      {activeRoom &&
        activeRoom.type === 'dialog' &&
        (companion || companioinGlobal) && (
          <div className='flex gap-2 items-center'>
            <UserLabel
              size=''
              parent='header'
              modalProps={modalProps}
              {...(companion || companioinGlobal!)}
            />
            <UserStatusInfo
              size=''
              parent=''
              {...(companion || companioinGlobal!)}
            />
          </div>
        )}

      {modalProps.open && activeRoom && activeRoom.type === 'chat' && (
        <RoomProfile {...modalProps} />
      )}
      {activeRoom && (
        <div
          ref={settingRef}
          onClick={() => setOpenSetting(!openSetting)}
          className='relative ml-auto cursor-pointer'
        >
          <GoKebabHorizontal style={{ transform: 'rotate(90deg)' }} size={24} />
          {openSetting && <RoomSetting />}
        </div>
      )}
    </div>
  )
}

export default Header
