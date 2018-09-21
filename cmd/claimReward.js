const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { handleBalances } = require('./accounts')
const {
  printTxStart,
  printTxMining,
  printError,
  printTxSuccess,
} = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')

const { getFromDB } = require('../db')
const adapter = new FileSync(path.resolve(__dirname, '../db/listings.json'))
const db = low(adapter)

// Apply for listing in the registry
async function handleClaimReward(argv) {
  const { listingID, verbose, tcr } = argv
  const listings = getFromDB(db, tcr)
  const listingsArray = Object.keys(listings).map(listingHash => listings[listingHash])
  const pollID = listingsArray.find(li => li.listingID === listingID).pollID
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  // Wallet / network provider / contracts
  const { registry, signerProvider, network } = await getAllContracts(argv)
  const commit = getFromDB(db, `${tcr}.${pollID}`)
  const salt = commit.salt
  const args = [pollID, commit.voteOption, salt]

  const methodSignature = registry.interface.functions.claimReward.signature
  // Print tx details
  printTxStart(methodSignature, args, tcr, registry, network)

  // Revert if mainnet
  if (network === 'mainnet') {
    console.log('WARNING! mainnet!')
    return
  }
  // Send tx
  const tx = await registry.functions.claimReward(...args)

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
  handleClaimReward,
}
