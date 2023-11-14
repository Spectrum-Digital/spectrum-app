import Link from 'next/link'
import Return from '@mui/icons-material/KeyboardReturn'

export default function NotFound() {
  return (
    <div className='col-center mx-auto my-16'>
      <h1 className='text-display-2xl'>404</h1>
      <p className='text-display-sm'>Page not found!</p>
      <Link href='/' className='btn-primary mt-4'>
        Return Home
        <Return className='ml-2' />
      </Link>
    </div>
  )
}
