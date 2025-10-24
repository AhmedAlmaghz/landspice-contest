import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

function forceUpdateSettings() {
  try {
    console.log('🔄 بدء عملية تحديث قاعدة البيانات بالقوة...\n');

    const db = new Database(dbPath);

    // حذف جميع البيانات الموجودة في جدول contest_settings
    const deleteResult = db.prepare('DELETE FROM contest_settings').run();
    console.log(`✅ تم حذف ${deleteResult.changes} سجل من contest_settings`);

    // إدراج البيانات الجديدة
    const insertResult = db.prepare(`
      INSERT INTO contest_settings (
        id,
        contest_title,
        contest_end_date,
        prize_description,
        facebook_url,
        instagram_url,
        youtube_url,
        tiktok_url,
        twitter_url,
        facebook_channel_url,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      1, // id
      'مسابقة المتابعة والمشاركة',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // شهر من الآن
      '🥇 المركز الأول: جائزة قيمة 1000 ريال\n🥈 المركز الثاني: جائزة قيمة 500 ريال\n🥉 المركز الثالث: جائزة قيمة 250 ريال\n🎁 جوائز تشجيعية للـ 10 الأوائل',
      'https://facebook.com/LandSpice25',
      'https://instagram.com/LandSpice25',
      'https://youtube.com/@LandSpice',
      'https://tiktok.com/@LandSpice',
      'https://x.com/LandSpice25',
      'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C'
    );

    console.log(`✅ تم إدراج سجل جديد برقم ${insertResult.lastInsertRowid}`);

    // فحص البيانات النهائية
    const settings = db.prepare('SELECT * FROM contest_settings WHERE id = 1').get();

    console.log('\n📋 البيانات النهائية في قاعدة البيانات:');
    console.log('========================================');
    Object.entries(settings).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('========================================');

    // التحقق من أن الروابط صحيحة
    const correctLinks = [
      'https://facebook.com/LandSpice25',
      'https://instagram.com/LandSpice25',
      'https://youtube.com/@LandSpice',
      'https://tiktok.com/@LandSpice',
      'https://x.com/LandSpice25',
      'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C'
    ];

    let allCorrect = true;
    correctLinks.forEach(link => {
      if (!Object.values(settings).includes(link)) {
        allCorrect = false;
        console.log(`❌ الرابط ${link} غير موجود في قاعدة البيانات`);
      }
    });

    if (allCorrect) {
      console.log('✅ جميع الروابط الصحيحة موجودة في قاعدة البيانات!');
    }

    db.close();

  } catch (error) {
    console.error('❌ خطأ في تحديث قاعدة البيانات:', error);
  }
}

// تشغيل التحديث بالقوة
forceUpdateSettings();
