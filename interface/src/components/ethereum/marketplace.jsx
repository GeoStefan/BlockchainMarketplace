const marketplaceAbi = [
    {
      "constant": false,
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getActor",
      "outputs": [
        {
          "name": "charge",
          "type": "uint256"
        },
        {
          "name": "actorType",
          "type": "uint8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        },
        {
          "name": "actorAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getActorsNumber",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "rewardFreelancer",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "rewardEvaluator",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "timeToResolve",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "timeToEvaluate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "domain",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "status",
          "type": "uint8"
        }
      ],
      "name": "TaskCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "TaskCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "evaluatorId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "evaluator",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "EvaluatorAssignedToTask",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Pause",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Unpause",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipRenounced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "userId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "ActorCreated",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_charge",
          "type": "uint256"
        },
        {
          "name": "_actorType",
          "type": "uint8"
        },
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_category",
          "type": "string"
        },
        {
          "name": "_amount",
          "type": "uint256"
        },
        {
          "name": "_actorAddress",
          "type": "address"
        }
      ],
      "name": "createActor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_tokenContract",
          "type": "address"
        }
      ],
      "name": "setTokenContract",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "rewardFreelancer",
          "type": "uint256"
        },
        {
          "name": "rewardEvaluator",
          "type": "uint256"
        },
        {
          "name": "timeToResolve",
          "type": "uint256"
        },
        {
          "name": "timeToEvaluate",
          "type": "uint256"
        },
        {
          "name": "domain",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ],
      "name": "createTask",
      "outputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "taskId",
          "type": "uint256"
        },
        {
          "name": "evaluatorId",
          "type": "uint256"
        }
      ],
      "name": "addEvaluatorForTask",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "cancelTask",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export default marketplaceAbi;