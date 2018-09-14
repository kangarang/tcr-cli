const { format } = require('date-fns')

const tsToMonthDate = uts => format(new Date(uts * 1000), 'MMMM Do, h:mm a')

function timestampToExpiry(uts) {
  const date = new Date(uts * 1000)

  return {
    date,
    timestamp: uts,
    formattedLocal: format(date, 'MMM Do, YYYY hh:mm a'),
  }
}

module.exports = {
  timestampToExpiry,
  tsToMonthDate,
}
