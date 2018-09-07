// prettier-ignore
function pushToDB(db, key, data) {
  console.log(`pushing to ${key} cache...`)
  // Pushes to an array, database[key]
  return db.get(key).push(JSON.stringify(data)).write()
  // { key: [otherData, data] }
}

function setToDB(db, key, value) {
  console.log(`writing to ${key} cache...`)
  // Set the value of database[key]
  return db.set(key, JSON.stringify(value)).write()
  // { key: value, otherKey: 'otherValue' }
}

function getInDB(db, key) {
  // Get the value of database.listings
  return db.get(key).value()
}
function getListingsDB(db) {
  // Get the value of database.listings
  return db.get('listings').value()
}

module.exports = {
  pushToDB,
  getListingsDB,
  setToDB,
  getInDB,
}
