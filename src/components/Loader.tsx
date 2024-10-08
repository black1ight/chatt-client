import { FC } from 'react'
import { Oval } from 'react-loader-spinner'
import { useAppSelector } from '../store/hooks'

interface LoaderProps {
  size: string
}

const Loader: FC<LoaderProps> = ({ size }) => {
  const { isLoading } = useAppSelector((state) => state.helpers)

  return (
    <Oval
      visible={isLoading === 'fetch'}
      height={size}
      width={size}
      color='#4fa94d'
      ariaLabel='oval-loading'
      wrapperStyle={{}}
      wrapperClass=''
      strokeWidth='4'
    />
  )
}

export default Loader
