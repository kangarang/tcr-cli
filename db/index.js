// prettier-ignore
function pushToDB(db, key, data) {
  console.log(`pushing to ${key} cache...`)
  // Pushes to an array, database[key]
  return db.get(key).push(data).write()
}

// Set db[key]
function setToDB(db, key, value) {
  console.log(`writing to ${key} cache...`)
  return db.set(key, value).write()
}
// Get db[key]
function getInDB(db, key) {
  return db.get(key).value()
}
// Get db.listings
function getListingsDB(db) {
  return db.get('listings').value()
}
// Set db['tcr-listings']
function setTcrListings(db, tcr, value) {
  console.log(`writing to ${tcr} cache...`)
  return db.set(`${tcr}-listings`, value).write()
}
// Get db[tcr'-listings']
function getListingsByTcr(db, tcr) {
  return db.get(`${tcr}-listings`).value()
}

function downloadCSV(args) {
  var data, filename, link
  var csv = convertArrayOfObjectsToCSV({
    data: stockData,
  })
  if (csv == null) return

  filename = args.filename || 'export.csv'

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv
  }
  data = encodeURI(csv)

  link = document.createElement('a')
  link.setAttribute('href', data)
  link.setAttribute('download', filename)
  link.click()
}

module.exports = {
  pushToDB,
  getListingsDB,
  setToDB,
  getInDB,
  getListingsByTcr,
  setTcrListings,
  downloadCSV,
}
