// Re-export main functionality for easier imports
module.exports = {
  NepaliSlipPrinter: require('../index').NepaliSlipPrinter,
  CustomPrinter: require('../index').CustomPrinter,
  createServer: require('./server'),
  startServer: require('./server').start,
};
