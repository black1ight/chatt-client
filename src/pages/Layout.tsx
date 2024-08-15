import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout: FC = () => {
  return (
    <div className='min-h-screen bg-slate-300 font-roboto text-stone-700'>
      <Header />
      <div className='container max-sm:px-0'>
        <Outlet />
      </div>
      <ToastContainer position='bottom-left' autoClose={2000} />
    </div>
  )
}

export default Layout
