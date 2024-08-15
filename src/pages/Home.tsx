import { FC, useEffect } from 'react'
import { useConnectSocket } from '../hooks/useConnectSocket'
import { useAppDispatch } from '../store/hooks'
import Messages from '../components/Messages'
import Form from '../components/Form'
import { getMessages } from '../store/messenger/messengerSlice'

const Home: FC = () => {
  const dispatch = useAppDispatch()

  useConnectSocket()

  useEffect(() => {
    dispatch(getMessages())
  }, [])

  return (
    <div className='w-full overflow-hidden flex flex-col gap-[2px] mt-[2px]'>
      <div className={`h-[78vh] bg-white py-1`}>
        <Messages />
      </div>
      <Form />
    </div>
  )
}

export default Home
