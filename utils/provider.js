const Ethjs = require('ethjs')

function getEthProvider(network) {
  console.log('network:', network)
  return new Ethjs(new Ethjs.HttpProvider(`https://${network}.infura.io`))
}

module.exports = {
  getEthProvider,
}
