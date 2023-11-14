import { Hops, Legs } from '../typings'

export abstract class Transformers {
  public static hopsToLegs(hops: Hops): Legs {
    return hops.reduce((acc, hop) => {
      const legs = hop.path.map(leg => ({
        router: hop.router,
        path: leg,
      }))
      acc.push(...legs)
      return acc
    }, [] as Legs)
  }

  public static legsToHops(legs: Legs): Hops {
    return legs.reduce((acc, leg) => {
      const _lastHop = acc[acc.length - 1]
      const lastHop: Hops[number] = _lastHop ? _lastHop : { router: leg.router, path: [] }

      if (lastHop.router.address === leg.router.address) {
        lastHop.path.push(leg.path)
        if (!acc.length) {
          acc[0] = lastHop
        } else {
          acc[acc.length - 1] = lastHop
        }
      } else {
        acc[acc.length] = lastHop
      }
      return acc
    }, [] as Hops)
  }
}
