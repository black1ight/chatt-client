import { FC, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addReplayMessage } from '../store/messenger/messengerSlice'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineReply } from 'react-icons/md'
import { onReply } from '../store/form/formSlice'

const Reply: FC = () => {
  const dispatch = useAppDispatch()
  const { messages, replyMessage } = useAppSelector((state) => state.messenger)
  const { reply } = useAppSelector((state) => state.form)

  const findMessage = () => {
    if (reply) {
      const message = messages.find((item) => item.id === reply)

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
  }

  useEffect(() => {
    findMessage()
  }, [reply])
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
