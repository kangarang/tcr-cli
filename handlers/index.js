const { handleSync } = require('./sync')
const { handleList } = require('./list')
const { handleAccounts } = require('./accounts')
const { handleRead } = require('./read')

module.exports = {
  handleSync,
  handleList,
  handleAccounts,
  handleRead,
}
