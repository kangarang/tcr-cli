const EthEvents = require('eth-events')
const sortBy = require('lodash/fp/sortBy')

async function getSortedLogs(
  eth,
  contract,
  blockRange = {},
  eventNames = [],
  blockRangeThreshold,
  indexedFilterValues = {}
) {
  try {
    const ethEvents = new EthEvents(eth, contract, blockRangeThreshold)
    // Start block is either specified, contract's birthdate, or 0
    const startBlock = blockRange.fromBlock || contract.blockNumber || 0
    const endBlock = blockRange.toBlock || 'latest'

    const logs = (await ethEvents.getLogs(
      startBlock,
      endBlock,
      // startBlock + 200000,
      eventNames,
      indexedFilterValues,
      true
    )).filter(l => l)
    try {
      if (logs.length) {
        return sortBy([log => log.txData.blockTimestamp], logs)
      }
      return logs
    } catch (error) {
      console.log('Error while sorting logs:', error)
    }
  } catch (error) {
    console.log('Error while gettings logs:', error)
  }
}

module.exports = {
  getSortedLogs,
}
