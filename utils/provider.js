const Ethjs = require('ethjs')
const providers = require('ethers').providers

function getEthProvider(network) {
  return new Ethjs(new Ethjs.HttpProvider(`https://${network}.infura.io`))
}
function getEthersProvider(network) {
  return new providers.InfuraProvider(network)
}

module.exports = {
  getEthersProvider,
  getEthProvider,
}
