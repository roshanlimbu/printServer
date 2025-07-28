# Slip Server

A Node.js server for printing receipt slips with support for Nepali Unicode text. This server provides a REST API to format and print receipts with proper handling of Devanagari characters.

## Features

- ✅ **Cross-platform printing** - Works on Windows, macOS, and Linux
- ✅ **Nepali Unicode support** - Proper rendering of Devanagari characters
- ✅ **Multiple print methods** - Auto-detection, CUPS, Windows PowerShell, file output, and mock mode
- ✅ **WiFi printer support** - Print to network-connected printers
- ✅ **Configurable formatting** - Adjustable page width and organization details
- ✅ **REST API** - Easy integration with any application

## Installation

```bash
# Clone or download the project
cd slipServer

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your settings
nano .env
```

## Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000

# Organization Settings
ORG_NAME=Your Store Name

# Printer Settings
PRINTER_NAME=YourPrinterName
PAGE_WIDTH=32

# Print Method: 'auto', 'windows', 'cups', 'file', 'mock'
PRINT_METHOD=auto
```

### Print Methods

- **`auto`** - Automatically detects platform (Windows uses PowerShell, macOS/Linux uses CUPS)
- **`windows`** - Uses Windows PowerShell printing commands
- **`cups`** - Uses CUPS printing system (macOS/Linux)
- **`file`** - Saves output to a file for testing
- **`mock`** - Prints to console for development

## Usage

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### API Endpoints

#### 1. Get Available Printers

```bash
GET /printers
```

**Response:**

```json
{
  "success": true,
  "printers": ["HP LaserJet", "Canon Printer"],
  "count": 2
}
```

#### 2. Print Receipt

```bash
POST /print
```

**Request Body:**

```json
{
  "data": [
    [1, "चामल", 5],
    [2, "दाल", 10],
    [3, "तेल", 3],
    [4, "चिनी", 15]
  ]
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_1234567890",
  "message": "Print job sent successfully"
}
```

### Example Usage

#### Basic Print Request

```bash
curl -X POST http://localhost:3000/print \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      [1, "चामल", 5],
      [2, "दाल", 10],
      [3, "तेल", 3],
      [4, "चिनी", 15],
      [5, "नुन", 2],
      [6, "आटा", 25]
    ]
  }'
```

#### Check Available Printers

```bash
curl http://localhost:3000/printers
```

## Sample Output

```
Your Store Name
2025-07-28 09:45:12

--------------------------------
SN  शीर्षक                     सं
1   चामल                       5
2   दाल                       10
3   तेल                        3
4   चिनी                      15
5   नुन                        2
6   आटा                       25
--------------------------------
```

## Setup for Different Platforms

### Windows

1. **Add WiFi Printer:**

   - Go to Settings > Devices > Printers & scanners
   - Click "Add a printer or scanner"
   - Select your WiFi printer

2. **Set Environment:**
   ```env
   PRINT_METHOD=auto  # or 'windows'
   PRINTER_NAME=YourWiFiPrinterName
   ```

### macOS/Linux

1. **Add Printer via CUPS:**

   ```bash
   # List available printers
   lpstat -p

   # Add printer if needed
   sudo lpadmin -p PrinterName -E -v ipp://printer-ip:631/ipp/print
   ```

2. **Set Environment:**
   ```env
   PRINT_METHOD=auto  # or 'cups'
   PRINTER_NAME=YourPrinterName
   ```

## Development

### Run in Development Mode

```bash
# Use mock printing (console output)
PRINT_METHOD=mock npm start
```

### Save to File (Testing)

```bash
# Save print output to files
PRINT_METHOD=file npm start
```

### Project Structure

```
slipServer/
├── server.js          # Main server file
├── printer.js         # Custom printer module
├── package.json       # Dependencies
├── .env.example       # Environment template
├── .env               # Your configuration (create this)
└── README.md          # This file
```

## Dependencies

- **express** - Web server framework
- **dotenv** - Environment configuration
- **dayjs** - Date formatting

## API Documentation

### Data Format

Each item in the `data` array should be an array with 3 elements:

- `[0]` - Serial number (integer)
- `[1]` - Item title (string, supports Nepali Unicode)
- `[2]` - Quantity (integer)

### Error Responses

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Troubleshooting

### Common Issues

1. **"No printers found"**

   - Check if printer is properly installed
   - Try `PRINT_METHOD=mock` for testing
   - Verify printer name in environment

2. **"Print command failed"**

   - Ensure printer is online and accessible
   - Check printer permissions
   - Try printing a test page from system

3. **Nepali text not displaying properly**
   - Ensure your terminal/console supports Unicode
   - Check if printer supports Unicode fonts
   - Try `PRINT_METHOD=file` to save output and check in text editor

### Testing Commands

```bash
# Test server is running
curl http://localhost:3000/printers

# Test with minimal data
curl -X POST http://localhost:3000/print \
  -H "Content-Type: application/json" \
  -d '{"data":[[1,"Test",1]]}'
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions:

- Check the troubleshooting section
- Review the configuration settings
- Test with `PRINT_METHOD=mock` first
