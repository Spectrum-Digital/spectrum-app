'use client'

import { useEffect, useRef, useMemo } from 'react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

import useHover from '@/hooks/useHover'

export default function Chart({
  title,
  header,
  data,
  height,
  onHover,
}: {
  title: string
  header: string
  data: Array<{
    name: string
    value: number
  }>
  height: number
  onHover?: (value: number, shouldReset: boolean) => void
}) {
  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)

  const onHoverCallback = (value: number) => {
    if (onHover) {
      onHover(value, false)
    }
  }

  useEffect(() => {
    if (onHover && !isHover) {
      onHover(0, true)
    }
  }, [onHover, isHover])

  const [min, max] = useMemo(() => {
    if (data.length < 2) return [0, 10]
    const min = Math.min(...data.map(d => d.value)) * 0.98
    const max = Math.max(...data.map(d => d.value)) * 1.02
    return [min, max]
  }, [data])

  return (
    <div className='flex flex-col border border-primary rounded-xl relative overflow-hidden' ref={hoverRef}>
      <div className='flex flex-row justify-between items-center border-b border-gray-600 px-3 md:px-8'>
        <div className='text-sm md:text-md font-bold'>{title}</div>
      </div>
      <div className='p-3 md:p-5 text-lg md:text-display-sm font-medium'>{header}</div>
      <ResponsiveContainer width={'100%'} height={height}>
        <AreaChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: -30 }}>
          <XAxis axisLine={false} tickLine={false} dataKey='name' dy={-30} />
          <YAxis type='number' domain={[min, max]} hide />
          <Tooltip
            cursor={{ opacity: 0 }}
            contentStyle={{
              display: 'none',
            }}
            // @ts-ignore
            formatter={onHoverCallback}
          />
          <Area type='monotone' dataKey='value' stroke='rgb(34 93 184)' strokeWidth={0.7} fill='rgb(230 237 255)' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
