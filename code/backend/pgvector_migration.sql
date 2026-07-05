-- Migration to replace ChromaDB with pgvector for the Shariah RAG knowledge base

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS shariah_chunks (
    chunk_id     VARCHAR(128) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    source       VARCHAR(255) NOT NULL,
    chunk_index  INTEGER NOT NULL,
    content      TEXT NOT NULL,
    embedding    vector(384) NOT NULL,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shariah_chunks_embedding
    ON shariah_chunks USING hnsw (embedding vector_cosine_ops);
