// ========================
// Arg and handler mappings
// ========================

// prettier-ignore
module.exports = function(yargs, version, handlers) {
  return yargs.strict()
    .command('accounts', 'All things account-related', {
      providerEndPoint: {
        default: 'https://mainnet.infura.io'
      }
    }, handlers.handleAccounts)
    .command('sync', 'Sync event logs and listings to local storage', {}, handlers.handleSync)
    .command('read', 'Read event logs and listings to local storage', {}, handlers.handleRead)
    .command('list', 'Print listings', {}, handlers.handleList)
    .option('b', {
      group: 'Chain:',
      alias: 'blockRangeThreshold',
      type: 'number',
      default: 10000,
      describe: 'Specify a block range threshold',
    })
    .option('network', {
      group: 'Chain:',
      type: 'string',
      default: 'mainnet',
      describe: 'Choose a network',
    })
    .option('a', {
      group: 'Listings:',
      alias: 'applied',
      type: 'boolean',
      conflicts: ['c', 'w'],
      describe: 'Show listings in application stage',
    })
    .option('c', {
      group: 'Listings:',
      alias: 'challenged',
      type: 'boolean',
      conflicts: ['a', 'w'],
      describe: 'Show listings in voting stage',
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
    .option('reset', {
      group: 'Sync:',
      type: 'boolean',
      default: false,
      describe: 'Reset local listings store',
    })
    .option('resync', {
      group: 'Sync:',
      type: 'boolean',
      default: false,
      describe: 'Resync local listings store with past logs',
    })
    .option('tcr', {
      group: 'Chain:',
      type: 'string',
      default: 'adChain',
      describe: 'Select a token-curated registry',
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
    .showHelpOnFail(false, 'Specify -? or --help for available options')
    .wrap(Math.min(120, yargs.terminalWidth()))
    .version(version)
    .example('tcr sync', 'Get logs and sync TCR listings')
    .epilog('For more information visit https://github.com/kangarang/tcr-cli')
    .check(argv => {
      // if (argv.n.trim() == '') {
      //   throw new Error('Cannot leave network blank; please provide a hostname')
      // }
      return true
    })
}
