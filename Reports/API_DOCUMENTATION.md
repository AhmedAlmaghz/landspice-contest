# 📡 توثيق API - LandSpice Contest

## نظرة عامة

جميع endpoints تستخدم JSON للطلبات والاستجابات.

**Base URL:** `http://your-domain.com/api`

---

## 🔐 المصادقة

حالياً لا يوجد مصادقة. في الإنتاج، أضف:
- JWT tokens
- API keys
- Session-based auth

---

## 📋 Endpoints

### 1. المشاركين

#### POST /api/participants
**الوصف:** تسجيل مشارك جديد

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

**Response (200):**
```json
{
  "success": true,
  "participant": {
    "id": 1,
    "name": "محمد أحمد",
    "email": "test@example.com",
    "phone": "712345678",
    "city": "صنعاء",
    "referral_code": "LS87654321",
    "progress": 0,
    "shares": 0
  }
}
```

**Errors:**
- `400` - بيانات غير صحيحة
- `409` - البريد موجود مسبقاً
- `500` - خطأ في الخادم

---

#### GET /api/participants
**الوصف:** جلب جميع المشاركين

**Response (200):**
```json
{
  "participants": [
    {
      "id": 1,
      "name": "محمد أحمد",
      "email": "test@example.com",
      "progress": 50,
      "shares": 5
    }
  ]
}
```

---

#### POST /api/participants/[id]/progress
**الوصف:** تحديث تقدم المشارك

**Body:**
```json
{
  "platform": "facebook",
  "action": "follow"
}
```

**Response (200):**
```json
{
  "success": true,
  "progress": 16.67,
  "message": "تم تحديث التقدم"
}
```

---

### 2. الإحصائيات

#### GET /api/stats
**الوصف:** جلب إحصائيات المسابقة

**Response (200):**
```json
{
  "stats": {
    "total": 150,
    "completed": 45,
    "total_shares": 320,
    "total_referrals": 78,
    "by_city": {
      "صنعاء": 50,
      "عدن": 40,
      "تعز": 30
    }
  }
}
```

---

### 3. السحب

#### POST /api/draw
**الوصف:** إجراء سحب عشوائي

**Body:**
```json
{
  "count": 3,
  "minProgress": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "winners": [
    {
      "id": 15,
      "name": "محمد أحمد",
      "email": "test@example.com",
      "progress": 100
    }
  ]
}
```

**Errors:**
- `400` - عدد غير صحيح
- `404` - لا يوجد مشاركون مؤهلون

---

#### POST /api/draw/save
**الوصف:** حفظ الفائزين

**Body:**
```json
{
  "winners": [1, 5, 10],
  "prizeDescription": "جوائز قيمة"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم حفظ الفائزين"
}
```

---

### 4. الإعدادات

#### GET /api/settings
**الوصف:** جلب إعدادات المسابقة

**Response (200):**
```json
{
  "settings": {
    "contest_title": "مسابقة LandSpice",
    "prize_description": "جوائز قيمة",
    "end_date": "2025-12-31",
    "facebook_url": "https://facebook.com/LandSpice25",
    "instagram_url": "https://instagram.com/LandSpice25"
  }
}
```

---

#### POST /api/settings
**الوصف:** تحديث الإعدادات

**Body:**
```json
{
  "contest_title": "مسابقة جديدة",
  "prize_description": "جوائز محدثة",
  "end_date": "2025-12-31"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث الإعدادات"
}
```

---

### 5. النشر

#### POST /api/publish
**الوصف:** نشر أو جدولة منشور

**Body:**
```json
{
  "content": "نص المنشور",
  "platforms": ["facebook", "twitter"],
  "scheduleDate": "2025-10-08T10:00:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم جدولة النشر بنجاح",
  "record": {
    "id": 1,
    "content": "نص المنشور",
    "platforms": ["facebook", "twitter"],
    "status": "scheduled"
  }
}
```

---

#### GET /api/publish
**الوصف:** جلب سجل النشر

**Response (200):**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "content": "نص المنشور",
      "platforms": ["facebook"],
      "status": "published",
      "createdAt": "2025-10-07T10:00:00Z"
    }
  ]
}
```

---

## 📊 أكواد الحالة

- `200` - نجح الطلب
- `201` - تم الإنشاء بنجاح
- `400` - طلب غير صحيح
- `401` - غير مصرح
- `404` - غير موجود
- `409` - تعارض (مثل: البريد موجود)
- `429` - تجاوز الحد المسموح
- `500` - خطأ في الخادم

---

## 🔒 Rate Limiting

- **الحد الأقصى:** 10 طلبات في الدقيقة
- **Header:** `X-RateLimit-Remaining`
- **عند التجاوز:** `429 Too Many Requests`

---

## 📝 ملاحظات

### التحقق من البيانات:
- **البريد:** يجب أن يكون صحيحاً
- **الهاتف:** 9 أرقام تبدأ بـ 7
- **الاسم:** 2-100 حرف
- **المدينة:** 2-50 حرف

### الأمان:
- جميع المدخلات يتم تنظيفها
- حماية من SQL injection
- حماية من XSS

---

## 🧪 أمثلة

### JavaScript (Fetch):
```javascript
// تسجيل مشارك
const response = await fetch('/api/participants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'محمد أحمد',
    email: 'test@example.com',
    phone: '712345678',
    city: 'صنعاء'
  })
});

const data = await response.json();
console.log(data);
```

### cURL:
```bash
# جلب الإحصائيات
curl http://localhost:3000/api/stats

# تسجيل مشارك
curl -X POST http://localhost:3000/api/participants \
  -H "Content-Type: application/json" \
  -d '{"name":"محمد","email":"test@example.com","phone":"712345678","city":"صنعاء"}'
```

---

**تاريخ التحديث:** 2025-10-07  
**الإصدار:** 1.0.5
