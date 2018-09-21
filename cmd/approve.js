const { handleBalances } = require('./accounts')
const { toTokenBase } = require('../lib/units')
const { printTxStart, printTxMining, printError, printTxSuccess } = require('../lib/print')
const { getAllContracts, getContract } = require('../lib/contracts')

async function handleApprove(argv) {
  const { spender, verbose, tcr, numTokens } = argv
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  // Wallet / network provider / contracts
  const { token, signerProvider, network } = await getAllContracts(argv)

  const decimals = await token.functions.decimals()

  // Package tx args
  const convertedNumTokens = toTokenBase(numTokens, decimals)
  const contract = await getContract(tcr, spender)
  const args = [contract.address, convertedNumTokens]

  const methodSignature = token.interface.functions.approve.signature
  // Print tx details
  printTxStart(methodSignature, args, spender, token, network)

  // Revert if mainnet
  if (network === 'mainnet') {
    console.log('mainnet')
    return
  }

  // Send tx
  const tx = await token.functions.approve(...args)

  // Wait for tx mining
  printTxMining(tx)
  await tx.wait()

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
  handleApprove,
}
