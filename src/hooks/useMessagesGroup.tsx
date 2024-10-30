import { useEffect, useState } from 'react'
import { IResMessage } from '../store/messenger/messengerSlice'

const useMessagesGroup = (messages: IResMessage[] | null | undefined) => {
  const [messagesGroups, setMessagesGroups] = useState<IResMessage[][] | null>(
    null,
  )

  const getGroup = (messages: IResMessage[]) => {
    let currentGroup: IResMessage[] = []
    let allGroups: IResMessage[][] = []

    messages?.forEach((item, index) => {
      if (
        currentGroup.length === 0 ||
        currentGroup[currentGroup.length - 1].userId === item.userId
      ) {
        currentGroup.push(item)
      } else {
        allGroups.push(currentGroup)
        currentGroup = [item]
      }

      if (index === messages.length - 1) {
        allGroups.push(currentGroup)
      }
    })

    setMessagesGroups(allGroups)
  }

  useEffect(() => {
    setMessagesGroups(null)
    messages && getGroup(messages)
  }, [messages])

  return { messagesGroups }
}

export default useMessagesGroup
