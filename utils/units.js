const BNJS = require('bn.js')

const BN = (small, base = 10) => new BNJS(small, base)

const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const integerPart = value.slice(0, -decimal)
  const fractionPart = value.slice(-decimal)
  return fractionPart ? `${integerPart}.${fractionPart.slice(0, 4)}` : `${integerPart}`
}

const fromTokenBase = (value, decimal) => baseToConvertedUnit(value.toString(), decimal)

module.exports = {
  BN,
  baseToConvertedUnit,
  fromTokenBase,
}
