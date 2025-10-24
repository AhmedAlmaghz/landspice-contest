import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

// Create database instance
const db = new Database(dbPath);

function checkDatabase() {
  try {
    console.log('🔍 فحص قاعدة البيانات...\n');

    // فحص جدول contest_settings
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM contest_settings').get();
    console.log(`عدد الإعدادات: ${settingsCount.count}`);

    if (settingsCount.count > 0) {
      const settings = db.prepare('SELECT * FROM contest_settings').all();
      console.log('\n📋 بيانات الإعدادات:');
      settings.forEach(setting => {
        console.log(setting);
      });
    } else {
      console.log('❌ لا توجد بيانات في جدول contest_settings');
    }

    // فحص باقي الجداول
    const tables = ['participants', 'social_actions', 'winners'];
    tables.forEach(table => {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      console.log(`\nجدول ${table}: ${count.count} سجل`);
    });

  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات:', error);
  } finally {
    db.close();
  }
}

// تشغيل الفحص
checkDatabase();
