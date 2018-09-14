const ethers = require('ethers')

function getProvider(network) {
  return new ethers.providers.InfuraProvider(network)
}

function getMnemonicWallet(index = '0') {
  // mnemonic wallet
  const mnemonic = process.env.MNEMONIC || ''
  return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`)
}

async function getSignerProvider(argv, network) {
  const wallet = getMnemonicWallet(argv.pathIndex)
  // ethers provider / wallet
  const provider = new ethers.providers.InfuraProvider(network)
  return new ethers.Wallet(wallet.privateKey, provider)
}

module.exports = {
  getMnemonicWallet,
  getProvider,
  getSignerProvider,
}
