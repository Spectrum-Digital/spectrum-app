'use client'

import ReactModal from 'react-modal'
import Close from '@mui/icons-material/Close'
import WarningAmber from '@mui/icons-material/WarningAmber'

import { useSettingsModal, useSlippage } from '@/state/application/hooks'
import { InputPanel } from '../input'

function Modal({ title, isOpen, onClose, children }: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} shouldCloseOnOverlayClick shouldCloseOnEsc>
      <div className='flex flex-col justify-start'>
        <div className='flex flex-row w-full justify-between p-3 border-b border-gray-600'>
          <div className='font-semibold'>{title}</div>
          <Close className='hover:cursor-pointer hover:fill-secondary' onClick={onClose} />
        </div>
        {children}
      </div>
    </ReactModal>
  )
}

export function ErrorModal({ isOpen, onClose, error }: { isOpen: boolean; onClose: () => void; error: string | undefined }) {
  return (
    <Modal title='Error' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col w-full gap-4 p-3'>
        <WarningAmber className='text-red mx-auto ' sx={{ fontSize: { xs: 60, md: 100 } }} />
        <div className='text-xs mx-auto md:text-sm font-semibold text-red'>{error}</div>
      </div>
    </Modal>
  )
}

export function SettingsModal() {
  const { open, toggle } = useSettingsModal()
  const { slippagePercentage, slippageType, update } = useSlippage()

  return (
    <Modal title='Settings' isOpen={open} onClose={toggle}>
      <div className='flex flex-col w-full gap-2 p-3'>
        <div className='font-semibold text-sm'>Max slippage</div>
        <div className='flex flex-row justify-between gap-3'>
          <div className='flex flex-row justify-start gap-1 border border-gray-600 rounded-xl p-1 hover:cursor-pointer'>
            <div
              className={`btn-secondary rounded-md !px-3 !py-2 ${slippageType === 'auto' ? '!bg-blue-300 !text-white' : ''}`}
              onClick={() => update('auto', 0.5)}
            >
              Auto
            </div>
            <div
              className={`btn-secondary rounded-md !px-3 !py-2 ${slippageType === 'custom' ? '!bg-blue-300 !text-white' : ''}`}
              onClick={() => update('custom', 0.5)}
            >
              Custom
            </div>
          </div>
          <InputPanel
            value={slippagePercentage.toFixed(2)}
            label='%'
            onChange={val => {
              if (val) {
                update('custom', parseFloat(val))
              } else {
                update('auto', 0.5)
              }
            }}
            labelPosition='right'
          />
        </div>
      </div>
    </Modal>
  )
}
