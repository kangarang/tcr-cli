const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { handleBalances } = require('./accounts')
const { toTokenBase } = require('../lib/units')
const { getVoteSaltHash, randomSalt } = require('../lib/values')
const { printTxStart, printTxMining, printError, printTxSuccess } = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')
const { getFromDB, setToDB } = require('../db')
const adapter = new FileSync(path.resolve(__dirname, '../db/listings.json'))
const db = low(adapter)
const votAdapter = new FileSync(path.resolve(__dirname, '../db/votes.json'))
const votDb = low(votAdapter)
votDb.defaults({
  adChain: {},
  ethaireum: {},
  cpl: {},
}).write()

// Apply for listing in the registry
async function handleCommitVote(argv) {
  const { listingID, verbose, numTokens, tcr, voteOption } = argv
  const listings = getFromDB(db, tcr)
  const listingsArray = Object.keys(listings).map(
    listingHash => listings[listingHash]
  )

  const pollID = (listingsArray.filter(li => li.listingID === listingID)[0].pollID)
  // Print account / network info
  if (verbose) {
    await handleBalances(argv)
  }

  // Wallet / network provider / contracts
  const {
    voting,
    token,
    signerProvider,
    network,
  } = await getAllContracts(argv)

  const decimals = await token.functions.decimals()
  const convertedNumTokens = toTokenBase(numTokens, decimals)
  const salt = randomSalt()
  const secretHash = getVoteSaltHash(voteOption, salt.toString(10))
  const prevPollID = await voting.functions.getInsertPointForNumTokens(signerProvider.address, convertedNumTokens, pollID)
  const args = [pollID, secretHash, convertedNumTokens, prevPollID]
  setToDB(votDb, `${tcr}.${pollID}`, { pollID, numTokens, salt: salt.toString(10), voteOption })
  const methodSignature = voting.interface.functions.commitVote.signature
  // Print tx details
  printTxStart(methodSignature, args, 'PLCRVoting', voting, network)

  // Revert if mainnet
  if (network === 'mainnet') {
    console.log('mainnet')
    return
  }
  // Send tx
  const tx = await voting.functions.commitVote(...args)

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
  handleCommitVote,
}
