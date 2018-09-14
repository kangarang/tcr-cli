const boxen = require('boxen')

const { handleBalances } = require('./accounts')
const { getProvider } = require('../lib/provider')

// Apply for listing in the registry
async function handleTx(argv) {
  const { verbose, network, txHash } = argv
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  const provider = await getProvider(network)
  const receipt = await provider.getTransactionReceipt(txHash)

  const BOX = `Tx hash: ${receipt.transactionHash}
Block number: ${receipt.blockNumber}
Status: ${receipt.status}
Gas used: ${receipt.gasUsed.toString()}
Cumulative gas used: ${receipt.cumulativeGasUsed.toString()}`

  console.log(
    boxen(BOX, { padding: 1, margin: 1, borderStyle: 'single', borderColor: 'cyan' })
  )
}

module.exports = {
  handleTx
}
