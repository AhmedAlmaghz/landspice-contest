import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');

// Create database instance
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initializeDatabase() {
  // Companies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      logo_url TEXT,
      website TEXT,
      subscription_plan TEXT DEFAULT 'free',
      max_contests INTEGER DEFAULT 1,
      max_participants INTEGER DEFAULT 1000,
      max_social_platforms INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'viewer',
      is_active BOOLEAN DEFAULT TRUE,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    )
  `);

  // Contests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      start_date DATETIME,
      end_date DATETIME,
      prize_description TEXT,
      rules TEXT,
      max_participants INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    )
  `);

  // Social Platforms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contest_id INTEGER NOT NULL,
      platform_name TEXT NOT NULL,
      platform_url TEXT NOT NULL,
      action_type TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      verification_type TEXT DEFAULT 'automatic',
      position INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE
    )
  `);

  // Participants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contest_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT,
      referral_code TEXT UNIQUE NOT NULL,
      referred_by TEXT,
      progress INTEGER DEFAULT 0,
      total_actions INTEGER DEFAULT 0,
      total_shares INTEGER DEFAULT 0,
      total_referrals INTEGER DEFAULT 0,
      registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE,
      UNIQUE(contest_id, email)
    )
  `);

  // Participant Actions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS participant_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      platform_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      verification_date DATETIME,
      action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE,
      FOREIGN KEY (platform_id) REFERENCES social_platforms (id) ON DELETE CASCADE
    )
  `);

  // Winners table
  db.exec(`
    CREATE TABLE IF NOT EXISTS winners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contest_id INTEGER NOT NULL,
      participant_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      prize_description TEXT,
      draw_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      announced BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE,
      FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE
    )
  `);

  // Roles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Permissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Role Permissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
      UNIQUE(role_id, permission_id)
    )
  `);

  // Subscription Plans table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscription_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      price REAL NOT NULL,
      max_contests INTEGER NOT NULL,
      max_participants INTEGER NOT NULL,
      max_social_platforms INTEGER NOT NULL,
      features TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Company Subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      stripe_subscription_id TEXT,
      status TEXT DEFAULT 'active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_date DATETIME,
      auto_renew BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
    )
  `);

  // Analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contest_id INTEGER NOT NULL,
      metric_name TEXT NOT NULL,
      metric_value REAL NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contest_id) REFERENCES contests (id) ON DELETE CASCADE
    )
  `);

  // Insert default roles
  const rolesCount = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
  if (rolesCount.count === 0) {
    const roles = [
      { name: 'super_admin', description: 'مسؤول النظام' },
      { name: 'company_admin', description: 'مسؤول الشركة' },
      { name: 'manager', description: 'مدير المسابقة' },
      { name: 'viewer', description: 'مشاهد فقط' },
      { name: 'participant', description: 'مشارك' }
    ];

    const insertRole = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)');
    for (const role of roles) {
      insertRole.run(role.name, role.description);
    }
  }

  // Insert default permissions
  const permissionsCount = db.prepare('SELECT COUNT(*) as count FROM permissions').get() as { count: number };
  if (permissionsCount.count === 0) {
    const permissions = [
      { name: 'view_dashboard', description: 'عرض لوحة التحكم' },
      { name: 'manage_contests', description: 'إدارة المسابقات' },
      { name: 'manage_participants', description: 'إدارة المشاركين' },
      { name: 'manage_platforms', description: 'إدارة الشبكات الاجتماعية' },
      { name: 'view_analytics', description: 'عرض التحليلات' },
      { name: 'export_data', description: 'تصدير البيانات' },
      { name: 'manage_users', description: 'إدارة المستخدمين' },
      { name: 'manage_subscriptions', description: 'إدارة الاشتراكات' },
      { name: 'view_reports', description: 'عرض التقارير' },
      { name: 'edit_contest', description: 'تعديل المسابقة' },
      { name: 'delete_contest', description: 'حذف المسابقة' },
      { name: 'manage_winners', description: 'إدارة الفائزين' }
    ];

    const insertPermission = db.prepare('INSERT INTO permissions (name, description) VALUES (?, ?)');
    for (const permission of permissions) {
      insertPermission.run(permission.name, permission.description);
    }
  }

  // Insert default subscription plans
  const plansCount = db.prepare('SELECT COUNT(*) as count FROM subscription_plans').get() as { count: number };
  if (plansCount.count === 0) {
    const plans = [
      {
        name: 'free',
        description: 'الخطة المجانية',
        price: 0,
        max_contests: 1,
        max_participants: 100,
        max_social_platforms: 3,
        features: 'مسابقة واحدة، 100 مشارك، 3 شبكات اجتماعية'
      },
      {
        name: 'pro',
        description: 'الخطة الاحترافية',
        price: 99,
        max_contests: 5,
        max_participants: 5000,
        max_social_platforms: 10,
        features: '5 مسابقات، 5000 مشارك، 10 شبكات اجتماعية، تحليلات متقدمة'
      },
      {
        name: 'enterprise',
        description: 'الخطة الشاملة',
        price: 299,
        max_contests: 999,
        max_participants: 999999,
        max_social_platforms: 999,
        features: 'مسابقات غير محدودة، مشاركين غير محدودين، دعم 24/7'
      }
    ];

    const insertPlan = db.prepare(`
      INSERT INTO subscription_plans (name, description, price, max_contests, max_participants, max_social_platforms, features)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const plan of plans) {
      insertPlan.run(
        plan.name,
        plan.description,
        plan.price,
        plan.max_contests,
        plan.max_participants,
        plan.max_social_platforms,
        plan.features
      );
    }
  }
}

// Initialize database immediately
initializeDatabase();

// Export database instance
export { db };

// Participant operations
export const participantQueries = {
  create: db.prepare(`
    INSERT INTO participants (contest_id, name, email, phone, city, referral_code, referred_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  findByEmail: db.prepare('SELECT * FROM participants WHERE email = ? AND contest_id = ?'),
  
  findByPhone: db.prepare('SELECT * FROM participants WHERE phone = ? AND contest_id = ?'),
  
  findById: db.prepare('SELECT * FROM participants WHERE id = ?'),
  
  findByReferralCode: db.prepare('SELECT * FROM participants WHERE referral_code = ?'),
  
  updateProgress: db.prepare(`
    UPDATE participants 
    SET progress = ?, total_actions = ?, total_shares = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  getAll: db.prepare('SELECT * FROM participants ORDER BY registration_date DESC'),
  
  getByContest: db.prepare('SELECT * FROM participants WHERE contest_id = ? ORDER BY registration_date DESC'),
  
  getEligibleForDraw: db.prepare('SELECT * FROM participants WHERE contest_id = ? AND progress >= ?'),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN progress = 100 THEN 1 END) as completed,
      SUM(total_shares) as total_shares,
      COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as total_referrals
    FROM participants
    WHERE contest_id = ?
  `),
  
  getByCity: db.prepare(`
    SELECT city, COUNT(*) as count 
    FROM participants 
    WHERE contest_id = ?
    GROUP BY city 
    ORDER BY count DESC
  `)
};

// Contest operations
export const contestQueries = {
  create: db.prepare(`
    INSERT INTO contests (company_id, title, description, status, end_date, prize_description, rules)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM contests WHERE id = ?'),
  
  findByCompany: db.prepare('SELECT * FROM contests WHERE company_id = ? ORDER BY created_at DESC'),
  
  update: db.prepare(`
    UPDATE contests 
    SET title = ?, description = ?, status = ?, end_date = ?, prize_description = ?, rules = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM contests WHERE id = ?'),
  
  getActive: db.prepare('SELECT * FROM contests WHERE status = ? ORDER BY created_at DESC'),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(DISTINCT p.id) as total_participants,
      COUNT(DISTINCT pa.id) as total_actions,
      COUNT(DISTINCT CASE WHEN pa.is_verified THEN pa.id END) as verified_actions
    FROM contests c
    LEFT JOIN participants p ON c.id = p.contest_id
    LEFT JOIN participant_actions pa ON p.id = pa.participant_id
    WHERE c.id = ?
  `)
};

// Company operations
export const companyQueries = {
  create: db.prepare(`
    INSERT INTO companies (name, email, phone, subscription_plan)
    VALUES (?, ?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM companies WHERE id = ?'),
  
  findByEmail: db.prepare('SELECT * FROM companies WHERE email = ?'),
  
  update: db.prepare(`
    UPDATE companies 
    SET name = ?, email = ?, phone = ?, subscription_plan = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  getAll: db.prepare('SELECT * FROM companies ORDER BY created_at DESC')
};

// User operations
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (company_id, email, password_hash, full_name, role)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  findByCompany: db.prepare('SELECT * FROM users WHERE company_id = ? ORDER BY created_at DESC'),
  
  update: db.prepare(`
    UPDATE users 
    SET email = ?, full_name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM users WHERE id = ?'),
  
  updateLastLogin: db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?')
};

// Social Platform operations
export const socialPlatformQueries = {
  create: db.prepare(`
    INSERT INTO social_platforms (contest_id, platform_name, platform_url, action_type, verification_type, position)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM social_platforms WHERE id = ?'),
  
  findByContest: db.prepare('SELECT * FROM social_platforms WHERE contest_id = ? ORDER BY position ASC'),
  
  update: db.prepare(`
    UPDATE social_platforms 
    SET platform_name = ?, platform_url = ?, action_type = ?, verification_type = ?, is_active = ?, position = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM social_platforms WHERE id = ?'),
  
  reorder: db.prepare('UPDATE social_platforms SET position = ? WHERE id = ?')
};

// Participant Action operations
export const participantActionQueries = {
  create: db.prepare(`
    INSERT INTO participant_actions (participant_id, platform_id, action_type)
    VALUES (?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM participant_actions WHERE id = ?'),
  
  findByParticipant: db.prepare('SELECT * FROM participant_actions WHERE participant_id = ? ORDER BY action_date DESC'),
  
  findByPlatform: db.prepare('SELECT * FROM participant_actions WHERE platform_id = ? ORDER BY action_date DESC'),
  
  verify: db.prepare(`
    UPDATE participant_actions 
    SET is_verified = TRUE, verification_date = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  getUnverified: db.prepare('SELECT * FROM participant_actions WHERE is_verified = FALSE ORDER BY action_date ASC')
};

// Winner operations
export const winnerQueries = {
  create: db.prepare(`
    INSERT INTO winners (contest_id, participant_id, position, prize_description)
    VALUES (?, ?, ?, ?)
  `),
  
  findByContest: db.prepare('SELECT * FROM winners WHERE contest_id = ? ORDER BY position ASC'),
  
  findByParticipant: db.prepare('SELECT * FROM winners WHERE participant_id = ?'),
  
  announce: db.prepare('UPDATE winners SET announced = TRUE WHERE id = ?'),
  
  delete: db.prepare('DELETE FROM winners WHERE id = ?')
};
