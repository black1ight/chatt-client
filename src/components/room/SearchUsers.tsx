import { FC } from 'react'
import CurrentUserItem from './CurrentUserItem'
import AddButton from './AddButton'
import CancelButton from './CancelButton'
import { useAppSelector } from '../../store/hooks'

interface SearchUsers {
  setOpenSearch: (flag: boolean) => void
}

const SearchUsers: FC<SearchUsers> = ({ setOpenSearch }) => {
  const { currentUsers } = useAppSelector((state) => state.search)

  return (
    <div>
      <ul>
        {currentUsers?.map((user, id) => (
          <CurrentUserItem key={user.email} user={user} id={id} />
        ))}
      </ul>
      <div className='flex justify-center gap-2 p-2'>
        <AddButton setOpenSearch={setOpenSearch} />
        <CancelButton setOpenSearch={setOpenSearch} />
      </div>
    </div>
  )
}

export default SearchUsers
