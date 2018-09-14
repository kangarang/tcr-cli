const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { getListings } = require('../db')
const { readFile } = require('../lib/files')

const adapter = new FileSync(path.resolve(__dirname, '../db/listings.json'))
const db = low(adapter)

async function handleRead(argv) {
  const { tcr, network } = argv
  //  Get local listings DB
  let localListingsHashMap = getListings(db, tcr)
  // Convert to array
  const localListingsArray = Object.keys(localListingsHashMap).map(
    liHash => localListingsHashMap[liHash]
  )

  console.log('network:', network)
  console.log('tcr:', tcr)
  console.log('Listings:', localListingsArray.length)

  const regLogs = readFile(`./db/logs/${tcr}/registryLogs.json`)
  const votLogs = readFile(`./db/logs/${tcr}/votLogs.json`)
  const appLogs = readFile(`./db/logs/${tcr}/appLogs.json`)
  const nonAppLogs = readFile(`./db/logs/${tcr}/nonAppLogs.json`)
  console.log('registry logs:', regLogs.length)
  console.log('voting logs:', votLogs.length)
  console.log('applications:', appLogs.length)
  console.log('non-applications:', nonAppLogs.length)
}

module.exports = {
  handleRead,
}
