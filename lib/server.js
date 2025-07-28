const express = require('express');
const { NepaliSlipPrinter } = require('../index');

function createServer(options = {}) {
  const app = express();

  // Initialize printer with options
  const printer = new NepaliSlipPrinter({
    orgName: options.orgName || process.env.ORG_NAME || 'Your Organization',
    pageWidth: options.pageWidth || parseInt(process.env.PAGE_WIDTH) || 32,
    printer: options.printer || process.env.PRINTER_NAME,
  });

  app.use(express.json());

  // Get available printers endpoint
  app.get('/printers', async (req, res) => {
    try {
      const printers = await printer.getAvailablePrinters();
      res.status(200).json({
        success: true,
        printers: printers,
        count: printers.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Print endpoint
  app.post('/print', async (req, res) => {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Data is required and must be a non-empty array',
      });
    }

    try {
      const result = await printer.print(data, {
        printer: req.body.printer || process.env.PRINTER_NAME,
        method: req.body.method || process.env.PRINT_METHOD || 'auto',
      });

      console.log(`Print job completed: ${result.jobId}`);
      res.status(200).json({
        success: true,
        jobId: result.jobId,
        message: result.message || 'Print job sent successfully',
      });
    } catch (error) {
      console.error('Print error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nepali-slip-printer',
    });
  });

  return app;
}

function start(options = {}) {
  const port = options.port || process.env.PORT || 3000;
  const app = createServer(options);

  app.listen(port, () => {
    console.log(
      `🖨️  Nepali Slip Printer Server running at http://localhost:${port}`
    );
    console.log(
      `📝 Organization: ${
        options.orgName || process.env.ORG_NAME || 'Your Organization'
      }`
    );
    console.log(
      `📏 Page Width: ${options.pageWidth || process.env.PAGE_WIDTH || 32}`
    );
    if (options.printer || process.env.PRINTER_NAME) {
      console.log(
        `🖨️  Default Printer: ${options.printer || process.env.PRINTER_NAME}`
      );
    }
  });

  return app;
}

module.exports = {
  createServer,
  start,
};
