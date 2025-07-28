const CustomPrinter = require('./printer');
const dayjs = require('dayjs');

class NepaliSlipPrinter {
  constructor(options = {}) {
    this.printer = new CustomPrinter({
      defaultPrinter: options.printer,
      encoding: options.encoding || 'utf8',
    });

    this.orgName = options.orgName || 'Your Organization';
    this.pageWidth = options.pageWidth || 32;
  }

  // Function to calculate visual width of text (handles Unicode characters)
  getVisualLength(str) {
    let length = 0;
    for (const char of str) {
      // Devanagari characters (Nepali) take more visual space
      if (char.match(/[\u0900-\u097F]/)) {
        length += 2; // Nepali characters are roughly 2x wider
      } else {
        length += 1;
      }
    }
    return length;
  }

  formatLine(sn, title, qty) {
    const snStr = sn.toString().padEnd(3, ' ');
    const qtyStr = qty.toString().padStart(4, ' ');

    // Calculate max title length considering visual width
    const reservedSpace = 3 + 4 + 2; // SN + Qty + spaces between
    const maxTitleVisualLength = this.pageWidth - reservedSpace;

    let titleStr = title;
    let titleVisualLength = this.getVisualLength(title);

    // Truncate title if it's too long
    if (titleVisualLength > maxTitleVisualLength) {
      let truncated = '';
      let currentVisualLength = 0;

      for (const char of title) {
        const charVisualLength = char.match(/[\u0900-\u097F]/) ? 2 : 1;
        if (currentVisualLength + charVisualLength > maxTitleVisualLength - 1) {
          break;
        }
        truncated += char;
        currentVisualLength += charVisualLength;
      }
      titleStr = truncated + '…';
      titleVisualLength = this.getVisualLength(titleStr);
    }

    // Calculate spaces needed for proper alignment
    const spacesNeeded = Math.max(0, maxTitleVisualLength - titleVisualLength);
    const spaces = ' '.repeat(spacesNeeded);

    return `${snStr} ${titleStr}${spaces} ${qtyStr}`;
  }

  buildSlip(data, options = {}) {
    const orgName = options.orgName || this.orgName;
    const timestamp =
      options.timestamp || dayjs().format('YYYY-MM-DD HH:mm:ss');

    const header = orgName + '\n' + timestamp + '\n';
    const separator = '-'.repeat(this.pageWidth) + '\n';

    // Calculate proper spacing for Nepali headers
    const headerSN = 'SN';
    const headerTitle = '  शीर्षक';
    const headerQty = 'सं';

    // Calculate visual lengths
    const snLength = headerSN.length; // 2
    const titleLength = this.getVisualLength(headerTitle); // Account for Nepali chars
    const qtyLength = this.getVisualLength(headerQty); // Account for Nepali chars

    // Calculate spaces needed
    const usedSpace = snLength + titleLength + qtyLength;
    const spacesNeeded = Math.max(0, this.pageWidth - usedSpace);

    const columns =
      headerSN + headerTitle + ' '.repeat(spacesNeeded) + headerQty + '\n';

    const lines = data
      .map((row) => this.formatLine(row[0], row[1], row[2]))
      .join('\n');

    return header + separator + columns + lines + '\n' + separator;
  }

  async print(data, options = {}) {
    const content = this.buildSlip(data, options);

    return await this.printer.print(content, {
      printer: options.printer,
      method: options.method || 'auto',
      filename: options.filename,
    });
  }

  async getAvailablePrinters() {
    return await this.printer.getAvailablePrinters();
  }

  // Static method for quick use
  static async quickPrint(data, options = {}) {
    const printer = new NepaliSlipPrinter(options);
    return await printer.print(data, options);
  }
}

module.exports = {
  NepaliSlipPrinter,
  CustomPrinter,
};
