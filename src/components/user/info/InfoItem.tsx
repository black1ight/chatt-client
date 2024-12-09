import { CgProfile } from 'react-icons/cg'
import { MdAlternateEmail } from 'react-icons/md'
import { FiPhone } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import Input from '../Input'
import { addEditField, addEditValue } from '../../../store/profile/profileSlice'

interface RenderProps<T> {
  data: T
}

const InfoItem = <T,>({ data }: RenderProps<T>) => {
  const dispatch = useAppDispatch()
  const { editField } = useAppSelector((state) => state.profile)
  const dataKey = data && Object.keys(data)[0].replace(/[^a-zA-Zа-яА-Я]/g, '')

  const itemClickHandler = () => {
    dispatch(addEditField(dataKey))
    dispatch(
      addEditValue(Object.values(data as Record<string, unknown>).toString()),
    )
  }

  return (
    <div
      onClick={itemClickHandler}
      className='relative grid grid-cols-8 items-end gap-2 cursor-pointer last:pb-3'
    >
      {data && (
        <>
          <span className='col-span-1 text-message_time/40'>
            {dataKey === 'email' ? (
              <MdAlternateEmail size={24} />
            ) : dataKey === 'username' ? (
              <CgProfile size={24} />
            ) : dataKey === 'phone' ? (
              <FiPhone size={24} />
            ) : (
              ''
            )}
          </span>
          <span className='absolute right-0 top-6 text-message_time/40 text-sm text-nowrap overflow-hidden text-ellipsis'>
            {dataKey}
          </span>
          <span className='flex-grow col-span-7 text-nowrap overflow-hidden text-ellipsis  border-b'>
            {editField && editField === dataKey ? (
              <Input />
            ) : (
              Object.values(data)
            )}
          </span>
        </>
      )}
    </div>
  )
}

export default InfoItem
