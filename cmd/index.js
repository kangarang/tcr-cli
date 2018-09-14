const { handleSync } = require('./sync')
const { handleList } = require('./list')
const { handleBalances, handleAccounts } = require('./accounts')
const { handleRead } = require('./read')
const { handleApply } = require('./apply')
const { handleTx } = require('./transaction')

module.exports = {
  handleSync,
  handleList,
  handleAccounts,
  handleRead,
  handleApply,
  handleBalances,
  handleTx,
}
