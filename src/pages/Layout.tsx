import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout: FC = () => {
  return (
    <div className='h-[100dvh] bg-gradient-to-br to-slate-400 from-amber-100 font-roboto leading-tight text-stone-700'>
      <div className='container max-sm:px-0'>
        <Outlet />
      </div>
      <ToastContainer position='bottom-left' autoClose={2000} />
    </div>
  )
}

export default Layout
