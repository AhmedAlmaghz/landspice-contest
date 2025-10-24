# 🚀 دليل النشر - LandSpice Contest

## 📋 نظرة عامة

هذا الدليل يساعدك على نشر تطبيق LandSpice Contest على الإنترنت.

---

## ✅ قبل النشر

### 1. التحقق من جاهزية التطبيق

```bash
# اختبر التطبيق محلياً
npm run dev

# تأكد من عدم وجود أخطاء
# افتح http://localhost:3000
# اختبر جميع الوظائف
```

### 2. بناء التطبيق

```bash
# بناء للإنتاج
npm run build

# اختبار البناء
npm start
```

---

## 🌐 خيارات النشر

### الخيار 1: Vercel (موصى به) ⭐

**المميزات:**
- ✅ مجاني للمشاريع الصغيرة
- ✅ نشر تلقائي من Git
- ✅ SSL مجاني
- ✅ CDN عالمي
- ✅ دعم Next.js الكامل

**الخطوات:**

1. **إنشاء حساب على Vercel**
   - اذهب إلى https://vercel.com
   - سجل دخول بـ GitHub

2. **رفع المشروع إلى GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

3. **استيراد المشروع في Vercel**
   - اضغط "New Project"
   - اختر المستودع
   - اضغط "Deploy"

4. **إعدادات البيئة (اختياري)**
   ```env
   DATABASE_PATH=./contest.db
   NODE_ENV=production
   ```

5. **النشر**
   - Vercel ينشر تلقائياً
   - ستحصل على رابط مثل: `your-app.vercel.app`

---

### الخيار 2: Netlify

**الخطوات:**

1. **إنشاء حساب على Netlify**
   - https://netlify.com

2. **إعداد ملف netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **النشر**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

### الخيار 3: VPS (خادم خاص)

**المتطلبات:**
- خادم Linux (Ubuntu 20.04+)
- Node.js 18+
- Nginx
- PM2

**الخطوات:**

1. **تثبيت المتطلبات**
   ```bash
   # تحديث النظام
   sudo apt update && sudo apt upgrade -y

   # تثبيت Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # تثبيت PM2
   sudo npm install -g pm2

   # تثبيت Nginx
   sudo apt install -y nginx
   ```

2. **رفع المشروع**
   ```bash
   # على الخادم
   cd /var/www
   git clone YOUR_REPO landspice-contest
   cd landspice-contest
   npm install
   npm run build
   ```

3. **إعداد PM2**
   ```bash
   # إنشاء ملف ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'landspice-contest',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/landspice-contest',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }

   # تشغيل التطبيق
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **إعداد Nginx**
   ```nginx
   # /etc/nginx/sites-available/landspice-contest
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # تفعيل الموقع
   sudo ln -s /etc/nginx/sites-available/landspice-contest /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL مع Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🗄️ قاعدة البيانات

### للإنتاج:

**الخيار 1: SQLite (الحالي)**
- ✅ بسيط وسريع
- ⚠️ غير مناسب للتطبيقات الكبيرة
- ⚠️ يحتاج backup منتظم

**الخيار 2: PostgreSQL (موصى به للإنتاج)**
```bash
# تثبيت PostgreSQL
sudo apt install postgresql

# إنشاء قاعدة بيانات
sudo -u postgres psql
CREATE DATABASE landspice_contest;
CREATE USER landspice WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE landspice_contest TO landspice;
```

---

## 🔒 الأمان

### 1. متغيرات البيئة
```env
# .env.production
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ADMIN_PASSWORD=your_admin_password
```

### 2. تأمين لوحة الإدارة
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // إضافة authentication
    const auth = request.headers.get('authorization');
    if (!auth) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
}
```

### 3. Rate Limiting
```typescript
// lib/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد أقصى 100 طلب
});
```

---

## 📊 المراقبة

### 1. Logs
```bash
# PM2 logs
pm2 logs landspice-contest

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Monitoring
```bash
# PM2 monitoring
pm2 monit

# أو استخدم خدمات مثل:
# - Vercel Analytics
# - Google Analytics
# - Sentry (للأخطاء)
```

---

## 🔄 التحديثات

### على Vercel:
```bash
# فقط ادفع للـ Git
git add .
git commit -m "Update"
git push
# Vercel ينشر تلقائياً
```

### على VPS:
```bash
cd /var/www/landspice-contest
git pull
npm install
npm run build
pm2 restart landspice-contest
```

---

## 💾 النسخ الاحتياطي

### قاعدة البيانات:
```bash
# SQLite
cp contest.db contest.db.backup

# PostgreSQL
pg_dump landspice_contest > backup.sql

# جدولة backup يومي
crontab -e
# أضف:
0 2 * * * cp /var/www/landspice-contest/contest.db /backups/contest-$(date +\%Y\%m\%d).db
```

---

## 🧪 الاختبار بعد النشر

### 1. الصفحة الرئيسية
- [ ] تحمل بدون أخطاء
- [ ] التصميم يظهر بشكل صحيح
- [ ] النموذج يعمل

### 2. التسجيل
- [ ] يمكن التسجيل بنجاح
- [ ] الإشعارات تظهر
- [ ] البيانات تُحفظ

### 3. المتابعة
- [ ] الأزرار تعمل
- [ ] النوافذ تفتح
- [ ] التقدم يتحدث

### 4. لوحة الإدارة
- [ ] يمكن الوصول لـ /admin
- [ ] الإحصائيات تظهر
- [ ] السحب يعمل

---

## 🎯 نصائح الأداء

### 1. تحسين الصور
```bash
npm install sharp
# Next.js يحسن الصور تلقائياً
```

### 2. Caching
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 3. CDN
- استخدم Vercel CDN (تلقائي)
- أو Cloudflare

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع logs الخادم
2. تحقق من console المتصفح
3. راجع TROUBLESHOOTING.md

---

## ✅ قائمة التحقق النهائية

قبل الإطلاق:
- [ ] اختبار شامل محلياً
- [ ] تحديث روابط المنصات
- [ ] تحديث وصف الجوائز
- [ ] تحديث تاريخ الانتهاء
- [ ] إعداد النسخ الاحتياطي
- [ ] تأمين لوحة الإدارة
- [ ] اختبار على الإنتاج
- [ ] إعداد المراقبة

---

**التطبيق جاهز للنشر!** 🚀

**تاريخ الإعداد:** 2025-10-07  
**الإصدار:** 1.0.3
