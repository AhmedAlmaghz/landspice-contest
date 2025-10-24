import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

export function seedDatabase() {
  try {
    // Check if data already exists
    const companiesCount = db.prepare('SELECT COUNT(*) as count FROM companies').get() as { count: number };
    if (companiesCount.count > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with sample data...');

    // Insert sample company
    db.prepare(`
      INSERT INTO companies (name, email, phone, subscription_plan, max_contests, max_participants, max_social_platforms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'LandSpice Company',
      'company@landspice.com',
      '+966501234567',
      'pro',
      5,
      5000,
      10
    );

    // Insert sample contest
    db.prepare(`
      INSERT INTO contests (company_id, title, description, status, start_date, end_date, prize_description, rules, max_participants)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'مسابقة المتابعة والمشاركة',
      'مسابقة حصرية للمتابعين والمشاركين في وسائل التواصل الاجتماعي',
      'active',
      new Date().toISOString(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      '🥇 المركز الأول: جائزة قيمة 1000 ريال\n🥈 المركز الثاني: جائزة قيمة 500 ريال\n🥉 المركز الثالث: جائزة قيمة 250 ريال',
      'يجب متابعة جميع الحسابات والمشاركة في المنشورات',
      1000
    );

    // Insert sample social platforms
    const platforms = [
      { name: 'Facebook', url: 'https://facebook.com/LandSpice25', action: 'follow' },
      { name: 'Instagram', url: 'https://instagram.com/LandSpice25', action: 'follow' },
      { name: 'YouTube', url: 'https://youtube.com/@LandSpice', action: 'follow' },
      { name: 'TikTok', url: 'https://tiktok.com/@LandSpice', action: 'follow' },
      { name: 'Twitter', url: 'https://x.com/LandSpice25', action: 'follow' },
    ];

    platforms.forEach((platform, index) => {
      db.prepare(`
        INSERT INTO social_platforms (contest_id, platform_name, platform_url, action_type, verification_type, position)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        1,
        platform.name,
        platform.url,
        platform.action,
        'automatic',
        index
      );
    });

    // Insert sample participants
    const participants = [
      { name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', city: 'الرياض' },
      { name: 'فاطمة علي', email: 'fatima@example.com', phone: '0502234567', city: 'جدة' },
      { name: 'محمود سالم', email: 'mahmoud@example.com', phone: '0503234567', city: 'الدمام' },
      { name: 'نور خالد', email: 'noor@example.com', phone: '0504234567', city: 'الرياض' },
      { name: 'سارة يوسف', email: 'sarah@example.com', phone: '0505234567', city: 'مكة' },
    ];

    const generateReferralCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    participants.forEach((participant) => {
      db.prepare(`
        INSERT INTO participants (contest_id, name, email, phone, city, referral_code, progress, total_actions, total_shares)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        1,
        participant.name,
        participant.email,
        participant.phone,
        participant.city,
        generateReferralCode(),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 5)
      );
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
