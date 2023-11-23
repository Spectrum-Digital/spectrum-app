import { NextRequest, NextResponse } from 'next/server'
import { externalTokens } from '@/constants/tokens'

export async function GET(_request: NextRequest) {
  return NextResponse.json(externalTokens)
}
