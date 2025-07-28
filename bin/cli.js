#!/usr/bin/env node

const { program } = require('commander');
const { NepaliSlipPrinter } = require('../index');
const path = require('path');
const fs = require('fs');

program
  .name('nepali-slip-server')
  .description(
    'CLI for Nepali Slip Printer - supports Unicode Nepali text printing'
  )
  .version('1.0.0');

program
  .command('start')
  .description('Start the slip printer server')
  .option('-p, --port <number>', 'Port to run server on', '3000')
  .option('-o, --org <name>', 'Organization name')
  .option('-w, --width <number>', 'Page width', '32')
  .option('--printer <name>', 'Default printer name')
  .action((options) => {
    // Set environment variables from CLI options
    if (options.port) process.env.PORT = options.port;
    if (options.org) process.env.ORG_NAME = options.org;
    if (options.width) process.env.PAGE_WIDTH = options.width;
    if (options.printer) process.env.PRINTER_NAME = options.printer;

    console.log('Starting Nepali Slip Printer Server...');
    console.log(`Port: ${options.port}`);
    console.log(`Organization: ${options.org || 'Your Organization'}`);
    console.log(`Page Width: ${options.width}`);
    if (options.printer) console.log(`Default Printer: ${options.printer}`);

    // Start the server
    require('../server');
  });

program
  .command('print')
  .description('Print a slip directly from CLI')
  .requiredOption(
    '-d, --data <json>',
    'JSON data to print (e.g., \'[[1,"चामल",5],[2,"दाल",10]]\')'
  )
  .option('--printer <name>', 'Printer name')
  .option(
    '--method <method>',
    'Print method (auto, windows, cups, file, mock)',
    'auto'
  )
  .option('-o, --org <name>', 'Organization name', 'Your Organization')
  .option('-w, --width <number>', 'Page width', '32')
  .action(async (options) => {
    try {
      const data = JSON.parse(options.data);

      const printer = new NepaliSlipPrinter({
        orgName: options.org,
        pageWidth: parseInt(options.width),
        printer: options.printer,
      });

      console.log('Printing slip...');
      const result = await printer.print(data, {
        method: options.method,
        printer: options.printer,
      });

      console.log(`✅ Print job completed: ${result.jobId}`);
      if (result.message) console.log(`Message: ${result.message}`);
    } catch (error) {
      console.error('❌ Print failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('printers')
  .description('List available printers')
  .action(async () => {
    try {
      const printer = new NepaliSlipPrinter();
      const printers = await printer.getAvailablePrinters();

      console.log('Available Printers:');
      if (printers.length === 0) {
        console.log('  No printers found');
      } else {
        printers.forEach((printer, index) => {
          console.log(`  ${index + 1}. ${printer}`);
        });
      }
    } catch (error) {
      console.error('❌ Failed to get printers:', error.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new project with .env file')
  .action(() => {
    const envPath = path.join(process.cwd(), '.env');
    const examplePath = path.join(__dirname, '..', '.env.example');

    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env file already exists');
      return;
    }

    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log('✅ Created .env file from template');
      console.log('📝 Please edit .env file with your settings');
    } else {
      // Create basic .env if example doesn't exist
      const basicEnv = `# Server Configuration
PORT=3000

# Organization Settings
ORG_NAME=Your Organization

# Printer Settings
PRINTER_NAME=
PAGE_WIDTH=32

# Print Method: 'auto', 'windows', 'cups', 'file', 'mock'
PRINT_METHOD=auto
`;
      fs.writeFileSync(envPath, basicEnv);
      console.log('✅ Created basic .env file');
      console.log('📝 Please edit .env file with your settings');
    }
  });

program.parse();
