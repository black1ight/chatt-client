import { FC, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../store/hooks'

import { GoKebabHorizontal } from 'react-icons/go'

import useModal from '../hooks/useModal'
import RoomProfile from './room/RoomProfile'
import RoomLabel from './room/RoomLabel'
import RoomSetting from './RoomSetting'
import ArrowToBack from './ArrowToBack'
const Header: FC = () => {
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const [openSetting, setOpenSetting] = useState(false)
  const settingRef = useRef<HTMLDivElement>(null)

  const props = useModal()

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
    <div className={`w-full h-20 bg-white p-2 flex items-center border-b`}>
      {activeRoom && (
        <div className='hidden max-sm:flex items-center gap-1 bg-white'>
          <ArrowToBack />
        </div>
      )}

      {activeRoom && <RoomLabel {...props} room={activeRoom} />}

      {props.open && activeRoom && <RoomProfile {...props} />}
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
