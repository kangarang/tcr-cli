const path = require('path')
const sortBy = require('lodash/fp/sortBy')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { printListings } = require('../lib/print')
const { getFromDB } = require('../db')
const adapter = new FileSync(path.resolve(__dirname, '../db/listings.json'))
const db = low(adapter)

async function handleList(argv) {
  const listings = getFromDB(db, argv.tcr)
  const arrayListings = Object.keys(listings || {}).map(liHash => listings[liHash])
  // prettier-ignore
  // filter by status
  const status = argv.applied ? 'applied' : argv.challenged ? 'challenged' : argv.whitelisted ? 'whitelisted' : argv.removed ? 'removed' : argv.all ? 'all' : 'whitelisted'
  const filtered = arrayListings.filter(lis => status === 'all' || lis.status === status)
  const sorted = sortBy([listing => listing.latestBlockTxn.blockTimestamp], filtered)

  if (argv.info) {
    printListInfo(status, arrayListings, argv)
  } else {
    printListings(status, sorted, argv)
  }
}

module.exports = {
  handleList,
}
