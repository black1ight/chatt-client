import { FC } from 'react'
import { Oval } from 'react-loader-spinner'
import { useAppSelector } from '../store/hooks'

const Loader: FC = () => {
  const { isLoading } = useAppSelector((state) => state.helpers)
  console.log(isLoading)

  return (
    <Oval
      visible={isLoading === 'fetch'}
      height='24'
      width='24'
      color='#4fa94d'
      ariaLabel='oval-loading'
      wrapperStyle={{}}
      wrapperClass=''
      strokeWidth='4'
    />
  )
}

export default Loader
