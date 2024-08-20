import { FC, useEffect } from 'react'
import { useConnectSocket } from '../hooks/useConnectSocket'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import Messages from '../components/Messages'
import Form from '../components/Form'
import { getMessages } from '../store/messenger/messengerSlice'
import Reply from '../components/Reply'
import Header from '../components/Header'

const Home: FC = () => {
  const dispatch = useAppDispatch()
  const { replyMessage } = useAppSelector((state) => state.messenger)
  const { reply } = useAppSelector((state) => state.form)

  useConnectSocket()

  useEffect(() => {
    dispatch(getMessages())
  }, [reply])

  return (
    <div className='h-[100dvh] overflow-hidden flex flex-col mt-[2px] shadow-outer'>
      <Header />

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

export default Home
