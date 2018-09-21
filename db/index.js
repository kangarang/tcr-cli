function setToDB(db, tcr, value) {
  console.log(`writing to ${tcr} cache...`)
  return db.set(tcr, value).write()
}

function getFromDB(db, tcr) {
  return db.get(tcr).value()
}

function pushToDB(db, key, value) {
  return db.get(key).push(value).write()
}

module.exports = {
  getFromDB,
  setToDB,
  pushToDB,
}
