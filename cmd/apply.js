const { handleBalances } = require('./accounts')
const { getListingHash } = require('../lib/values')
const { printTxStart, printTxMining, printError, printTxSuccess } = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')

// Apply for listing in the registry
async function handleApply(argv) {
  const { listingID, verbose, data } = argv
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  // Wallet / network provider / contracts
  const { registry, token, parameterizer, signerProvider, network } = await getAllContracts(argv)
  const registryName = await registry.functions.name()
  const minDeposit = await parameterizer.functions.get('minDeposit')
  const convertedNumTokens = minDeposit.toString()

  // Package tx args
  const listingHash = getListingHash(listingID)
  let args = [listingHash, convertedNumTokens, listingID]

  const methodSignature = registry.interface.functions.apply.signature
  // Print tx details
  printTxStart(methodSignature, args, registryName, registry, network)

  // Revert if mainnet
  if (network === 'mainnet') {
    console.log('mainnet')
    return
  }

  // const spinner = ora('Sending TXXXXX').start()
  // setTimeout(() => {
  //   spinner.color = 'yellow'
  //   spinner.text = 'Loading rainbows'
  // }, 1000)

  // Send tx
  const tx = await registry.functions.apply(...args)

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

  // let etherscanLink = `https://${network}.etherscan.io/tx/${receipt.transactionHash}`
  // if (network === 'mainnet') {
  //   etherscanLink = `https://etherscan.io/tx/${receipt.transactionHash}`
  // }
  // const TX_LINK = terminalLink(
  //   'Click here to view transaction on Etherscan.io',
  //   etherscanLink
  // )
  // spinner.succeed('TRANSACTION SUCCEEDED!')
}

function sendPackagedTransaction() {
  // const from = signerProvider.address
  // const nonce = await signerProvider.getTransactionCount(from)
  // const methodAbi = getMethodAbi, method, contract.abi)
  // const data = EthAbi.encodeMethod(methodAbi, args)
  // const payload = { to: contract.address, from, gasPrice, nonce, data }
  // const txHash = yield call(ethjs.sendTransaction, payload)
}

module.exports = {
  handleApply,
}
