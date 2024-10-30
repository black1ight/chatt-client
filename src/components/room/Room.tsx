import { FC, useEffect, useRef } from 'react'
import Messages from '../Messages'
import Reply from '../Reply'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Form from '../Form'
import { checkSubscribe } from './RoomProfile'
import Join from './Join'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'
import { IResRoom } from '../../types/types'
import { addActiveRoom } from '../../store/rooms/roomsSlice'

const Room: FC = () => {
  const dispatch = useAppDispatch()
  const roomRef = useRef<HTMLDivElement | null>(null)
  const { replyMessage } = useAppSelector((state) => state.messenger)
  const { replyId } = useAppSelector((state) => state.form)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)

  const updateActiveRoom = useLiveQuery(async (): Promise<
    IResRoom | undefined
  > => {
    const data: IResRoom = await db.table('rooms').get(activeRoom!.id)
    if (data) {
      dispatch(addActiveRoom(data))
    }
    return data
  }, [])

  useEffect(() => {}, [replyId, activeRoom])

  const isSubscribe = checkSubscribe(activeRoom!, user!.id)

  return (
    <div ref={roomRef} className={`flex-grow overflow-hidden flex flex-col`}>
      <Messages />
      {(replyId || replyMessage) && roomRef.current && (
        <div className='bg-slate-100 w-full border-t'>
          <Reply roomRef={roomRef.current} />
        </div>
      )}
      {isSubscribe ? <Form /> : <Join position='center' />}
    </div>
  )
}

export default Room
