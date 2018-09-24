const fs = require('fs')
const path = require('path')

module.exports = {
  readFile: filePath => {
    try {
      const serializedData = fs.readFileSync(filePath)
      if (serializedData === null) {
        return undefined
      }
      return JSON.parse(serializedData)
    } catch (err) {
      return undefined
    }
  },

  writeFile: (filePath, data) => {
    try {
      const serializedData = JSON.stringify(data)
      fs.writeFile(filePath, serializedData, err => {
        if (err) throw err
        console.log(`write to ${filePath} success`)
      })
    } catch (err) {
      console.log('write error')
      // Ignore write errors.
    }
  },
}
