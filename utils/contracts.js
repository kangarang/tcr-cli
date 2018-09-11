const Token = require('./abis/EIP20.json')
const Registry = require('./abis/Registry.json')
const PLCRVoting = require('./abis/PLCRVoting.json')
const { ipfsGetData } = require('./ipfs')

const abis = {
  token: Token.abi,
  voting: PLCRVoting.abi,
  registry: Registry.abi,
}

const addresses = {
  cpl: {
    network: 'mainnet',
    blockNumber: 5987290,
    token: '0xb97d678a21015fb50dd99a633df0877960e36193',
    voting: '0xFE14D5CCe5FA6ADEa06e9493A066c6F2e5E2B432',
    registry: '0x9552F40b3a6F3672A821c15C460f372C67F4E939',
  },
  ethaireum: {
    network: 'rinkeby',
    blockNumber: 2686413,
    token: '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891',
    voting: '0x946184cde118286d46825b866521d0236800c613',
    registry: '0x39cFBe27e99BAFA761Dac4566b4Af3B4C9cc8fBE',
    parameterizer: '0xd71498b67c157927b39900b51b13621e9b106769',
  },
  adChain: {
    network: 'mainnet',
    blockNumber: 5470665,
    voting: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975',
    registry: '0x5e2eb68a31229b469e34999c467b017222677183',
    token: {
      address: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
      blockNumber: 3899751,
    },
  },
}

const contracts = {}

function buildContract(tcr, contract) {
  if (addresses.hasOwnProperty(tcr)) {
    return {
      abi: abis[contract],
      address: addresses[tcr][contract],
    }
  }

  return contracts[tcr]
}

async function getContract(tcr, contractType) {
  const ipfsABIs = await ipfsGetData('QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu')
  if (tcr === 'cpl') {
    return {
      abi: ipfsABIs[contractType].abi,
      address: addresses[tcr][contractType],
      network: addresses[tcr].network,
      blockNumber: addresses[tcr].blockNumber,
    }
  }
  if (tcr === 'adChain') {
    // get abis from ipfs
    if (contractType === 'token') {
      return {
        abi: Token.abi,
        address: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
        network: 'mainnet',
        blockNumber: 3899751,
      }
    }
    // registry and plcrvoting
    return {
      abi: ipfsABIs[contractType].abi,
      address: addresses.adChain[contractType],
      network: 'mainnet',
      blockNumber: addresses.adChain.blockNumber,
    }
  }
  // non-adChain
  return {
    abi: abis[contractType],
    address: addresses[tcr][contractType],
    network: addresses[tcr].network,
    blockNumber: addresses[tcr].blockNumber,
  }
}

module.exports = {
  buildContract,
  getContract,
}
