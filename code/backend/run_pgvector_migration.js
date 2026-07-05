require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runPgvectorMigration() {
  try {
    console.log('Reading pgvector_migration.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'pgvector_migration.sql'), 'utf8');

    console.log('Executing pgvector migration on database...');
    await db.query(sql);

    console.log('pgvector migration completed successfully!');
  } catch (err) {
    console.error('Error running pgvector migration:', err);
  } finally {
    db.pool.end();
  }
}

runPgvectorMigration();
