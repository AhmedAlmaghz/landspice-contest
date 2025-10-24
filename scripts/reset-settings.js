import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

// Create database instance
const db = new Database(dbPath);

// تحديث البيانات الافتراضية في قاعدة البيانات
function resetDefaultSettings() {
  try {
    // حذف البيانات الموجودة أولاً
    db.prepare('DELETE FROM contest_settings WHERE id = 1').run();

    // إدراج البيانات الجديدة
    db.prepare(`
      INSERT INTO contest_settings (
        id,
        contest_title,
        prize_description,
        facebook_url,
        instagram_url,
        youtube_url,
        tiktok_url,
        twitter_url,
        facebook_channel_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1, // id
      'مسابقة المتابعة والمشاركة',
      '🥇 المركز الأول: جائزة قيمة 1000 ريال\n🥈 المركز الثاني: جائزة قيمة 500 ريال\n🥉 المركز الثالث: جائزة قيمة 250 ريال\n🎁 جوائز تشجيعية للـ 10 الأوائل',
      'https://facebook.com/LandSpice25',
      'https://instagram.com/LandSpice25',
      'https://youtube.com/@LandSpice',
      'https://tiktok.com/@LandSpice',
      'https://x.com/LandSpice25',
      'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C'
    );

    console.log('✅ تم تحديث البيانات الافتراضية بنجاح');

    // عرض البيانات الحالية للتأكد
    const settings = db.prepare('SELECT * FROM contest_settings WHERE id = 1').get();
    console.log('البيانات الحالية:', settings);

  } catch (error) {
    console.error('❌ خطأ في تحديث البيانات:', error);
  } finally {
    db.close();
  }
}

// تشغيل الدالة
resetDefaultSettings();
