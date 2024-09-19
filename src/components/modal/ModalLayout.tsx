import { FC, PropsWithChildren } from 'react'
import { ModalProps } from '../../hooks/useModal'
import Portal from '../common/Portal'

interface ModalLayoutProps extends PropsWithChildren<ModalProps> {}

const ModalLayout: FC<ModalLayoutProps> = ({
  onClose,
  open,
  children,
  animation,
}) => {
  if (!open) return null

  return (
    <Portal target='modals-root'>
      <div
        onClick={onClose}
        className={`w-full h-screen overscroll-none z-50 top-0 left-0 bg-black/30 fixed flex justify-center items-center ${animation === 'out' ? 'animate-fade-out' : 'animate-fade-in'}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className='absolute top-[20%] bg-white rounded-2xl shadow-xl'
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}

export default ModalLayout
