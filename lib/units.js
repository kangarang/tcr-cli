const utils = require('ethers/utils')

const BN = small => utils.bigNumberify(small)

const stripHexPrefix = value => value.replace('0x', '')

const handleValues = input => {
  if (typeof input === 'string') {
    return input.startsWith('0x') ? BN(stripHexPrefix(input), 16) : BN(input)
  }
  if (typeof input === 'number') {
    return BN(input)
  }
  if (isBigNumber(input)) {
    return input
  } else {
    throw Error('Unsupported value conversion')
  }
}

const TokenValue = input => handleValues(input)

const convertedToBaseUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const [integerPart, fractionPart = ''] = value.split('.')
  const paddedFraction = fractionPart.padEnd(decimal, '0')
  return `${integerPart}${paddedFraction}`
}

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

const toTokenBase = (value, decimal) =>
  TokenValue(convertedToBaseUnit(value.toString(), decimal))

module.exports = {
  BN,
  isBigNumber,
  fromTokenBase,
  toTokenBase,
}
