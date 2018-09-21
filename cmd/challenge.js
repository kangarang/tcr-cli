const { handleBalances } = require('./accounts')
const { getListingHash } = require('../lib/values')
const { printTxStart, printTxMining, printError, printTxSuccess } = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')

// Apply for listing in the registry
async function handleChallenge(argv) {
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
  let args = [listingHash, '']

  const methodSignature = registry.interface.functions.challenge.signature

  // Print tx details
  printTxStart(methodSignature, args, registryName, registry, network)

  // TODO: warn if mainnet
  if (network === 'mainnet') {
    console.log('WARNING: MAINNET!')
    return
  }

  // Send tx
  const tx = await registry.functions.challenge(...args)

  // Wait for tx mining
  printTxMining(tx)
  await tx.wait()

  console.log()
  // Get tx receipt
  const receipt = await signerProvider.provider.getTransactionReceipt(tx.hash)
  if (receipt.status !== 1) {
    // Error during send tx
    printError(receipt)
    return
  }

  // Successfully mined tx
  printTxSuccess(receipt)
}

module.exports = {
  handleChallenge,
}
