import { useEffect, useState } from 'react'
import { IResMessage } from '../store/messenger/messengerSlice'

const useFirstLast = (messages: IResMessage[] | null | undefined) => {
  const [firstItems, setFirstItems] = useState<IResMessage[] | null>(null)
  const [lastItems, setLastItems] = useState<IResMessage[] | null>(null)
  const getFirstLast = (messages: IResMessage[]) => {
    let currentArr: IResMessage[] = []
    const first: IResMessage[] = []
    const last: IResMessage[] = []
    messages.forEach((item, index) => {
      if (currentArr.length == 0 || currentArr[0].userId === item.userId) {
        currentArr.push(item)
      }
      if (currentArr[0].userId !== item.userId) {
        first.push(currentArr[0])
        last.push(currentArr[currentArr.length - 1])
        currentArr = []
        currentArr.push(item)
      }
      if (index === messages.length - 1 && currentArr.length > 0) {
        first.push(currentArr[0])
        last.push(currentArr[currentArr.length - 1])
        setFirstItems(first)
        setLastItems(last)
      }
    })
  }
  useEffect(() => {
    messages && getFirstLast(messages)
  }, [messages])
  return { firstItems, lastItems }
}

export default useFirstLast
