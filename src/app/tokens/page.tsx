import Overview from '@/components/app/tokens/Overview'

export default function Page() {
  return (
    <div className='block mx-auto w-5/6 md:w-9/12 mt-10'>
      <div className='col-start'>
        <h1 className='text-display-sm font-semibold mb-5'>View real-time prices</h1>
        <Overview />
      </div>
    </div>
  )
}
