require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runChatMigration() {
  try {
    console.log('Reading chat_migration.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'chat_migration.sql'), 'utf8');
    
    console.log('Executing chat migration on database...');
    await db.query(sql);
    
    console.log('Chat migration completed successfully!');
  } catch (err) {
    console.error('Error running chat migration:', err);
  } finally {
    db.pool.end();
  }
}

runChatMigration();
