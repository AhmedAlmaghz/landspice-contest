const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

console.log('📋 فحص هيكل قاعدة البيانات...\n');

const tables = ['companies', 'social_platforms', 'contests', 'participants', 'winners'];

tables.forEach(table => {
  try {
    const info = db.prepare(`PRAGMA table_info(${table})`).all();
    console.log(`\n📊 جدول: ${table}`);
    console.log('الأعمدة:');
    info.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });
  } catch (error) {
    console.log(`❌ جدول ${table} غير موجود`);
  }
});

db.close();
