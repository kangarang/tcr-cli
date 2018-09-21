const ethers = require('ethers')
const utils = require('ethers/utils')
const { getSignerProvider } = require('./provider')

const { ipfsGetData } = require('./ipfs')

const rinkeby = [
  {
    name: 'The Sunset Registry',
    tokenAddress: '0x6bb36e335c8f1b483903c4d56bac161f1ea104fd',
    votingAddress: '0x2650dd674462658d1560be06c5d71b9d5e6c5ab0',
    parameterizerAddress: '0x7e40a2fb800cfffacdc3d0cc7d37db9d4ac5fcca',
    registryAddress: '0x3b162630d3de8ea1df670aadf8a549849f7d6b2a',
    tokenSymbol: 'SUN',
    tokenName: 'SunToken',
    multihash: 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr',
  },
]

const addresses = {
  adChain: {
    network: 'mainnet',
    blockNumber: 5470665,
    voting: '0xb4b26709FFed2cd165B9b49eeA1AC38d133d7975',
    registry: '0x5E2Eb68A31229B469e34999C467b017222677183',
    parameterizer: '0xfa50c2d5f53b42212b350a0ce82e1411fe25cd8d',
    token: {
      address: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
      blockNumber: 3899751,
    },
  },
  cpl: {
    network: 'mainnet',
    blockNumber: 5987290,
    token: '0xb97d678a21015fb50dd99a633df0877960e36193',
    voting: '0xFE14D5CCe5FA6ADEa06e9493A066c6F2e5E2B432',
    registry: '0x9552F40b3a6F3672A821c15C460f372C67F4E939',
    parameterizer: '0xb994c0efe4687f1010110599537b726d60278a10',
  },
  ethaireum: {
    network: 'rinkeby',
    blockNumber: 3006538,
    token: '0x7b003c03261d5a272635bd6a67527fff8e85d84e',
    voting: '0x782d86aa05d16e4c5aa48b9ad478403c5976d878',
    registry: '0x659f3399970145d2e2da217f88e8e54818beaceb',
    parameterizer: '0x9c3a507573e7917e611e198c3df8db5eeb81994f',
  },
}

async function getContract(tcr, contractType) {
  const ipfsABIs = await ipfsGetData('QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu')
  if (tcr === 'cpl') {
    return {
      abi: ipfsABIs[contractType].abi,
      address: utils.getAddress(addresses[tcr][contractType]),
      network: addresses[tcr].network,
      blockNumber: addresses[tcr].blockNumber,
    }
  } else if (tcr === 'adChain') {
    // get abis from ipfs
    if (contractType === 'token') {
      return {
        abi: ipfsABIs.token.abi,
        address: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
        network: 'mainnet',
        blockNumber: 3899751,
      }
    }
    // registry and plcrvoting
    return {
      abi: ipfsABIs[contractType].abi,
      address: utils.getAddress(addresses.adChain[contractType]),
      network: 'mainnet',
      blockNumber: addresses.adChain.blockNumber,
    }
  } else {
    const newIpfsABIs = await ipfsGetData(
      'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr'
    )
    // non-adChain
    return {
      abi: newIpfsABIs[contractType].abi,
      address: utils.getAddress(addresses[tcr][contractType]),
      network: addresses[tcr].network,
      blockNumber: addresses[tcr].blockNumber,
    }
  }
}

async function getAllContracts(argv) {
  const token = await getContract(argv.tcr, 'token')
  const voting = await getContract(argv.tcr, 'voting')
  const registry = await getContract(argv.tcr, 'registry')
  const parameterizer = await getContract(argv.tcr, 'parameterizer')
  const signerProvider = await getSignerProvider(argv, token.network)
  return {
    token: new ethers.Contract(token.address, token.abi, signerProvider),
    voting: new ethers.Contract(voting.address, voting.abi, signerProvider),
    registry: new ethers.Contract(registry.address, registry.abi, signerProvider),
    parameterizer: new ethers.Contract(
      parameterizer.address,
      parameterizer.abi,
      signerProvider
    ),
    signerProvider,
    network: token.network,
  }
}

async function getEthersContract(argv, contractType, signerProvider) {
  const contract = await getContract(argv.tcr, contractType)
  return new ethers.Contract(contract.address, contract.abi, signerProvider)
}

module.exports = {
  getContract,
  getAllContracts,
  getEthersContract,
}
