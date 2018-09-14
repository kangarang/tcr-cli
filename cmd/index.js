const { handleSync } = require('./sync')
const { handleList } = require('./list')
const { handleBalances, handleAccounts } = require('./accounts')
const { handleRead } = require('./read')
const { handleApply } = require('./apply')
const { handleUpdateStatus } = require('./updateStatus')
const { handleChallenge } = require('./challenge')
const { handleTx } = require('./transaction')

module.exports = {
  handleSync,
  handleList,
  handleAccounts,
  handleRead,
  handleApply,
  handleUpdateStatus,
  handleChallenge,
  handleBalances,
  handleTx,
}
