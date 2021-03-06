const utils = require('ethers/utils')
const { randomBytes } = require('crypto')

function randomSalt() {
  const buf = randomBytes(32)
  const salt = utils.bigNumberify(`0x${buf.toString('hex')}`)
  return salt.toString()
}

// prettier-ignore
const getVoteSaltHash = (vote, salt) => utils.solidityKeccak256(['uint', 'uint'], [vote, salt])
const getListingHash = listing => utils.solidityKeccak256(['string'], [listing])

module.exports = {
  randomSalt,
  getVoteSaltHash,
  getListingHash,
}
