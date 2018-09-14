const path = require('path')
const fs = require('fs')
const ethers = require('ethers')
const sortBy = require('lodash/fp/sortBy')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const TCRListings = require('tcr-listings')

const { getContract } = require('../lib/contracts')
const { BN, isBigNumber } = require('../lib/units')
const { getSortedLogs } = require('./logs')
const { setListings, getListings } = require('../db')
const { writeFile } = require('../lib/files')

const adapter = new FileSync(path.resolve(__dirname, '../db/listings.json'))
const db = low(adapter)
db.defaults({
  'adChain': {},
  'ethaireum': {},
  'cpl': {},
}).write()

// Convert BN -> String for local storage
function sanitizeBigNumbersFromLogs(logs) {
  return logs.map(log => {
    for (let data in log.logData) {
      if (log.logData.hasOwnProperty(data) && isBigNumber(log.logData[data])) {
        log.logData[data] = log.logData[data].toString()
      }
    }
    return log
  })
}

async function handleSync(argv) {
  const { reset, update, tcr, save, verbose } = argv
  // Get local listings DB
  const localListings = reset ? {} : getListings(db, tcr)
  // Convert to array
  const localListingsArray = Object.keys(localListings).map(
    listingHash => localListings[listingHash]
  )

  let fromBlock
  // Use the highest listing blockNumber + 1 as fromBlock
  if (update || reset || localListingsArray.length === 0) {
    fromBlock = null
  } else {
    // prettier-ignore
    fromBlock = localListingsArray.reduce((acc, val) => {
      const ts = BN(val.latestBlockTxn.blockNumber)
      if (ts.gt(BN(acc))) return ts
      return BN(acc)
    }, BN('0')).add(BN('1')).toNumber()

    // const startBlock =
    //   localListingsArray[localListingsArray.length - 1].latestBlockTxn.blockNumber
    // console.log(' fromBlock, startBlock:', fromBlock, startBlock)
  }

  // Registry logs
  const Registry = await getContract(tcr, 'registry')
  if (verbose) {
    console.log('fromBlock', fromBlock)
    console.log('network:', Registry.network)
    console.log('tcr:', tcr)
  }
  const regLogs = await getSortedLogs(Registry, { fromBlock }, [
    '_Application',
    '_Challenge',
    '_ChallengeSucceeded',
    '_ChallengeFailed',
    '_ApplicationWhitelisted',
    '_ApplicationRemoved',
    '_ListingRemoved',
    '_RewardClaimed',
  ])

  if (verbose) {
    console.log('Last reg log:', regLogs[regLogs.length - 1].eventName)
  }

  // Application logs
  const applicationLogs = regLogs.filter(log => log && log.eventName === '_Application')
  // Non-application logs (e.g. _Challenge, _RewardClaimed)
  const nonAppRegLogs = regLogs.filter(log => log && log.eventName !== '_Application')

  if (save) {
    const stringRegLogs = sanitizeBigNumbersFromLogs(regLogs)
    const stringAppLogs = sanitizeBigNumbersFromLogs(applicationLogs)
    writeFile(`./db/logs/${tcr}/registryLogs.json`, stringRegLogs)
    writeFile(`./db/logs/${tcr}/appLogs.json`, stringAppLogs)
  }

  // Voting logs
  const Voting = await getContract(tcr, 'voting')
  const votLogs = await getSortedLogs(Voting, { fromBlock }, [
    '_PollCreated',
    '_VoteCommitted',
    '_VoteRevealed',
  ])
  // Concat non-application registry logs with voting logs
  const nonApplicationLogs = nonAppRegLogs.concat(votLogs)

  if (verbose) {
    console.log('Last vot log:', votLogs[votLogs.length - 1].eventName)
    console.log('Last non-app log:', nonApplicationLogs[nonApplicationLogs.length - 1].eventName)
  }

  if (save) {
    const stringVotLogs = sanitizeBigNumbersFromLogs(votLogs)
    const stringNonAppLogs = sanitizeBigNumbersFromLogs(nonApplicationLogs)
    writeFile(`./db/logs/${tcr}/votLogs.json`, stringVotLogs)
    writeFile(`./db/logs/${tcr}/nonAppLogs.json`, stringNonAppLogs)
  }

  // Create / update listings
  const tcrListings = new TCRListings(
    [Registry.address, Voting.address],
    '0x6C439E156C0571b9e9174C4AC440018515dea1F4'
  )
  const listingsMap = await tcrListings.getListings(
    applicationLogs,
    nonApplicationLogs,
    localListings
  )

  if (verbose) {
    console.log('Total listings size:', listingsMap.size)
  }

  // Write to cache
  // NOTE: THIS WILL OVERWRITE
  setListings(db, tcr, listingsMap.toJS())
}

module.exports = {
  handleSync,
}
