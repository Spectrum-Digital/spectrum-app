import Overview from '@/components/app/tokens/Overview'
import { Tokens } from '@/constants/tokens/tokens'

async function getTokens() {
  return Object.values(Tokens)
}

export default async function Page() {
  const tokens = await getTokens()
  return (
    <div className='block mx-auto w-5/6 md:w-9/12 mt-10'>
      <div className='col-start'>
        <h1 className='text-display-sm font-semibold mb-5'>View real-time prices</h1>
        <Overview tokens={tokens} />
      </div>
    </div>
  )
}
