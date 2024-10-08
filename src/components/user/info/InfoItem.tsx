import { CgProfile } from 'react-icons/cg'
import { MdAlternateEmail, MdOutlineLocalPhone } from 'react-icons/md'

interface RenderProps<T> {
  data: T
}

const InfoItem = <T,>({ data }: RenderProps<T>) => {
  const dataKey = data && Object.keys(data)[0].replace(/[^a-zA-Zа-яА-Я]/g, '')

  return (
    <div className='grid grid-cols-8 items-center gap-2 cursor-pointer py-1'>
      {data && (
        <>
          <span className='col-span-1'>
            {dataKey === 'email' ? (
              <MdAlternateEmail size={24} />
            ) : dataKey === 'username' ? (
              <CgProfile size={24} />
            ) : dataKey === 'phone' ? (
              <MdOutlineLocalPhone size={24} />
            ) : (
              ''
            )}
          </span>
          <span className='col-span-3 text-nowrap overflow-hidden text-ellipsis'>
            {dataKey}:
          </span>
          <span className='flex-grow text-end col-span-4 text-nowrap overflow-hidden text-ellipsis'>
            {Object.values(data)}
          </span>
        </>
      )}
    </div>
  )
}

export default InfoItem
