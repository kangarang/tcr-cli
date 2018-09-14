const utils = require('ethers/utils')
const { printBalances } = require('../lib/print')
const { getAllContracts } = require('../lib/contracts')

async function handleAccounts(argv) {
  // const wallet = getMnemonicWallet(argv.pathIndex)
  // printAccount(wallet)
  handleBalances(argv)
}

async function handleBalances(argv) {
  const { token, registry, voting, signerProvider } = await getAllContracts(argv)
  const account = token.signer.address
  const registryName = await registry.functions.name()
  const tokenName = await token.functions.name()
  const tokenSymbol = await token.functions.symbol()
  const tokenDecimals = await token.functions.decimals()

  const [
    ethBalanceRaw,
    tokenBalanceRaw,
    registryAllowanceRaw,
    votingAllowanceRaw,
    votingRightsRaw,
    lockedTokensRaw,
  ] = await Promise.all([
    signerProvider.getBalance(),
    token.functions.balanceOf(account),
    token.functions.allowance(account, registry.address),
    token.functions.allowance(account, voting.address),
    voting.functions.voteTokenBalance(account),
    voting.functions.getLockedTokens(account),
  ])
  // prettier-ignore
  const regAllowance = utils.formatUnits(registryAllowanceRaw, tokenDecimals, {
    commify: true,
  })
  const votAllowance = utils.formatUnits(votingAllowanceRaw, tokenDecimals, {
    commify: true,
  })
  const votingRights = utils.formatUnits(votingRightsRaw, tokenDecimals, {
    commify: true,
  })
  const lockedTokens = utils.formatUnits(lockedTokensRaw, tokenDecimals, {
    commify: true,
  })
  const totalRegistryStakeRaw = await token.functions.balanceOf(registry.address)
  const totalVotingStakeRaw = await token.functions.balanceOf(voting.address)
  const ethBalance = utils.formatEther(ethBalanceRaw, { commify: true })
  const tokenBalance = utils.formatUnits(tokenBalanceRaw, tokenDecimals, {
    commify: true,
  })
  const totalStake = utils.formatUnits(
    totalRegistryStakeRaw.add(totalVotingStakeRaw),
    tokenDecimals,
    {
      commify: true,
    }
  )
  const balanceDetails = {
    ethBalance,
    regAllowance,
    votAllowance,
    votingRights,
    lockedTokens,
    totalStake,
    tokenBalance,
    tokenSymbol,
    tokenDecimals,
    registryName,
    tokenName,
  }

  printBalances(signerProvider, balanceDetails, registry.address, argv)
  return balanceDetails
}

module.exports = {
  handleAccounts,
  handleBalances,
}
