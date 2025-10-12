import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

// Create database instance
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initializeDatabase() {
  // Participants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      referral_code TEXT UNIQUE NOT NULL,
      referred_by TEXT,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      progress INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      facebook_followed BOOLEAN DEFAULT FALSE,
      instagram_followed BOOLEAN DEFAULT FALSE,
      youtube_followed BOOLEAN DEFAULT FALSE,
      tiktok_followed BOOLEAN DEFAULT FALSE,
      twitter_followed BOOLEAN DEFAULT FALSE,
      facebook_channel_followed BOOLEAN DEFAULT FALSE
    )
  `);

  // Social media actions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      action_type TEXT NOT NULL, -- 'follow' or 'share'
      action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE
    )
  `);

  // Contest settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contest_settings (
      id INTEGER PRIMARY KEY,
      contest_title TEXT DEFAULT 'مسابقة المتابعة والمشاركة',
      contest_end_date DATETIME,
      prize_description TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      youtube_url TEXT,
      tiktok_url TEXT,
      twitter_url TEXT,
      facebook_channel_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Winners table
  db.exec(`
    CREATE TABLE IF NOT EXISTS winners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      draw_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      announced BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE
    )
  `);

  // Insert default settings if not exists
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM contest_settings').get() as { count: number };

  if (settingsCount.count === 0) {
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
  }
}

// Initialize database immediately
initializeDatabase();

// Participant operations
export const participantQueries = {
  create: db.prepare(`
    INSERT INTO participants (name, email, phone, city, referral_code, referred_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  findByEmail: db.prepare('SELECT * FROM participants WHERE email = ?'),
  
  findById: db.prepare('SELECT * FROM participants WHERE id = ?'),
  
  findByReferralCode: db.prepare('SELECT * FROM participants WHERE referral_code = ?'),
  
  updateProgress: db.prepare(`
    UPDATE participants 
    SET progress = ?, shares = ?, 
        facebook_followed = ?, instagram_followed = ?, youtube_followed = ?,
        tiktok_followed = ?, twitter_followed = ?, facebook_channel_followed = ?
    WHERE id = ?
  `),
  
  getAll: db.prepare('SELECT * FROM participants ORDER BY registration_date DESC'),
  
  getEligibleForDraw: db.prepare('SELECT * FROM participants WHERE progress >= ?'),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN progress = 100 THEN 1 END) as completed,
      SUM(shares) as total_shares,
      COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as total_referrals
    FROM participants
  `),
  
  getByCity: db.prepare(`
    SELECT city, COUNT(*) as count 
    FROM participants 
    GROUP BY city 
    ORDER BY count DESC
  `),
  
  getDailyRegistrations: db.prepare(`
    SELECT DATE(registration_date) as date, COUNT(*) as count
    FROM participants
    WHERE registration_date >= date('now', '-7 days')
    GROUP BY DATE(registration_date)
    ORDER BY date
  `)
};

// Social actions operations
export const socialActionQueries = {
  create: db.prepare(`
    INSERT INTO social_actions (participant_id, platform, action_type)
    VALUES (?, ?, ?)
  `),
  
  getByParticipant: db.prepare(`
    SELECT * FROM social_actions 
    WHERE participant_id = ? 
    ORDER BY action_date DESC
  `),
  
  getStats: db.prepare(`
    SELECT platform, action_type, COUNT(*) as count
    FROM social_actions
    GROUP BY platform, action_type
  `)
};

// Contest settings operations
export const settingsQueries = {
  get: db.prepare('SELECT * FROM contest_settings WHERE id = 1'),
  
  update: db.prepare(`
    UPDATE contest_settings 
    SET contest_title = ?, contest_end_date = ?, prize_description = ?,
        facebook_url = ?, instagram_url = ?, youtube_url = ?,
        tiktok_url = ?, twitter_url = ?, facebook_channel_url = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `)
};

// Winners operations
export const winnerQueries = {
  create: db.prepare(`
    INSERT INTO winners (participant_id, position)
    VALUES (?, ?)
  `),
  
  getAll: db.prepare(`
    SELECT w.*, p.name, p.email, p.phone, p.city
    FROM winners w
    JOIN participants p ON w.participant_id = p.id
    ORDER BY w.position
  `),
  
  announce: db.prepare('UPDATE winners SET announced = TRUE WHERE id = ?'),
  
  clear: db.prepare('DELETE FROM winners')
};

// Initialize database on import
initializeDatabase();

export default db;
