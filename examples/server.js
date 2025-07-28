const { createServer } = require('../lib/server');

// Create server with custom options
const app = createServer({
  orgName: 'Example Store पसल',
  pageWidth: 40,
  printer: 'HP LaserJet',
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🖨️  Example server running at http://localhost:${port}`);
  console.log(`
📋 Try these endpoints:
   GET  /health    - Health check
   GET  /printers  - List available printers
   POST /print     - Print a receipt

📝 Example print request:
   curl -X POST http://localhost:${port}/print \\
     -H "Content-Type: application/json" \\
     -d '{"data":[[1,"चामल",5],[2,"दाल",10],[3,"तेल",3]]}'
  `);
});
