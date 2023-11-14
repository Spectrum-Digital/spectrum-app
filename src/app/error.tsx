'use client'

import { useEffect } from 'react'
import Replay from '@mui/icons-material/Replay'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='col-center mx-auto my-16'>
      <h1 className='text-display-2xl'>Oops!</h1>
      <p className='text-sm'>Something went wrong... Check the console for more information.</p>
      <button
        className='btn-primary mt-4'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
        <Replay className='ml-2' />
      </button>
    </div>
  )
}
