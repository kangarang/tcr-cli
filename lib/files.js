const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

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
        console.log('write success')
      })
    } catch (err) {
      console.log('write error')
      // Ignore write errors.
    }
  },

  directoryExists: filePath => {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (err) {
      return false
    }
  },
}

// var stockData = [
//   {
//       Symbol: "AAPL",
//       Company: "Apple Inc.",
//       Price: "132.54"
//   },
//   {
//       Symbol: "INTC",
//       Company: "Intel Corporation",
//       Price: "33.45"
//   },
//   {
//       Symbol: "GOOG",
//       Company: "Google Inc",
//       Price: "554.52"
//   },
// ];

// function convertArrayOfObjectsToCSV(args) {
//   var result, ctr, keys, columnDelimiter, lineDelimiter, data;

//   data = args.data || null;
//   if (data == null || !data.length) {
//       return null;
//   }

//   columnDelimiter = args.columnDelimiter || ',';
//   lineDelimiter = args.lineDelimiter || '\n';

//   keys = Object.keys(data[0]);

//   result = '';
//   result += keys.join(columnDelimiter);
//   result += lineDelimiter;

//   data.forEach(function(item) {
//       ctr = 0;
//       keys.forEach(function(key) {
//           if (ctr > 0) result += columnDelimiter;

//           result += item[key];
//           ctr++;
//       });
//       result += lineDelimiter;
//   });

//   return result;
// }

// function downloadCSV(args) {
//   var data, filename, link;

//   var csv = convertArrayOfObjectsToCSV({
//       data: stockData
//   });
//   if (csv == null) return;

//   filename = args.filename || 'export.csv';

//   if (!csv.match(/^data:text\/csv/i)) {
//       csv = 'data:text/csv;charset=utf-8,' + csv;
//   }
//   data = encodeURI(csv);

//   link = document.createElement('a');
//   link.setAttribute('href', data);
//   link.setAttribute('download', filename);
//   link.click();
// }
