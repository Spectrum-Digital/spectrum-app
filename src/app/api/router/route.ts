import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SpectrumRouter, SpectrumPeriphery, Token, Path, BytesLike, NodeVolatility, DEXRouters } from '@/lib/router'

import { SupportedChainId } from '@/constants/chains'
import { getWeightedNodes } from '@/constants/tokens'

const aerodromeGraphCache = new Map<BytesLike, BytesLike[]>()
const aerodromeTokensCache = new Map<BytesLike, Token>()
const aerodromeVolatilityCache = new Map<`${BytesLike}:${BytesLike}`, NodeVolatility>()

const camelotGraphCache = new Map<BytesLike, BytesLike[]>()
const camelotTokensCache = new Map<BytesLike, Token>()
const camelotVolatilityCache = new Map<`${BytesLike}:${BytesLike}`, NodeVolatility>()

const spookyswapV2GraphCache = new Map<BytesLike, BytesLike[]>()
const spookyswapV2TokensCache = new Map<BytesLike, Token>()
const spookyswapV2VolatilityCache = new Map<`${BytesLike}:${BytesLike}`, NodeVolatility>()

class RouterAggregator {
  private routers: SpectrumRouter[] = []
  private aerodromeRouter: SpectrumRouter
  private camelotRouter: SpectrumRouter
  private spookyswapV2Router: SpectrumRouter

  constructor() {
    // Define routers
    this.aerodromeRouter = new SpectrumRouter({
      dexRouter: DEXRouters.BASE_AERODROME_V2,
      graphCache: {
        get: async (key: BytesLike) => aerodromeGraphCache.get(key),
        set: async (key: BytesLike, value: BytesLike[]) => void aerodromeGraphCache.set(key, value),
      },
      tokensCache: {
        get: async (key: BytesLike) => aerodromeTokensCache.get(key),
        set: async (key: BytesLike, value: Token) => void aerodromeTokensCache.set(key, value),
      },
      volatilityCache: {
        get: async (key: `${BytesLike}:${BytesLike}`) => aerodromeVolatilityCache.get(key),
        set: async (key: `${BytesLike}:${BytesLike}`, value: NodeVolatility) => void aerodromeVolatilityCache.set(key, value),
      },
    })

    this.camelotRouter = new SpectrumRouter({
      dexRouter: DEXRouters.ARBITRUM_CAMELOT,
      graphCache: {
        get: async (key: BytesLike) => camelotGraphCache.get(key),
        set: async (key: BytesLike, value: BytesLike[]) => void camelotGraphCache.set(key, value),
      },
      tokensCache: {
        get: async (key: BytesLike) => camelotTokensCache.get(key),
        set: async (key: BytesLike, value: Token) => void camelotTokensCache.set(key, value),
      },
      volatilityCache: {
        get: async (key: `${BytesLike}:${BytesLike}`) => camelotVolatilityCache.get(key),
        set: async (key: `${BytesLike}:${BytesLike}`, value: NodeVolatility) => void camelotVolatilityCache.set(key, value),
      },
    })

    this.spookyswapV2Router = new SpectrumRouter({
      dexRouter: DEXRouters.FANTOM_SPOOKYSWAP_V2,
      graphCache: {
        get: async (key: BytesLike) => spookyswapV2GraphCache.get(key),
        set: async (key: BytesLike, value: BytesLike[]) => void spookyswapV2GraphCache.set(key, value),
      },
      tokensCache: {
        get: async (key: BytesLike) => spookyswapV2TokensCache.get(key),
        set: async (key: BytesLike, value: Token) => void spookyswapV2TokensCache.set(key, value),
      },
      volatilityCache: {
        get: async (key: `${BytesLike}:${BytesLike}`) => spookyswapV2VolatilityCache.get(key),
        set: async (key: `${BytesLike}:${BytesLike}`, value: NodeVolatility) => void spookyswapV2VolatilityCache.set(key, value),
      },
    })

    // Inject routers
    this.routers.push(this.aerodromeRouter)
    this.routers.push(this.camelotRouter)
    this.routers.push(this.spookyswapV2Router)

    // Synchronize each router
    this.synchronize()
  }

  public async getAvailablePaths(
    tokenIn: string,
    tokenOut: string,
    chainId: number,
  ): Promise<{
    paths: Path[]
    error?: string
  }> {
    return await SpectrumRouter.getAvailablePaths(
      tokenIn,
      tokenOut,
      this.routers.filter(router => router.chainId === chainId),
    )
  }

  private async synchronize(): Promise<void> {
    await this.synchronizeExchange(this.aerodromeRouter, getWeightedNodes(SupportedChainId.BASE))
    await this.synchronizeExchange(this.camelotRouter, getWeightedNodes(SupportedChainId.ARBITRUM))
    await this.synchronizeExchange(this.spookyswapV2Router, getWeightedNodes(SupportedChainId.FANTOM))
  }

  private async synchronizeExchange(router: SpectrumRouter, weightedNodes: BytesLike[]): Promise<void> {
    // Emit we're synchronizing
    router.toggleSynchronizing(true)

    // Add weighted nodes
    router.addWeightedNodes(weightedNodes)

    // Add pools synchronously, because async messes with cache storage.
    const pools = await SpectrumPeriphery.getPools(router.dexRouter)
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i]!
      await router.addPair(pool.token0, pool.token1, pool.stable)
    }

    // Emit we're done synchronizing
    router.toggleSynchronizing(false)
  }
}

const router = new RouterAggregator()
const ZAddress = z.string()
const ZChainId = z.coerce.number()

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const tokenIn = ZAddress.safeParse(searchParams.get('tokenIn'))
  const tokenOut = ZAddress.safeParse(searchParams.get('tokenOut'))
  const chainId = ZChainId.safeParse(searchParams.get('chainId'))

  if (!tokenIn.success) {
    return NextResponse.json({ error: 'TokenIn param missing' }, { status: 400 })
  } else if (!tokenOut.success) {
    return NextResponse.json({ error: 'TokenOut param missing' }, { status: 400 })
  } else if (!chainId.success) {
    return NextResponse.json({ error: 'ChainId param missing' }, { status: 400 })
  }

  const routes = await router.getAvailablePaths(tokenIn.data, tokenOut.data, chainId.data)

  if (routes.error) {
    return NextResponse.json({ error: routes.error }, { status: 400 })
  }

  return NextResponse.json(routes.paths)
}
