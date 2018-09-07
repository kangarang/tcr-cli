const path = require('path')
const sortBy = require('lodash/fp/sortBy')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { printListings } = require('../utils/print')
const { getListingsDB } = require('../db')

const adapter = new FileSync(path.resolve(__dirname, '../db/store.json'))
const db = low(adapter)

async function handleList(argv) {
  // prettier-ignore
  const status = argv.a ? 'applied' : argv.c ? 'challenged' : argv.w ? 'whitelisted' : argv.r ? 'removed' : 'all'
  const listings = getListingsDB(db)
  const arrayListings = Object.keys(listings).map(liHash => listings[liHash])
  // filter by status
  const filtered = arrayListings.filter(lis => status === 'all' || lis.status === status)

  console.log('')
  console.log(`${status}`)
  const lines = String('-').repeat(status.length)
  console.log(lines)
  const sorted = sortBy([listing => listing.latestBlockTxn.blockTimestamp], filtered)
  printListings(sorted)
}

module.exports = {
  handleList,
}
