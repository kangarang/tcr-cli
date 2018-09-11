// prettier-ignore
function pushToDB(db, key, data) {
  console.log(`pushing to ${key} cache...`)
  // Pushes to an array, database[key]
  return db.get(key).push(data).write()
}

function setToDB(db, key, value) {
  console.log(`writing to ${key} cache...`)
  // Set the value of database[key]
  return db.set(key, value).write()
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
