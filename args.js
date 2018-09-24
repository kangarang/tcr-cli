const boxen = require('boxen')
const Configstore = require('configstore')

const pkg = require('./package.json');
const conf = new Configstore(pkg.name, {});

// =========================
// Argv and command mappings
// =========================

const WELCOME = `Welcome to TCR CLI

--help to view available commands`

// prettier-ignore
module.exports = function(yargs, version, handlers) {
  return yargs.strict()
    .command('*', 'Welcome', {}, () => console.log(boxen(WELCOME, { padding: 3, margin: 3, align: 'center', borderStyle: 'double', borderColor: 'cyan' })))
    .command('accounts', 'All things account-related', {}, handlers.handleAccounts)
    .command('config', 'Set config', {}, ({ tcr, network, pathIndex }) => {
      if (tcr) {
        conf.set('tcr', tcr)
      }
      if (network) {
        conf.set('network', network)
      }
      if (pathIndex) {
        conf.set('pathIndex', pathIndex)
      }
      const CONFIG_SETTINGS = `
      TCR: ${tcr}
      Network: ${network}
      Mnemonic path index: ${pathIndex}
      `
      console.log(CONFIG_SETTINGS)
    })
    .command('list', 'Print listings', {}, handlers.handleList)
    .command('sync', 'Get logs, create/update listings, store data locally', {}, handlers.handleSync)
    .command('approve <spender> <numTokens>', 'Approve tokens for a contract', {}, handlers.handleApprove)
    .command('apply <listingID> [data]', 'Apply for listing in the registry', {}, handlers.handleApply)
    .command('challenge <listingID> [data]', 'Challenge a listing', {}, handlers.handleChallenge)
    .command('commit <listingID> <voteOption> <numTokens>', 'Commit a vote to a poll', {}, handlers.handleCommitVote)
    .command('reveal <listingID>', 'Commit a vote to a poll', {}, handlers.handleRevealVote)
    .command('update <listingID>', 'Update status for a listing', {}, handlers.handleUpdateStatus)
    // .command('claim <listingID>', 'Claim reward for a listing', {}, handlers.handleClaimReward)
    .command('rescue <listingID>', 'Rescue tokens from a poll', {}, handlers.handleRescueTokens)
    .command('tx <txHash>', 'Print transaction details', {}, handlers.handleTx)
    .command('read', 'Read event logs and listings', {}, handlers.handleRead)
    // .option('info', {
    //   group: 'Chain:',
    //   type: 'string',
    //   alias: 'info',
    //   default: false,
    //   describe: 'View TCR info',
    // })
    // TODO: group
    .option('n', {
      group: 'Chain:',
      type: ['string', 'number'],
      alias: 'network',
      default: conf.get('network') || 'mainnet',
      describe: 'Specify a network',
    })
    .option('t', {
      group: 'Chain:',
      type: 'string',
      alias: 'tcr',
      default: conf.get('tcr') || 'adChain',
      describe: 'Specify a token-curated registry',
    })
    .option('i', {
      group: 'Chain:',
      type: 'string',
      alias: 'pathIndex',
      default: conf.get('pathIndex') || '0',
      describe: 'Specify a mnemonic path index for $MNEMONIC',
    })
    // TODO: group
    .option('u', {
      group: 'Sync:',
      alias: 'update',
      type: 'boolean',
      default: false,
      describe: 'Update local listings store with past logs',
    })
    .option('R', {
      group: 'Sync:',
      alias: 'reset',
      type: 'boolean',
      default: false,
      describe: 'Reset local listings store with past logs',
    })
    .option('s', {
      group: 'Sync:',
      type: 'boolean',
      alias: 'save',
      default: false,
      describe: 'Save logs to local store',
    })
    // TODO: group
    .option('a', {
      group: 'Listings:',
      alias: 'applied',
      type: 'boolean',
      conflicts: ['c', 'w'],
      describe: 'Show application listings',
    })
    .option('c', {
      group: 'Listings:',
      alias: 'challenged',
      type: 'boolean',
      conflicts: ['a', 'w'],
      describe: 'Show challenged listings',
    })
    .option('w', {
      group: 'Listings:',
      alias: 'whitelisted',
      type: 'boolean',
      conflicts: ['a', 'c'],
      describe: 'Show whitelisted listings',
    })
    .option('r', {
      group: 'Listings:',
      alias: 'removed',
      type: 'boolean',
      conflicts: ['a', 'c', 'w'],
      describe: 'Show removed listings',
    })
    .option('A', {
      group: 'Listings:',
      alias: 'all',
      type: 'boolean',
      conflicts: ['a', 'c', 'w'],
      describe: 'Show all listings',
    })
    .option('v', {
      group: 'Other:',
      alias: 'verbose',
      type: 'boolean',
      default: false,
      describe: 'Log all requests and responses to stdout',
    })
    .help('help')
    .alias('help', '?')
    .showHelpOnFail(true, 'Specify -? or --help for available options')
    .wrap(Math.min(120, yargs.terminalWidth()))
    .version(version)
    // .example('tcr sync --reset', 'Get past logs & reset the current local store listings')
    // .epilog('For more information visit https://github.com/kangarang/tcr-cli')
    .check(argv => {
      // if (argv.n.trim() == '') {
      //   throw new Error('Cannot leave network blank; please provide a hostname')
      // }
      return true
    })
}
