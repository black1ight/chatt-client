import { FC, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addActiveMessage } from '../store/messenger/messengerSlice'
import { IoMdClose } from 'react-icons/io'
import { MdEdit, MdOutlineReply } from 'react-icons/md'
import { addEditId, onReply } from '../store/form/formSlice'
import { removeText } from '../store/form/textSlise'

interface ActiveMessageProps {
  roomRef: HTMLDivElement | null
}

const ActiveMessage: FC<ActiveMessageProps> = ({ roomRef }) => {
  const dispatch = useAppDispatch()
  const replyTextRef = useRef<HTMLParagraphElement | null>(null)
  const [isLoad, setIsLoad] = useState(false)

  const { activeMessage } = useAppSelector((state) => state.messenger)
  const { activeRoom } = useAppSelector((state) => state.rooms)
  const { replyId } = useAppSelector((state) => state.form)

  const closeActiveMessage = () => {
    dispatch(addActiveMessage(null))
    dispatch(onReply(null))
    dispatch(addEditId(null))
    dispatch(removeText())
  }

  useEffect(() => {
    if (roomRef && replyTextRef.current) {
      replyTextRef.current.style.setProperty(
        'width',
        `${roomRef.clientWidth - 80}px`,
      )
      setIsLoad(true)
    }

    return () => {
      closeActiveMessage()
    }
  }, [roomRef, activeRoom])

  return (
    <div className='relative flex gap-2 items-center px-2 py-1'>
      <span
        onClick={() => closeActiveMessage()}
        className='absolute right-2 top-2 opacity-50 hover:opacity-100 cursor-pointer active:opacity-100'
      >
        <IoMdClose size={20} />
      </span>
      <span>
        {replyId ? <MdOutlineReply size={24} /> : <MdEdit size={24} />}
      </span>
      <div className='w-full'>
        <span className='text-cyan-700'>
          {replyId ? activeMessage?.user.email.split('@')[0] : 'edit message'}
        </span>

        <p
          ref={replyTextRef}
          className='w-[90%] whitespace-nowrap overflow-hidden text-ellipsis'
        >
          {isLoad && activeMessage?.text}
        </p>
      </div>
    </div>
  )
}

export default ActiveMessage
