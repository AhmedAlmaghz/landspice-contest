import Database from 'better-sqlite3';
import { join } from 'path';
import { unlinkSync } from 'fs';

const dbPath = join(process.cwd(), 'contest.db');

function recreateDatabase() {
  try {
    console.log('🔄 إعادة إنشاء قاعدة البيانات بالكامل...\n');

    // حذف قاعدة البيانات الموجودة إذا كانت موجودة
    try {
      unlinkSync(dbPath);
      console.log('✅ تم حذف قاعدة البيانات القديمة');
    } catch (error) {
      console.log('ℹ️ قاعدة البيانات القديمة غير موجودة، سيتم إنشاء واحدة جديدة');
    }

    // إنشاء قاعدة البيانات الجديدة
    const db = new Database(dbPath);

    console.log('📋 إنشاء الجداول...');

    // جدول المشاركين
    db.prepare(`
      CREATE TABLE participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        progress INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        facebook_followed BOOLEAN DEFAULT FALSE,
        instagram_followed BOOLEAN DEFAULT FALSE,
        youtube_followed BOOLEAN DEFAULT FALSE,
        tiktok_followed BOOLEAN DEFAULT FALSE,
        twitter_followed BOOLEAN DEFAULT FALSE,
        facebook_channel_followed BOOLEAN DEFAULT FALSE,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // جدول الإعدادات
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

    // جدول الإجراءات الاجتماعية
    db.prepare(`
      CREATE TABLE social_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participant_id INTEGER NOT NULL,
        platform TEXT NOT NULL,
        action_type TEXT NOT NULL,
        action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (participant_id) REFERENCES participants(id)
      )
    `).run();

    // جدول الفائزين
    db.prepare(`
      CREATE TABLE winners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participant_id INTEGER NOT NULL,
        position INTEGER NOT NULL,
        announced BOOLEAN DEFAULT FALSE,
        announcement_date DATETIME,
        FOREIGN KEY (participant_id) REFERENCES participants(id)
      )
    `).run();

    console.log('✅ تم إنشاء جميع الجداول');

    // إدراج البيانات الافتراضية للإعدادات
    console.log('📝 إدراج البيانات الافتراضية...');

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

    // فحص البيانات النهائية
    const settings = db.prepare('SELECT * FROM contest_settings WHERE id = 1').get();
    const participantsCount = db.prepare('SELECT COUNT(*) as count FROM participants').get();
    const socialActionsCount = db.prepare('SELECT COUNT(*) as count FROM social_actions').get();
    const winnersCount = db.prepare('SELECT COUNT(*) as count FROM winners').get();

    console.log('\n📊 البيانات النهائية في قاعدة البيانات:');
    console.log('========================================');
    console.log(`جدول contest_settings: 1 سجل`);
    console.log(`جدول participants: ${participantsCount.count} سجل`);
    console.log(`جدول social_actions: ${socialActionsCount.count} سجل`);
    console.log(`جدول winners: ${winnersCount.count} سجل`);
    console.log('========================================');
    console.log('\n📋 محتوى contest_settings:');
    Object.entries(settings).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    console.log('\n✅ قاعدة البيانات جاهزة ومحدثة بالكامل!');

    db.close();

  } catch (error) {
    console.error('❌ خطأ في إعادة إنشاء قاعدة البيانات:', error);
  }
}

// تشغيل إعادة الإنشاء
recreateDatabase();
