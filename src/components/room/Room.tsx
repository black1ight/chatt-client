import { FC, useEffect, useRef } from 'react'
import Messages from '../Messages'
import Reply from '../Reply'
import { useAppSelector } from '../../store/hooks'
import Form from '../Form'
import { checkSubscribe } from './RoomProfile'
import Join from './Join'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../../helpers/db'
import { IResRoom } from '../../types/types'
import SelectedMenu from './SelectedMenu'

const Room: FC = () => {
  const roomRef = useRef<HTMLDivElement | null>(null)
  const { replyMessage, selectedMessages } = useAppSelector(
    (state) => state.messenger,
  )
  const { replyId } = useAppSelector((state) => state.form)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { user } = useAppSelector((state) => state.user)

  // const room = useLiveQuery(async (): Promise<IResRoom | undefined> => {
  //   const data = await db.table('rooms').get(activeRoom?.id!)
  //   return data
  // }, [])

  useEffect(() => {
    // return () => {
    //   if (activeRoom?.isTemp) {
    //     const userId =
    //       activeRoom.users.find((el) => el.id !== user?.id)?.id || 0
    //     db.table('users').delete(userId)
    //   }
    // }
  }, [replyId, activeRoom])

  const isSubscribe = activeRoom ? checkSubscribe(activeRoom, user!.id) : null

  return (
    <div ref={roomRef} className={`flex-grow overflow-hidden flex flex-col `}>
      <Messages />
      {(replyId || replyMessage) && roomRef.current && (
        <div className='bg-slate-100 w-full border-t'>
          <Reply roomRef={roomRef.current} />
        </div>
      )}
      {isSubscribe && !selectedMessages ? (
        <Form />
      ) : selectedMessages && selectedMessages.length > 0 ? (
        <SelectedMenu />
      ) : (
        <Join position='center' />
      )}
    </div>
  )
}

export default Room
