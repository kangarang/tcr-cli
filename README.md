# tcr-cli

## Setup

Install

    npm install

Create a symlink for [cli.js](./cli.js) as executable `tcr`

    npm link

Show help menu / available commands

    tcr --help

#### `config`

Print configurations

    tcr config

Set tcr (Default: 'adChain')

    tcr config -t [tcr]

Set network (Default: 'mainnet')

    tcr config -n [network]

Set path index for `$MNEMONIC`-generated accounts (Default: '0')

    tcr config -i [pathIndex]

## Commands

- `accounts`: All things account-related
- `config`: Set/print config
- `list`: Print listings
- `sync`: Get logs, create/update listings, store data locally
- `approve <spender> <numTokens>`: Approve tokens for a contract (e.g. 'registry 420', 'voting 9001')
- `apply <listingID> [data]`: Apply a listing to the registry
- `challenge <listingID> [data]`: Challenge a listing, create a poll
- `commit <listingID> <voteOption: number> <numTokens: number>`: Commit a vote
- `reveal <listingID>`: Reveal a committed vote
- `update <listingID>`: Refesh a listing's status
- `rescue <listingID>`: Rescue tokens from a committed, non-revealed, expired poll
- `tx <txHash>`: Print transaction details
- `read`: Read event logs and listings

## Options

Chain

- `-n` or `--network`: Specify a network (e.g. mainnet, rinkeby)
- `-t` or `--tcr`: Specify a tcr (adChain, ethaireum, cpl)
- `-i` or `--pathIndex`: Specify a path index for $MNEMONIC environment variable

Sync

- `-u` or `--update`: Update local listings store with past logs
- `-R` or `--reset`: Reset local listings store with past logs
- `-s` or `--save`: Save logs to local store

Listings

- `-a` or `--applied`: Print listings in the application stage
- `-c` or `--challenged`: Print listings which were challenged and are in voting stage
- `-w` or `--whitelisted`: Print whitelisted listings in the registry
- `-A` or `--all`: Print all listings, regardless of status
- `-r` or `--removed`: Print listings which were removed
