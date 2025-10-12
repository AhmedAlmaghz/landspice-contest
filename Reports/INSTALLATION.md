# 📦 دليل التثبيت - LandSpice Contest

## 🎯 المتطلبات

### البرامج المطلوبة:
- **Node.js:** 18.0.0 أو أحدث
- **npm:** 9.0.0 أو أحدث (يأتي مع Node.js)
- **Git:** لاستنساخ المشروع

### التحقق من التثبيت:
```bash
node --version  # يجب أن يكون >= 18.0.0
npm --version   # يجب أن يكون >= 9.0.0
git --version
```

---

## 📥 التثبيت

### 1. استنساخ المشروع

```bash
# باستخدام HTTPS
git clone https://github.com/YOUR_USERNAME/landspice-contest.git

# أو باستخدام SSH
git clone git@github.com:YOUR_USERNAME/landspice-contest.git

# الانتقال للمجلد
cd landspice-contest
```

### 2. تثبيت التبعيات

```bash
npm install
```

هذا سيثبت جميع الحزم المطلوبة:
- Next.js 15.5.4
- React 19.1.0
- TypeScript 5
- Tailwind CSS v4
- better-sqlite3
- Lucide React
- وغيرها...

### 3. إعداد البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env

# تحرير الملف
nano .env  # أو استخدم محرر نصوص آخر
```

**محتوى .env:**
```env
DATABASE_PATH=./contest.db
NODE_ENV=development
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CONTEST_TITLE=مسابقة LandSpice
NEXT_PUBLIC_CONTEST_URL=http://localhost:3000
```

### 4. تهيئة قاعدة البيانات

قاعدة البيانات تُنشأ تلقائياً عند أول تشغيل، لكن يمكنك تهيئتها يدوياً:

```bash
npm run db:init
```

---

## 🚀 التشغيل

### وضع التطوير:

```bash
npm run dev
```

سيعمل التطبيق على: `http://localhost:3000`

### البناء للإنتاج:

```bash
# بناء التطبيق
npm run build

# تشغيل النسخة المبنية
npm start
```

---

## 🔧 السكريبتات المتاحة

```bash
# التطوير
npm run dev          # تشغيل في وضع التطوير

# البناء
npm run build        # بناء للإنتاج
npm start            # تشغيل النسخة المبنية

# قاعدة البيانات
npm run db:init      # تهيئة قاعدة البيانات
npm run db:reset     # إعادة تعيين القاعدة

# الاختبار
npm test             # تشغيل الاختبارات
npm run lint         # فحص الكود

# التنظيف
npm run clean        # حذف .next و node_modules
```

---

## 📁 هيكل المشروع بعد التثبيت

```
landspice-contest/
├── node_modules/          # التبعيات (تُنشأ بعد npm install)
├── .next/                 # ملفات البناء (تُنشأ بعد npm run build)
├── contest.db             # قاعدة البيانات (تُنشأ تلقائياً)
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── .env                   # متغيرات البيئة (أنشئه يدوياً)
├── package.json
└── ...
```

---

## ✅ التحقق من التثبيت

### 1. تشغيل التطبيق:
```bash
npm run dev
```

### 2. افتح المتصفح:
- الصفحة الرئيسية: `http://localhost:3000`
- لوحة الإدارة: `http://localhost:3000/admin`

### 3. اختبر الوظائف:
- ✅ التسجيل يعمل
- ✅ قاعدة البيانات تحفظ البيانات
- ✅ لوحة الإدارة تظهر

---

## 🐛 حل المشاكل الشائعة

### المشكلة: `npm install` يفشل

**الحل:**
```bash
# امسح cache
npm cache clean --force

# حاول مرة أخرى
npm install
```

### المشكلة: `better-sqlite3` لا يعمل

**الحل (Windows):**
```bash
# ثبت build tools
npm install --global windows-build-tools

# أعد تثبيت better-sqlite3
npm rebuild better-sqlite3
```

**الحل (Linux/Mac):**
```bash
# ثبت build essentials
sudo apt-get install build-essential  # Ubuntu/Debian
brew install gcc                       # macOS

# أعد تثبيت better-sqlite3
npm rebuild better-sqlite3
```

### المشكلة: Port 3000 مستخدم

**الحل:**
```bash
# استخدم port آخر
PORT=3001 npm run dev
```

### المشكلة: قاعدة البيانات لا تُنشأ

**الحل:**
```bash
# أنشئها يدوياً
npm run db:init

# أو أعد تعيينها
npm run db:reset
```

---

## 🔄 التحديث

### تحديث التبعيات:

```bash
# تحقق من التحديثات المتاحة
npm outdated

# حدّث جميع الحزم
npm update

# أو حدّث حزمة محددة
npm update next
```

### تحديث Next.js:

```bash
npm install next@latest react@latest react-dom@latest
```

---

## 🗑️ إلغاء التثبيت

```bash
# احذف المجلد بالكامل
cd ..
rm -rf landspice-contest

# أو استخدم
npm run clean  # ثم احذف المجلد
```

---

## 📚 الخطوات التالية

بعد التثبيت الناجح:

1. ✅ راجع `QUICK_START.md` للبدء السريع
2. ✅ راجع `USER_GUIDE.md` لفهم الوظائف
3. ✅ راجع `DEVELOPER_GUIDE.md` للتطوير
4. ✅ راجع `DEPLOYMENT_GUIDE.md` للنشر

---

## 🆘 الدعم

إذا واجهت مشاكل:
1. راجع `TROUBLESHOOTING.md`
2. افتح Issue على GitHub
3. راجع التوثيق الكامل

---

**تاريخ التحديث:** 2025-10-07  
**الإصدار:** 1.0.5
