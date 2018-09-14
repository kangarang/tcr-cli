const { Signale } = require('signale')

const { handleBalances } = require('./accounts')
const { getListingHash } = require('../lib/values')
const { printTxStart, printTxSuccess } = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')

const sigOptions = {
  interactive: true,
  stream: process.stdout,
}

const signale = new Signale(sigOptions)
signale.config({
  displayTimestamp: true,
  displayFilename: true,
})

// Apply for listing in the registry
async function handleUpdateStatus(argv) {
  const { listingID, verbose } = argv
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  // Wallet / network provider / contracts
  const { registry, signerProvider, network } = await getAllContracts(argv)
  const registryName = await registry.functions.name()

  // Package tx args
  const listingHash = getListingHash(listingID)
  let args = [listingHash]

  signale.start(`

  [%d/3] - Sending transaction
  `, 1)

  const methodSignature = registry.interface.functions.updateStatus.signature

  // Print tx details
  printTxStart(methodSignature, args, registryName, registry, network)

  // TODO: warn if mainnet
  if (network === 'mainnet') {
    console.log('WARNING: MAINNET!')
    return
  }

  // Send tx
  const tx = await registry.functions.updateStatus(...args)

  // Wait for tx mining
  signale.await('[%d/3] - Waiting for mining', 2)
  await tx.wait()

  console.log()
  // Get tx receipt
  const receipt = await signerProvider.provider.getTransactionReceipt(tx.hash)
  if (receipt.status !== 1) {
    // Error during send tx
    console.log('')
    signale.error('[%d/3] - Error while processing transaction', 3)
    console.log('')
    return
  }

  // Successfully mined tx
  printTxSuccess(receipt)
  console.log()
  signale.success('[%d/3] - Successful transaction!', 3)
  console.log()
}

module.exports = {
  handleUpdateStatus,
}
