import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

try {
  console.log('🔍 فحص قاعدة البيانات...');

  const db = new Database(dbPath);

  // فحص ما إذا كان جدول contest_settings موجود
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='contest_settings'
  `).get();

  if (!tableExists) {
    console.log('❌ جدول contest_settings غير موجود!');
    console.log('🔧 إنشاء الجدول...');

    // إنشاء الجدول إذا لم يكن موجوداً
    db.prepare(`
      CREATE TABLE contest_settings (
        id INTEGER PRIMARY KEY,
        contest_title TEXT NOT NULL,
        contest_end_date TEXT,
        prize_description TEXT,
        facebook_url TEXT,
        instagram_url TEXT,
        youtube_url TEXT,
        tiktok_url TEXT,
        twitter_url TEXT,
        facebook_channel_url TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    console.log('✅ تم إنشاء جدول contest_settings');
  }

  // فحص عدد السجلات في contest_settings
  const countResult = db.prepare('SELECT COUNT(*) as count FROM contest_settings').get();
  console.log(`📊 عدد السجلات في contest_settings: ${countResult.count}`);

  if (countResult.count === 0) {
    console.log('📝 إدراج البيانات الافتراضية...');

    // إدراج البيانات الافتراضية
    db.prepare(`
      INSERT INTO contest_settings (
        id, contest_title, contest_end_date, prize_description,
        facebook_url, instagram_url, youtube_url, tiktok_url, twitter_url, facebook_channel_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'مسابقة المتابعة والمشاركة',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      '🥇 المركز الأول: جائزة قيمة 1000 ريال\n🥈 المركز الثاني: جائزة قيمة 500 ريال\n🥉 المركز الثالث: جائزة قيمة 250 ريال\n🎁 جوائز تشجيعية للـ 10 الأوائل',
      'https://facebook.com/LandSpice25',
      'https://instagram.com/LandSpice25',
      'https://youtube.com/@LandSpice',
      'https://tiktok.com/@LandSpice',
      'https://x.com/LandSpice25',
      'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C'
    );

    console.log('✅ تم إدراج البيانات الافتراضية');
  }

  // فحص البيانات النهائية
  const settings = db.prepare('SELECT * FROM contest_settings WHERE id = 1').get();

  console.log('\n📋 البيانات النهائية في قاعدة البيانات:');
  console.log('========================================');
  Object.entries(settings).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.log('========================================');

  console.log('\n✅ قاعدة البيانات جاهزة ومحدثة!');

  db.close();

} catch (error) {
  console.error('❌ خطأ في فحص/إصلاح قاعدة البيانات:', error);
}
