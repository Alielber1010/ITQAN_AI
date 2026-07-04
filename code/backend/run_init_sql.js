const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runInitSql() {
  try {
    console.log('Reading init.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    console.log('Executing init.sql...');
    await db.query(sql);
    console.log('Database initialized successfully!');
    
    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('Executing seed.sql...');
    await db.query(seedSql);
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error running init.sql:', err);
  } finally {
    db.pool.end();
  }
}

runInitSql();
