interface RenderProps<T> {
  data: T
  keyData: string
}

const ProfileInfoItem = <T,>({ data, keyData }: RenderProps<T>) => {
  if (Object.values(data!)[0] === null) {
    return null
  }

  return (
    data && (
      <li key={keyData} className='flex flex-col'>
        <span className='flex-none'>{Object.values(data)}</span>
        <span className='text-xs text-message_username'>
          {Object.keys(data)}
        </span>
      </li>
    )
  )
}

export default ProfileInfoItem
