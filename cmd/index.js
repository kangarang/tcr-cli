const { handleSync } = require('./sync')
const { handleList } = require('./list')
const { handleBalances, handleAccounts } = require('./accounts')
const { handleRead } = require('./read')
const { handleApprove } = require('./approve')
const { handleApply } = require('./apply')
const { handleCommitVote } = require('./commitVote')
const { handleRevealVote } = require('./revealVote')
const { handleClaimReward } = require('./claimReward')
const { handleRescueTokens } = require('./rescueTokens')
const { handleUpdateStatus } = require('./updateStatus')
const { handleChallenge } = require('./challenge')
const { handleTx } = require('./transaction')

module.exports = {
  handleSync,
  handleList,
  handleAccounts,
  handleRead,
  handleApprove,
  handleApply,
  handleCommitVote,
  handleRevealVote,
  handleRescueTokens,
  handleClaimReward,
  handleUpdateStatus,
  handleChallenge,
  handleBalances,
  handleTx,
}
