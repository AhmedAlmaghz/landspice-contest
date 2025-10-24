import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

async function testAPIs() {
  try {
    console.log('🧪 اختبار API endpoints...\n');

    const db = new Database(dbPath);

    // فحص البيانات في قاعدة البيانات
    const settings = db.prepare('SELECT * FROM contest_settings WHERE id = 1').get();

    if (!settings) {
      console.log('❌ لا توجد بيانات في قاعدة البيانات');
      return;
    }

    console.log('📊 البيانات في قاعدة البيانات:');
    console.log(settings);

    // اختبار API endpoints يدوياً
    console.log('\n🔗 اختبار API endpoints...');

    // اختبار /api/settings
    try {
      const response1 = await fetch('http://localhost:3000/api/settings');
      const data1 = await response1.json();
      console.log(`✅ /api/settings: ${response1.ok ? 'يعمل' : 'خطأ'}`);
      console.log(`   الحالة: ${response1.status}`);
      console.log(`   البيانات:`, data1);
    } catch (error) {
      console.log(`❌ /api/settings: خطأ - ${error.message}`);
    }

    // اختبار /api/social-links
    try {
      const response2 = await fetch('http://localhost:3000/api/social-links');
      const data2 = await response2.json();
      console.log(`✅ /api/social-links: ${response2.ok ? 'يعمل' : 'خطأ'}`);
      console.log(`   الحالة: ${response2.status}`);
      console.log(`   البيانات:`, data2);
    } catch (error) {
      console.log(`❌ /api/social-links: خطأ - ${error.message}`);
    }

    db.close();

  } catch (error) {
    console.error('❌ خطأ في اختبار API endpoints:', error);
  }
}

// تشغيل الاختبار
testAPIs();
