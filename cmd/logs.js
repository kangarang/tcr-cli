const EthEvents = require('eth-events')
const sortBy = require('lodash/fp/sortBy')

async function getSortedLogs(
  contract,
  blockRange = {},
  eventNames = [],
  blockRangeThreshold = 50000,
  indexedFilterValues = {}
) {
  try {
    const ethEvents = new EthEvents(contract, blockRangeThreshold)
    // Start block is either specified, contract's birthdate, or 0
    const startBlock = blockRange.fromBlock || contract.blockNumber || 0
    const endBlock = blockRange.toBlock || 'latest'

    const logs = (await ethEvents.getLogs(
      startBlock,
      // startBlock + 80000,
      endBlock,
      eventNames,
      indexedFilterValues
    )).filter(log => typeof log !== 'undefined')

    try {
      if (logs.length) {
        return sortBy(['txData.blockTimestamp'], logs)
      }
      return []
    } catch (error) {
      console.log('Error while sorting logs:', error)
      return []
    }
  } catch (error) {
    console.log('Error while gettings logs:', error)
    return []
  }
}

module.exports = {
  getSortedLogs,
}
