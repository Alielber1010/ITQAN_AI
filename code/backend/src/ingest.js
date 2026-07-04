/**
 * ITQAN PDF Ingestion Script
 * 
 * Run once to ingest the Shariah PDF into ChromaDB:
 *   node src/ingest.js
 * 
 * Skips ingestion if the collection already contains data.
 */
const path = require('path');
const fs = require('fs');
const { ingestPDF } = require('./rag');

// The PDF is in the repository root (itqan/itqan/)
const PDF_PATH = path.resolve(__dirname, '../Islaamic_Sharia_Law_sunni.pdf');

async function main() {
  console.log('=== ITQAN PDF Ingestion ===');
  console.log(`PDF Path: ${PDF_PATH}`);

  if (!fs.existsSync(PDF_PATH)) {
    console.error(`ERROR: PDF not found at ${PDF_PATH}`);
    console.error('Please ensure the file "Islaamic_Sharia_Law_sunni.pdf" exists in the repository root.');
    process.exit(1);
  }

  const fileSize = fs.statSync(PDF_PATH).size;
  console.log(`PDF Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

  try {
    const count = await ingestPDF(PDF_PATH);
    console.log(`\nSuccess! ${count} chunks are now available for RAG queries.`);
  } catch (error) {
    console.error('Ingestion failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
