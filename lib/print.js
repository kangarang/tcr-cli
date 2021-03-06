const utils = require('ethers/utils')
const boxen = require('boxen')
const { Signale } = require('signale')
const sigOptions = {
  interactive: true,
  stream: process.stdout,
}

const signale = new Signale(sigOptions)
signale.config({
  displayTimestamp: true,
  displayFilename: false,
})

const { fromTokenBase, BN } = require('./units')
const { tsToMonthDate } = require('./datetime')

function printListings(status, listings, argv) {
  if (!listings.length) {
    const lines = String('-').repeat(status.length + 3)
    console.log('')
    console.log(lines)
    console.log(`${status}: 0`)
    console.log(lines)
    console.log('')
    return
  }

  listings.map((listing, index) => {
    const {
      status,
      whitelistBlockTimestamp,
      removedBlockTimestamp,
      appEndDate,
      commitEndDate,
      revealEndDate,
      votesCommitted,
      votesTotal,
      votesFor,
      votesAgainst,
      userVoteNumTokens,
    } = listing

    let message
    let subMessage
    switch (status) {
      case 'applied':
        message = 'Applied on:'
        subMessage = tsToMonthDate(appEndDate)
        break
      case 'challenged':
        message = `Commit period end: ${tsToMonthDate(commitEndDate)} |`
        subMessage = `Reveal period end: ${tsToMonthDate(revealEndDate)}`
        break
      case 'whitelisted':
        message = 'Whitelisted on:'
        subMessage = tsToMonthDate(whitelistBlockTimestamp)
        break
      case 'removed':
        message = 'Rejected on:'
        subMessage = tsToMonthDate(removedBlockTimestamp)
        break
      default:
    }
    const decimals = argv.tcr === 'adChain' ? BN('9') : BN('18')
    const msgLines = String('-').repeat(message.length + subMessage.length + 1)
    // prettier-ignore
    const listingInfo = votesFor && votesAgainst
    // const listingInfo = votesFor && votesAgainst && (votesFor !== '0' || votesAgainst !== '0') && argv.tcr === 'adChain'
      ? `
      ${index + 1}: ${listing.listingID === 'LISTING_ID_ERROR' ? listing.data : listing.listingID}
      ${message} ${subMessage}
      ${msgLines}
      Committed total: ${fromTokenBase(votesCommitted, decimals)}
      Votes for: ${fromTokenBase(votesFor, decimals)}
      Votes against: ${fromTokenBase(votesAgainst, decimals)}
      Revealed total: ${fromTokenBase(votesTotal, decimals)}
      User votes: ${fromTokenBase(userVoteNumTokens, decimals)}
      `
      : `
      ${index + 1}: ${listing.listingID === 'LISTING_ID_ERROR' ? listing.data : listing.listingID}
      ${message} ${subMessage}
      `
    console.log(listingInfo)
  })

  const lines = String('-').repeat(status.length)
  console.log('')
  console.log(lines)
  console.log(`${status}`)
  console.log(lines)
  console.log('')
}

function printTxStart(methodSignature, args, contractName, contract, network) {
  signale.start('[%d/3] - Sending transaction', 1)

  const TX_DETAILS = `
  Pending Transaction
  -------------------

  From:       ${contract.signer.address}
  To:         ${contract.address}
  Network:    ${network}
  Contract:   ${contractName}
  Function:   ${methodSignature}
  Arguments:  [ ${args.join(', ')} ]

  `
  console.log(TX_DETAILS)
}

function printTxMining(tx) {
  signale.await('[%d/3] - Waiting for mining', 2)
}

function printError(receipt) {
  // Error during send tx
  signale.error('[%d/3] - Error while processing transaction', 3)
  console.log('')
}

function printTxSuccess(receipt) {
  signale.success('[%d/3] - Successful transaction!', 3)
  const TX_BOX = `
  Tx hash: ${receipt.transactionHash}
  Block number: ${receipt.blockNumber}
  Gas used: ${receipt.gasUsed.toString()}
  Cumulative gas used: ${receipt.cumulativeGasUsed.toString()}
  `
  console.log(
    boxen(TX_BOX, { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'cyan' })
  )
}

function printBalances(wallet, balances, registryAddress, argv) {
  const ETH = `${balances.ethBalance} ${utils.etherSymbol}TH`
  const TOKEN = `${balances.tokenBalance} ${balances.tokenSymbol}`
  const BOX = `
  Account:      ${wallet.address}
  Network:      ${argv.n}
  Balances:     ${ETH}
                ${TOKEN}

  Token:                ${balances.tokenName} (${balances.tokenSymbol})
  Registry name:        ${balances.registryName}
  Registry allowance:   ${balances.regAllowance}
  Voting allowance:     ${balances.votAllowance}
  Voting rights:        ${balances.votingRights}
  Locked tokens:        ${balances.lockedTokens}


        Total ${balances.tokenSymbol} staked: ${balances.totalStake}
  `
  console.log(
    boxen(BOX, { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'cyan' })
  )
}

module.exports = {
  printBalances,
  printListings,
  printTxStart,
  printTxSuccess,
  printTxMining,
  printError,
}
