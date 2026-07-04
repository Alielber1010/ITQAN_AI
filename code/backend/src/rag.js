/**
 * RAG (Retrieval-Augmented Generation) Module
 * 
 * Handles PDF text extraction, chunking, and ChromaDB vector storage/retrieval.
 * Used to ground the AI chatbot's responses in the actual Shariah PDF content.
 */
const path = require('path');
const fs = require('fs');
const { ChromaClient } = require('chromadb');

const COLLECTION_NAME = 'shariah_knowledge';
const CHROMA_PATH = path.resolve(__dirname, '../../chroma_data');

let client = null;
let collection = null;

/**
 * Initialize ChromaDB client (persistent local storage)
 */
async function getClient() {
  if (!client) {
    const chromaUrl = process.env.CHROMA_DB_URL || 'http://localhost:8000';
    try {
      const parsedUrl = new URL(chromaUrl);
      client = new ChromaClient({
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80'), 10),
        ssl: parsedUrl.protocol === 'https:'
      });
    } catch (e) {
      console.warn("Invalid CHROMA_DB_URL, falling back to defaults", e);
      client = new ChromaClient({ host: 'localhost', port: 8000, ssl: false });
    }
  }
  return client;
}

/**
 * Get or create the Shariah knowledge collection
 */
async function getCollection() {
  if (collection) return collection;
  const c = await getClient();
  collection = await c.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { description: 'Shariah law PDF chunks for RAG' },
  });
  return collection;
}

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(pdfPath) {
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Split text into overlapping chunks
 * @param {string} text - Full text content
 * @param {number} chunkSize - Target chunk size in characters (~500 tokens ≈ 2000 chars)
 * @param {number} overlap - Overlap in characters (~50 tokens ≈ 200 chars)
 */
function chunkText(text, chunkSize = 2000, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Try to break at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);
      if (breakPoint > start + chunkSize / 2) {
        end = breakPoint + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) { // Skip very small chunks
      chunks.push(chunk);
    }

    start = end - overlap;
  }

  return chunks;
}

/**
 * Ingest a PDF into the ChromaDB collection
 */
async function ingestPDF(pdfPath) {
  console.log(`[RAG] Starting PDF ingestion: ${pdfPath}`);

  const col = await getCollection();

  // Check if already ingested
  const count = await col.count();
  if (count > 0) {
    console.log(`[RAG] Collection already has ${count} chunks. Skipping ingestion.`);
    return count;
  }

  // Extract and chunk
  const text = await extractTextFromPDF(pdfPath);
  console.log(`[RAG] Extracted ${text.length} characters from PDF.`);

  const chunks = chunkText(text);
  console.log(`[RAG] Created ${chunks.length} chunks.`);

  // Add chunks to ChromaDB in batches
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const ids = batch.map((_, idx) => `chunk-${i + idx}`);
    const metadatas = batch.map((_, idx) => ({
      source: path.basename(pdfPath),
      chunkIndex: i + idx,
    }));

    await col.add({
      ids,
      documents: batch,
      metadatas,
    });

    console.log(`[RAG] Ingested batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
  }

  const finalCount = await col.count();
  console.log(`[RAG] Ingestion complete. Total chunks in collection: ${finalCount}`);
  return finalCount;
}

/**
 * Query the ChromaDB collection for relevant passages
 * @param {string} question - User's question
 * @param {number} topK - Number of results to return
 * @returns {Array<string>} - Relevant text passages
 */
async function queryRAG(question, topK = 5) {
  try {
    const col = await getCollection();
    const count = await col.count();
    
    if (count === 0) {
      console.log('[RAG] Collection is empty. Run ingest.js first.');
      return [];
    }

    const results = await col.query({
      queryTexts: [question],
      nResults: Math.min(topK, count),
    });

    if (results && results.documents && results.documents[0]) {
      return results.documents[0];
    }

    return [];
  } catch (error) {
    console.error('[RAG] Query error:', error.message);
    return [];
  }
}

module.exports = {
  ingestPDF,
  queryRAG,
  getCollection,
  extractTextFromPDF,
  chunkText,
};
