import { FC, useEffect } from 'react'
import Messages from '../Messages'
import Reply from '../Reply'
import { useAppSelector } from '../../store/hooks'
import Form from '../Form'

const Room: FC = () => {
  const { replyMessage } = useAppSelector((state) => state.messenger)
  const { reply } = useAppSelector((state) => state.form)
  const { activeRoom } = useAppSelector((state) => state.rooms)

  useEffect(() => {}, [reply, activeRoom])

  return (
    <div className={`h-[90dvh] w-full overflow-hidden flex flex-col`}>
      <Messages />
      {reply ? (
        <div className='bg-slate-100 w-full border-t'>
          <Reply />
        </div>
      ) : replyMessage ? (
        <div className=' bg-slate-100 w-full border-t'>
          <Reply />
        </div>
      ) : (
        ''
      )}
      <Form />
    </div>
  )
}

export default Room
