require('dotenv').config();
const { queryRAG } = require('./src/rag');

async function testRag() {
  try {
    const results = await queryRAG("test query", 1);
    console.log("RAG Results:", results);
  } catch (err) {
    console.error("Test RAG Error:", err);
  }
}

testRag();
