const { NepaliSlipPrinter } = require('../index');

async function basicExample() {
  console.log('🖨️  Basic Nepali Slip Printer Example');

  // Create printer instance
  const printer = new NepaliSlipPrinter({
    orgName: 'पसल Example Store',
    pageWidth: 32,
  });

  // Sample data
  const data = [
    [1, 'चामल', 5],
    [2, 'दाल', 10],
    [3, 'तेल', 3],
    [4, 'चिनी', 15],
    [5, 'नुन', 2],
    [6, 'आटा', 25],
    [7, 'दूध', 8],
  ];

  try {
    console.log('Printing receipt...');

    // Print using mock method (console output)
    const result = await printer.print(data, {
      method: 'mock',
    });

    console.log(`✅ Print completed: ${result.jobId}`);
    console.log(`Message: ${result.message}`);
  } catch (error) {
    console.error('❌ Print failed:', error.message);
  }
}

// Run the example
if (require.main === module) {
  basicExample();
}

module.exports = basicExample;
