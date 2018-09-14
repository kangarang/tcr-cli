const boxen = require('boxen')

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
    .command('list', 'Print listings', {}, handlers.handleList)
    .command('sync', 'Sync listings with new logs', {}, handlers.handleSync)
    .command('apply [listingID] [data]', 'Apply for listing in the registry', {}, handlers.handleApply)
    .command('challenge [listingID] [data]', 'Challenge a listing', {}, handlers.handleChallenge)
    .command('updateStatus [listingID]', 'Update status for a listing', {}, handlers.handleUpdateStatus)
    .command('tx [txHash]', 'Print transaction details', {}, handlers.handleTx)
    .command('read', 'Read event logs and listings', {}, handlers.handleRead)
    .option('info', {
      group: 'Chain:',
      type: 'string',
      alias: 'info',
      default: false,
      describe: 'View TCR info',
    })
    .option('n', {
      group: 'Chain:',
      type: ['string', 'number'],
      alias: 'network',
      default: 'mainnet',
      describe: 'Specify a network',
    })
    .option('t', {
      group: 'Chain:',
      type: 'string',
      alias: 'tcr',
      default: 'adChain',
      describe: 'Specify a token-curated registry',
    })
    .option('i', {
      group: 'Chain:',
      type: 'string',
      alias: 'pathIndex',
      default: '0',
      describe: 'Specify a mnemonic path index for $MNEMONIC',
    })
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
      default: true,
      describe: 'Save logs to local store',
    })
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
