const utils = require('ethers/utils')
const boxen = require('boxen')

const { fromTokenBase, BN } = require('./units')
const { tsToMonthDate } = require('./datetime')

function diffBalances(logs) {
  let addressBalances = {}

  logs.forEach(({ logData }) => {
    if (
      addressBalances.hasOwnProperty(logData._to) &&
      addressBalances.hasOwnProperty(logData._from)
    ) {
      addressBalances[logData._to] = BN(addressBalances[logData._to])
        .add(logData._value)
        .toString()
      addressBalances[logData._from] = BN(addressBalances[logData._from])
        .sub(logData._value)
        .toString()
    } else if (
      !addressBalances.hasOwnProperty(logData._to) &&
      addressBalances.hasOwnProperty(logData._from)
    ) {
      addressBalances[logData._to] = logData._value.toString()
      addressBalances[logData._from] = BN(addressBalances[logData._from])
        .sub(logData._value)
        .toString()
    } else {
      addressBalances[logData._to] = logData._value.toString()
      addressBalances[logData._from] = logData._value.toString()
    }
  })

  for (let address in addressBalances) {
    addressBalances[address] =
      addressBalances[address] === '0'
        ? '0'
        : fromTokenBase(addressBalances[address], '9')
  }

  return addressBalances
}

function printCommitVote(logData, txData) {
  console.log('pollID:', logData.pollID.toString())
  console.log('numTokens:', logData.numTokens.toString())
  console.log('voter:', logData.voter)
  console.log('blockNumber:', txData.blockNumber)
  console.log('blockTimestamp:', txData.blockTimestamp)
  console.log('')
}

function printTransfers(logs) {
  logs.forEach(({ logData, txData }) => {
    console.log('from:', logData._from)
    console.log('to:', logData._to)
    console.log('value:', logData._value)
    console.log('txHash:', txData.txHash)
    console.log('blockNumber:', txData.blockNumber)
    console.log('blockTimestamp:', txData.blockTimestamp)
    console.log('')
  })
  console.log('logs.length:', logs.length)
}

function printListings(status, listings, argv) {
  if (!listings.length) {
    console.log('none')
    return
  }

  console.log('')
  listings.map((listing, index) => {
    const {
      status,
      whitelistBlockTimestamp,
      removedBlockTimestamp,
      appEndDate,
      revealEndDate,
      votesTotal,
      votesFor,
      votesAgainst,
    } = listing

    let message
    let subMessage
    switch (status) {
      case 'applied':
        message = 'Applied on:'
        subMessage = tsToMonthDate(appEndDate)
        break
      case 'challenged':
        message = 'Reveal vote ending on:'
        subMessage = tsToMonthDate(revealEndDate)
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
    subMessage = votesFor
      ? `${subMessage} votesFor: ${fromTokenBase(
          votesFor,
          '9'
        )}, votesAgainst: ${fromTokenBase(
          votesAgainst,
          '9'
        )}, votesTotal: ${fromTokenBase(votesTotal, '9')}`
      : subMessage
    console.log(
      `${index + 1}. ${message} ${subMessage} ${listing.listingID} ${listing.data}`
    )
  })

  const lines = String('-').repeat(status.length)
  console.log('')
  console.log(lines)
  console.log(`${status}`)
  console.log(lines)
  console.log('')
}

function printAccount(wallet) {
  console.log('')
  console.log('Current address:', wallet.address)
  console.log('')
}

function printTxStart(methodSignature, args, contractName, contract, network) {
  const TX_DETAILS = `

  Transaction Summary
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

function printTxSuccess(receipt) {
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
  diffBalances,
  printAccount,
  printBalances,
  printTransfers,
  printCommitVote,
  printListings,
  printTxStart,
  printTxSuccess,
}
