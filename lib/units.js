const utils = require('ethers/utils')

const BN = small => utils.bigNumberify(small)

const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const integerPart = value.slice(0, -decimal)
  const fractionPart = value.slice(-decimal)
  return fractionPart ? `${integerPart}.${fractionPart.slice(0, 4)}` : `${integerPart}`
}

const fromTokenBase = (value, decimal) => baseToConvertedUnit(value.toString(), decimal)

function isBigNumber(value) {
  return value._bn && value._bn.mod
}

module.exports = {
  BN,
  isBigNumber,
  fromTokenBase,
}
