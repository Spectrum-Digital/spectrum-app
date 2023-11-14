export const SPECTRUM_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct AmountsOutHop[]',
        name: 'hops',
        type: 'tuple[]',
      },
    ],
    name: 'getAmountsOut',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct AmountsOutHop[][]',
        name: 'candidates',
        type: 'tuple[][]',
      },
    ],
    name: 'getAmountsOutCandidates',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amountOut',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'getPairCalldata',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'poolRequestCalldata',
            type: 'bytes',
          },
        ],
        internalType: 'struct PoolRequestLeg[]',
        name: 'legs',
        type: 'tuple[]',
      },
    ],
    name: 'getPoolRequests',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
      {
        internalType: 'address[]',
        name: 'tokens0',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'getPairCalldata',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'poolRequestCalldata',
            type: 'bytes',
          },
        ],
        internalType: 'struct PoolRequestLeg[][]',
        name: 'candidates',
        type: 'tuple[][]',
      },
    ],
    name: 'getPoolRequestsCandidates',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes[]',
            name: 'results',
            type: 'bytes[]',
          },
          {
            internalType: 'address[]',
            name: 'tokens0',
            type: 'address[]',
          },
        ],
        internalType: 'struct PoolRequestCandidateResult[]',
        name: 'result',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
