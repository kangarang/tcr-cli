function setListings(db, tcr, value) {
  console.log(`writing to ${tcr} cache...`)
  return db.set(tcr, value).write()
}

function getListings(db, tcr) {
  return db.get(tcr).value()
}

module.exports = {
  getListings,
  setListings,
}
