# 👨‍💻 دليل المطورين - LandSpice Contest

## 📋 نظرة عامة

هذا الدليل موجه للمطورين الذين يريدون فهم بنية المشروع والمساهمة فيه.

---

## 🏗️ بنية المشروع

### المجلدات الرئيسية

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # التخطيط الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── globals.css        # الأنماط العامة
│   ├── admin/             # لوحة الإدارة
│   │   └── page.tsx
│   └── api/               # API Routes
│       ├── participants/  # إدارة المشاركين
│       ├── stats/         # الإحصائيات
│       ├── draw/          # السحب العشوائي
│       └── settings/      # الإعدادات
│
├── components/            # المكونات
│   ├── admin/            # مكونات الإدارة (5)
│   │   ├── StatsCard.tsx
│   │   ├── SearchFilter.tsx
│   │   ├── ParticipantsList.tsx
│   │   ├── DrawSystem.tsx
│   │   └── SettingsPanel.tsx
│   ├── RegistrationForm.tsx
│   ├── WelcomeMessage.tsx
│   ├── SocialFollowButton.tsx
│   ├── ProgressTracker.tsx
│   ├── ShareButton.tsx
│   ├── ReferralLinkBox.tsx
│   ├── ShareStats.tsx
│   ├── Notification.tsx
│   ├── NotificationContainer.tsx
│   ├── SocialActions.tsx
│   └── ContestRules.tsx
│
├── contexts/              # React Contexts
│   └── NotificationContext.tsx
│
├── hooks/                 # Custom Hooks
│   ├── useReferralCode.ts
│   ├── useFollowProgress.ts
│   └── useNotification.ts
│
├── lib/                   # المكتبات والأدوات
│   ├── database.ts       # إعداد قاعدة البيانات
│   ├── init-db.ts        # تهيئة القاعدة
│   ├── validation.ts     # التحقق من البيانات
│   ├── socialPlatforms.ts # بيانات المنصات
│   └── shareUtils.ts     # دوال المشاركة
│
└── types/                 # TypeScript Types
    └── index.ts
```

---

## 🔧 التقنيات المستخدمة

### Frontend
- **Next.js 15.5.4** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Backend API
- **SQLite** - Database
- **better-sqlite3** - SQLite driver

### State Management
- **Context API** - Global state
- **Custom Hooks** - Reusable logic

---

## 📦 المكونات الرئيسية

### 1. RegistrationForm
**الموقع:** `src/components/RegistrationForm.tsx`

**الوظيفة:** نموذج تسجيل المشاركين

**Props:**
```typescript
interface RegistrationFormProps {
  onSuccess: (participant: Participant) => void;
}
```

**الميزات:**
- تحقق من البيانات
- استخراج كود الإحالة من URL
- إرسال البيانات إلى API
- عرض الإشعارات

---

### 2. SocialFollowButton
**الموقع:** `src/components/SocialFollowButton.tsx`

**الوظيفة:** زر متابعة منصة اجتماعية

**Props:**
```typescript
interface SocialFollowButtonProps {
  platform: SocialPlatform;
  participant: Participant;
  onFollow: (platform: string) => void;
  isFollowed: boolean;
}
```

**الميزات:**
- فتح رابط المنصة
- نافذة تأكيد
- تحديث الحالة
- إشعار نجاح

---

### 3. NotificationContext
**الموقع:** `src/contexts/NotificationContext.tsx`

**الوظيفة:** إدارة الإشعارات عالمياً

**API:**
```typescript
const { showNotification } = useNotification();

