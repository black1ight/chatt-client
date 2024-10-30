import { FC } from 'react'
import { IResMessage } from '../../store/messenger/messengerSlice'
import { useAppSelector } from '../../store/hooks'
import MessageItem from './MessageItem'
import { IResUser } from '../../types/types'
import db from '../../helpers/db'
import { useLiveQuery } from 'dexie-react-hooks'
import UserLabel from '../user/UserLabel'

interface MessagesGroupProps {
  messages: IResMessage[]
  groupRefs: (HTMLDivElement | null)[][]
  groupIndex: number
  messageBodyRef: HTMLDivElement | null
  setRef: (
    el: HTMLDivElement | null,
    groupIndex: number,
    itemIndex: number,
  ) => void
}

const MessagesGroup: FC<MessagesGroupProps> = ({
  groupIndex,
  groupRefs,
  messages,
  messageBodyRef,
  setRef,
}) => {
  const { user } = useAppSelector((state) => state.user)

  const author = messages.some((item) => item.userId === user?.id)

  let authorProfile = useLiveQuery(
    async (): Promise<IResUser> =>
      await db.table('users').get(messages[0].userId),
    [messages[0].userId],
  )

  return (
    <div
      className={`relative flex gap-2 items-end max-w-[80%] max-sm:max-w-[calc(100%-3rem)] ${author && 'ml-auto'} ${!author && 'pl-[3rem]'}`}
    >
      {authorProfile && !author && (
        <div className='absolute bottom-0 left-0'>
          <UserLabel size='sm' parent='message' {...authorProfile} />
        </div>
      )}
      <ul
        key={`${groupIndex}-${messages.length}`}
        className={`flex w-full flex-col gap-1`}
      >
        {!messages && (
          <div className='flex justify-center items-center'>
            <h3>Loading...</h3>
          </div>
        )}

        {messages &&
          messages.length > 0 &&
          messages.map((item, itemIndex) => {
            const reply = item.reply
            const unread = item.readUsers.indexOf(user?.id!) == -1
            const lastItem = messages[messages.length - 1].id
            const firstItem = messages[0].id

            return (
              <MessageItem
                setRef={setRef}
                groupRefs={groupRefs}
                messageBodyRef={messageBodyRef}
                key={itemIndex}
                author={author}
                reply={reply}
                unread={unread}
                item={item}
                itemIndex={itemIndex}
                lastItem={lastItem}
                firstItem={firstItem}
                groupIndex={groupIndex}
              />
            )
          })}
      </ul>
    </div>
  )
}

export default MessagesGroup
