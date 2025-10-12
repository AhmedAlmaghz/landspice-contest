# 🔧 إصلاح سريع للأخطاء

## ❌ الخطأ: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

### السبب:
- API يُرجع HTML بدلاً من JSON
- قاعدة البيانات غير مُهيأة بشكل صحيح
- مجلد `data` غير موجود

---

## ✅ الحل السريع (3 خطوات)

### 1. أنشئ مجلد data
```bash
mkdir data
```

### 2. أنشئ ملف تهيئة قاعدة البيانات
أنشئ ملف: `src/lib/init-db.ts`

```typescript
import { initializeDatabase } from './database';

// Initialize database on server start
if (typeof window === 'undefined') {
  try {
    initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

export {};
```

### 3. استورد في layout.tsx
أضف في أول `src/app/layout.tsx`:

```typescript
import '@/lib/init-db';
```

---

## 🔄 البديل الأسهل

إذا لم ينجح الحل أعلاه، استخدم هذا:

### عدّل `src/lib/database.ts`:

غيّر السطر 4 من:
```typescript
const dbPath = join(process.cwd(), 'data', 'contest.db');
```

إلى:
```typescript
const dbPath = join(process.cwd(), 'contest.db');
```

هذا سيضع قاعدة البيانات في المجلد الرئيسي بدلاً من مجلد `data`.

---

## 🚀 بعد الإصلاح

```bash
# احذف .next
rmdir /s /q .next

# شغّل التطبيق
npm run dev
```

---

## ✅ التحقق من النجاح

افتح: `http://localhost:3000`

يجب أن ترى:
- ✅ الصفحة تحمل بدون أخطاء
- ✅ لا توجد أخطاء في console (F12)
- ✅ نموذج التسجيل يظهر

---

## 🐛 إذا استمر الخطأ

### افتح console المتصفح (F12) وابحث عن:
- أي أخطاء حمراء
- أي طلبات فاشلة (تبويب Network)

### تحقق من terminal الخادم:
- هل هناك أخطاء عند بدء التشغيل؟
- هل قاعدة البيانات تم إنشاؤها؟

---

**الحل الأسرع:** غيّر مسار قاعدة البيانات في `database.ts` كما هو موضح أعلاه! ✨
