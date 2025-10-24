const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

console.log('🗑️  حذف البيانات القديمة...');

// حذف جميع البيانات
try {
  db.exec(`
    DELETE FROM winners;
    DELETE FROM participants;
    DELETE FROM contests;
    DELETE FROM social_platforms;
    DELETE FROM companies;
  `);
} catch (error) {
  console.log('⚠️  بعض الجداول قد لا تكون موجودة، سيتم المتابعة...');
}

console.log('✅ تم حذف البيانات القديمة');

console.log('🌱 بذر بيانات وهمية جديدة...');

// إدراج الشركات
const companies = [
  {
    name: 'شركة التقنية المتقدمة',
    email: 'tech@company.com',
    phone: '+966501234567',
    subscription_plan: 'pro',
    max_contests: 5,
    max_participants: 5000,
    max_social_platforms: 10
  },
  {
    name: 'شركة التسويق الرقمي',
    email: 'marketing@company.com',
    phone: '+966502345678',
    subscription_plan: 'enterprise',
    max_contests: 20,
    max_participants: 50000,
    max_social_platforms: 20
  },
  {
    name: 'شركة الإعلام والترفيه',
    email: 'media@company.com',
    phone: '+966503456789',
    subscription_plan: 'pro',
    max_contests: 5,
    max_participants: 5000,
    max_social_platforms: 10
  }
];

const insertCompany = db.prepare(`
  INSERT INTO companies (name, email, phone, subscription_plan, max_contests, max_participants, max_social_platforms, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const companyIds = [];
companies.forEach(company => {
  const result = insertCompany.run(
    company.name,
    company.email,
    company.phone,
    company.subscription_plan,
    company.max_contests,
    company.max_participants,
    company.max_social_platforms,
    new Date().toISOString()
  );
  companyIds.push(result.lastInsertRowid);
});

console.log(`✅ تم إدراج ${companyIds.length} شركات`);

console.log(`✅ تم تخطي إدراج الشبكات الاجتماعية (يتم إدراجها مع المسابقات)`);

// إدراج المسابقات
const contests = [
  {
    company_id: companyIds[0],
    title: 'مسابقة أفضل تطبيق تقني',
    description: 'شارك في مسابقتنا واربح جوائز قيمة للتطبيقات المبتكرة',
    status: 'active',
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    prize_description: 'الجائزة الأولى: 10,000 ريال\nالجائزة الثانية: 5,000 ريال\nالجائزة الثالثة: 2,500 ريال',
    max_participants: 1000,
    rules: 'يجب متابعة صفحتنا على جميع المنصات الاجتماعية والمشاركة في المسابقة'
  },
  {
    company_id: companyIds[1],
    title: 'مسابقة أفضل حملة تسويقية',
    description: 'ابتكر حملة تسويقية مبدعة واربح جوائز حصرية',
    status: 'active',
    end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    prize_description: 'الجائزة الأولى: 20,000 ريال\nالجائزة الثانية: 10,000 ريال\nالجائزة الثالثة: 5,000 ريال',
    max_participants: 2000,
    rules: 'يجب إرسال الحملة التسويقية مع شرح مفصل للاستراتيجية'
  },
  {
    company_id: companyIds[2],
    title: 'مسابقة أفضل محتوى إبداعي',
    description: 'شارك محتواك الإبداعي واربح جوائز مذهلة',
    status: 'active',
    end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    prize_description: 'الجائزة الأولى: 15,000 ريال\nالجائزة الثانية: 7,500 ريال\nالجائزة الثالثة: 3,750 ريال',
    max_participants: 1500,
    rules: 'المحتوى يجب أن يكون أصلياً وغير منسوخ'
  }
];

const insertContest = db.prepare(`
  INSERT INTO contests (company_id, title, description, status, start_date, end_date, prize_description, max_participants, rules, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const contestIds = [];
contests.forEach(contest => {
  const result = insertContest.run(
    contest.company_id,
    contest.title,
    contest.description,
    contest.status,
    new Date().toISOString(),
    contest.end_date,
    contest.prize_description,
    contest.max_participants,
    contest.rules,
    new Date().toISOString()
  );
  contestIds.push(result.lastInsertRowid);
});

console.log(`✅ تم إدراج ${contestIds.length} مسابقات`);

// إدراج المشاركين
const participants = [
  {
    contest_id: contestIds[0],
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501111111',
    city: 'الرياض',
    referral_code: 'AHMED001'
  },
  {
    contest_id: contestIds[0],
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    phone: '+966502222222',
    city: 'جدة',
    referral_code: 'FATIMA001'
  },
  {
    contest_id: contestIds[1],
    name: 'محمود حسن',
    email: 'mahmoud@example.com',
    phone: '+966503333333',
    city: 'الدمام',
    referral_code: 'MAHMOUD001'
  },
  {
    contest_id: contestIds[2],
    name: 'سارة يوسف',
    email: 'sarah@example.com',
    phone: '+966504444444',
    city: 'الرياض',
    referral_code: 'SARAH001'
  }
];

const insertParticipant = db.prepare(`
  INSERT INTO participants (contest_id, name, email, phone, city, referral_code, progress, total_actions, total_shares, total_referrals, registration_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const participantIds = [];
participants.forEach(participant => {
  const result = insertParticipant.run(
    participant.contest_id,
    participant.name,
    participant.email,
    participant.phone,
    participant.city,
    participant.referral_code,
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 5),
    Math.floor(Math.random() * 3),
    new Date().toISOString()
  );
  participantIds.push(result.lastInsertRowid);
});

console.log(`✅ تم إدراج ${participantIds.length} مشاركين`);

// إدراج الفائزين
const winners = [
  {
    contest_id: contestIds[0],
    participant_id: participantIds[0],
    position: 1,
    prize_description: '10,000 ريال'
  },
  {
    contest_id: contestIds[0],
    participant_id: participantIds[1],
    position: 2,
    prize_description: '5,000 ريال'
  },
  {
    contest_id: contestIds[1],
    participant_id: participantIds[2],
    position: 1,
    prize_description: '20,000 ريال'
  },
  {
    contest_id: contestIds[2],
    participant_id: participantIds[3],
    position: 1,
    prize_description: '15,000 ريال'
  }
];

const insertWinner = db.prepare(`
  INSERT INTO winners (contest_id, participant_id, position, prize_description, draw_date, announced)
  VALUES (?, ?, ?, ?, ?, ?)
`);

winners.forEach(winner => {
  insertWinner.run(
    winner.contest_id,
    winner.participant_id,
    winner.position,
    winner.prize_description,
    new Date().toISOString(),
    1
  );
});

console.log(`✅ تم إدراج ${winners.length} فائزين`);

console.log('✨ تم بذر البيانات بنجاح!');
db.close();
