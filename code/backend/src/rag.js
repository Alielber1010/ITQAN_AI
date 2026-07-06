/**
 * RAG (Retrieval-Augmented Generation) Module
 *
 * Handles PDF text extraction, chunking, and pgvector-backed embedding
 * storage/retrieval. Used to ground the AI chatbot's responses in the
 * actual Shariah PDF content.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');
const { env: transformersEnv } = require('@huggingface/transformers');
const { DefaultEmbeddingFunction } = require('@chroma-core/default-embed');
const db = require('./db');

// Vercel's serverless filesystem is read-only outside /tmp, but transformers.js
// defaults to caching the downloaded model under node_modules. Redirect it.
transformersEnv.cacheDir = path.join(os.tmpdir(), 'transformers-cache');

let embedder = null;

/**
 * Lazily construct the local embedding model (Xenova/all-MiniLM-L6-v2, 384 dims).
 * Runs in-process via ONNX — no external service required.
 */
function getEmbedder() {
  if (!embedder) {
    embedder = new DefaultEmbeddingFunction();
  }
  return embedder;
}

function toVectorLiteral(embedding) {
  return `[${embedding.join(',')}]`;
}

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(pdfPath) {
  const { PDFParse } = require('pdf-parse');
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
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
 * Ingest a PDF into the shariah_chunks pgvector table
 */
async function ingestPDF(pdfPath) {
  console.log(`[RAG] Starting PDF ingestion: ${pdfPath}`);

  const countRes = await db.query('SELECT COUNT(*)::int AS count FROM shariah_chunks');
  const existingCount = countRes.rows[0].count;
  if (existingCount > 0) {
    console.log(`[RAG] Table already has ${existingCount} chunks. Skipping ingestion.`);
    return existingCount;
  }

  // Extract and chunk
  const text = await extractTextFromPDF(pdfPath);
  console.log(`[RAG] Extracted ${text.length} characters from PDF.`);

  const chunks = chunkText(text);
  console.log(`[RAG] Created ${chunks.length} chunks.`);

  const source = path.basename(pdfPath);
  const fn = getEmbedder();

  // Embed and insert in batches
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const embeddings = await fn.generate(batch);

    for (let j = 0; j < batch.length; j++) {
      await db.query(
        `INSERT INTO shariah_chunks (source, chunk_index, content, embedding)
         VALUES ($1, $2, $3, $4::vector)`,
        [source, i + j, batch[j], toVectorLiteral(embeddings[j])]
      );
    }

    console.log(`[RAG] Ingested batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
  }

  const finalRes = await db.query('SELECT COUNT(*)::int AS count FROM shariah_chunks');
  const finalCount = finalRes.rows[0].count;
  console.log(`[RAG] Ingestion complete. Total chunks in table: ${finalCount}`);
  return finalCount;
}

/**
 * Query the shariah_chunks table for relevant passages via cosine similarity
 * @param {string} question - User's question
 * @param {number} topK - Number of results to return
 * @returns {Array<string>} - Relevant text passages
 */
async function queryRAG(question, topK = 5) {
  try {
    const countRes = await db.query('SELECT COUNT(*)::int AS count FROM shariah_chunks');
    const count = countRes.rows[0].count;

    if (count === 0) {
      console.log('[RAG] Table is empty. Run ingest.js first.');
      return [];
    }

    const fn = getEmbedder();
    const [queryEmbedding] = await fn.generate([question]);

    const result = await db.query(
      `SELECT content FROM shariah_chunks
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [toVectorLiteral(queryEmbedding), Math.min(topK, count)]
    );

    return result.rows.map((r) => r.content);
  } catch (error) {
    console.error('[RAG] Query error:', error.message);
    return [];
  }
}

module.exports = {
  ingestPDF,
  queryRAG,
  extractTextFromPDF,
  chunkText,
};
