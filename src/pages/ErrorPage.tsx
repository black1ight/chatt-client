import { FC } from 'react'
import ErrorImg from '../assets/images/404.png'
import { Link } from 'react-router-dom'

const ErrorPage: FC = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-stone-300'>
      <img className='w-[50vh]' src={ErrorImg} />
      <Link
        to={'/'}
        className='bg-text/70 px-4 py-2 text-white rounded-md mt-6'
      >
        Повернутися назад
      </Link>
    </div>
  )
}

export default ErrorPage
