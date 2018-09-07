const IPFS = require('ipfs-mini')

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

function ipfsCheckMultihash(multihash) {
  if (
    typeof multihash === 'string' &&
    multihash.startsWith('Qm') &&
    multihash.length === 46
  ) {
    return true
  }
  return false
}

// TODO: typescript string
async function ipfsGetData(multihash) {
  if (ipfsCheckMultihash(multihash)) {
    return new Promise((resolve, reject) => {
      ipfs.catJSON(multihash, (err, result) => {
        if (err) reject(new Error(err))
        resolve(result)
      })
    })
  }
}

module.exports = {
  ipfsGetData,
  ipfsCheckMultihash,
}