showNotification({
  type: 'success',
  message: 'تم بنجاح!',
  duration: 5000
});
```

**الأنواع:**
- `success` - نجاح (أخضر)
- `error` - خطأ (أحمر)
- `warning` - تحذير (أصفر)
- `info` - معلومات (أزرق)

---

## 🗄️ قاعدة البيانات

### الجداول

#### 1. participants
```sql
CREATE TABLE participants (
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
);
```

#### 2. social_actions
```sql
CREATE TABLE social_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants (id)
);
```

#### 3. contest_settings
```sql
CREATE TABLE contest_settings (
  id INTEGER PRIMARY KEY,
  contest_title TEXT,
  contest_end_date TEXT,
  prize_description TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  facebook_channel_url TEXT
);
```

#### 4. winners
```sql
CREATE TABLE winners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id INTEGER NOT NULL,
  draw_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  prize_description TEXT,
  FOREIGN KEY (participant_id) REFERENCES participants (id)
);
```

---

## 🔌 API Routes

### POST /api/participants
**الوظيفة:** تسجيل مشارك جديد

**Body:**
```json
{
  "name": "محمد أحمد",
  "email": "test@example.com",
  "phone": "712345678",
  "city": "صنعاء",
  "referredBy": "LS12345678"
}
```

**Response:**
```json
{
  "success": true,
  "participant": {
    "id": 1,
    "name": "محمد أحمد",
    "referral_code": "LS87654321",
    ...
  }
}
```

---

### GET /api/participants
**الوظيفة:** جلب جميع المشاركين

**Response:**
```json
{
  "participants": [...]
}
```

---

### POST /api/participants/[id]/progress
**الوظيفة:** تحديث تقدم المشارك

**Body:**
```json
{
  "platform": "facebook",
  "action": "follow"
}
```

---

### GET /api/stats
**الوظيفة:** جلب الإحصائيات

**Response:**
```json
{
  "stats": {
    "total": 150,
    "completed": 45,
    "total_shares": 320,
    "total_referrals": 78
  }
}
```

---

### POST /api/draw
**الوظيفة:** إجراء سحب عشوائي

**Body:**
```json
{
  "count": 3,
  "minProgress": 50
}
```

---

## 🎨 التصميم

### نظام الألوان

```css
:root {
  --primary: #7c3aed;      /* بنفسجي */
  --primary-dark: #6d28d9;
  --secondary: #3b82f6;    /* أزرق */
  --accent: #ec4899;       /* وردي */
}
```

### الرسوم المتحركة

```css
/* Float Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Gradient Shift */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Glow */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.5); }
  50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.8); }
}
```

---

## 🧪 الاختبار

### اختبار محلي
```bash
npm run dev
```

### اختبار البناء
```bash
npm run build
npm start
```

### اختبار الوحدات (قادم)
```bash
npm test
```

---

## 🔐 الأمان

### 1. التحقق من البيانات
```typescript
// lib/validation.ts
export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string) {
  // أرقام يمنية: 9 أرقام تبدأ بـ 7
  const phoneRegex = /^7[0-9]{8}$/;
  return phoneRegex.test(phone);
}
```

### 2. تنظيف المدخلات
```typescript
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
```

### 3. حماية API
```typescript
// middleware (قادم)
export function authenticate(req: Request) {
  // التحقق من الصلاحيات
}
```

---

## 📝 أفضل الممارسات

### 1. المكونات
- استخدم TypeScript types
- اجعل المكونات قابلة لإعادة الاستخدام
- اتبع مبدأ المسؤولية الواحدة

### 2. الحالة
- استخدم Context للحالة العامة
- استخدم Hooks للمنطق القابل لإعادة الاستخدام
- تجنب prop drilling

### 3. الأداء
- استخدم React.memo للمكونات الثقيلة
- استخدم useMemo و useCallback
- حسّن الصور

### 4. الكود
- اتبع ESLint rules
- اكتب تعليقات واضحة
- استخدم أسماء واضحة

---

## 🚀 المساهمة

### 1. Fork المشروع
```bash
git clone YOUR_FORK
cd landspice-contest
```

### 2. إنشاء branch
```bash
git checkout -b feature/new-feature
```

### 3. التطوير
```bash
npm install
npm run dev
```

### 4. Commit
```bash
git add .
git commit -m "Add new feature"
```

### 5. Push
```bash
git push origin feature/new-feature
```

### 6. Pull Request
- افتح PR على GitHub
- اشرح التغييرات
- انتظر المراجعة

---

## 📚 موارد إضافية

### التوثيق
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### الأدوات
- [VS Code](https://code.visualstudio.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com) - لاختبار API

---

## 🐛 الإبلاغ عن الأخطاء

إذا وجدت خطأ:
1. تحقق من Issues الموجودة
2. أنشئ Issue جديد
3. اشرح المشكلة بالتفصيل
4. أضف screenshots إن أمكن

---

## 💡 الأفكار والاقتراحات

نرحب بالأفكار! افتح Issue مع:
- وصف الفكرة
- الفائدة المتوقعة
- مثال على الاستخدام

---

**تاريخ الإعداد:** 2025-10-07  
**الإصدار:** 1.0.3  
**الحالة:** ✅ جاهز للتطوير
