export const __ROUTER_FROM_TO_STABLE_FACTORY = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bool', name: 'stable', type: 'bool' },
          { internalType: 'address', name: 'factory', type: 'address' },
        ],
        internalType: 'struct IRouter.Route[]',
        name: 'routes',
        type: 'tuple[]',
      },
    ],
    name: 'getAmountsOut',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
