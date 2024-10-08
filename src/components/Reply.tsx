import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addReplayMessage,
  IResMessage,
} from '../store/messenger/messengerSlice'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineReply } from 'react-icons/md'
import { addEditId, onReply } from '../store/form/formSlice'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../helpers/db'

const Reply: FC = () => {
  const dispatch = useAppDispatch()
  const { replyMessage } = useAppSelector((state) => state.messenger)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { reply } = useAppSelector((state) => state.form)

  const messages =
    activeRoom &&
    useLiveQuery(
      async (): Promise<IResMessage[] | undefined> =>
        await db
          .table('messages')
          .where('roomId')
          .equals(activeRoom.id)
          .toArray(),
      [activeRoom],
    )

  const findMessage = () => {
    if (reply) {
      const message = messages?.find((item) => item.id === reply)
      console.log(message)

      message
        ? dispatch(
            addReplayMessage({
              text: message.text,
              user: {
                email: message.user.email,
                user_name: message.user.user_name,
              },
            }),
          )
        : dispatch(addReplayMessage(null))
    }
  }

  const closeReply = () => {
    dispatch(addReplayMessage(null))
    dispatch(onReply(null))
    dispatch(addEditId(null))
  }

  useEffect(() => {
    messages && findMessage()
  }, [messages, reply])
  return (
    <div className='relative flex gap-2 items-center px-2 py-1'>
      <span
        onClick={() => closeReply()}
        className='absolute right-2 top-2 opacity-50 hover:opacity-100 cursor-pointer active:opacity-100'
      >
        <IoMdClose size={20} />
      </span>
      <span>
        <MdOutlineReply size={24} />
      </span>
      <div className='w-full'>
        <span className='text-cyan-700'>
          {replyMessage?.user.email.split('@')[0]}
        </span>
        <p className='w-[90%] whitespace-nowrap overflow-hidden text-ellipsis'>
          {replyMessage?.text}
        </p>
      </div>
    </div>
  )
}

export default Reply
