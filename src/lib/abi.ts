export const LUXMARKET_ABI = [
  {
    "type": "function",
    "name": "b",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "buy",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "isUp",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "costToBuy",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "isUp",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createMarket",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "title",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "category",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "referenceSource",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "referencePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "settleAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "oracle",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disputeWindow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMarket",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct LuxMarket.Market",
        "components": [
          {
            "name": "id",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "title",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "category",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "referenceSource",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "referencePrice",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "settleAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "qUp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "qDown",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "poolUp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "poolDown",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "settled",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "outcomeUp",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "oracle",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feedReportedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "disputeRaised",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "disputeRaiser",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "marketCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "markets",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "title",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "category",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "referenceSource",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "referencePrice",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "createdAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "settleAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "qUp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "qDown",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "poolUp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "poolDown",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "settled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "outcomeUp",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "oracle",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "feedReportedAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "disputeRaised",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "disputeRaiser",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "priceUp",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "raiseDispute",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeem",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reportOutcome",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "outcomeUp",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveDispute",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "finalOutcome",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sell",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "isUp",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "settle",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sharesDown",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "sharesUp",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalCollateralLocked",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Buy",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "trader",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "isUp",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "shares",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "cost",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DisputeRaised",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "raiser",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DisputeResolved",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "outcomeUp",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeedReported",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "outcomeUp",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MarketCreated",
    "inputs": [
      {
        "name": "id",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "title",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "referencePrice",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "settleAt",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Redeemed",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "trader",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Refunded",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "trader",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Settled",
    "inputs": [
      {
        "name": "market",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "outcomeUp",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  }
] as const;
