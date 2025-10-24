# 🚨 إصلاح عاجل مطلوب - حذف المجلد [id]

**الحالة:** ❌ خطأ في التوجيه  
**السبب:** وجود مسارين ديناميكيين بنفس الاسم

---

## ⚠️ المشكلة

```
Error: You cannot use different slug names for the same dynamic path 
('contestId' !== 'id').
```

---

## 🎯 السبب الجذري

يوجد **مسارين ديناميكيين** في نفس المستوى:

```
src/app/api/v1/contests/
├── [contestId]/  ✅ (الصحيح)
└── [id]/         ❌ (يجب حذفه)
```

Next.js لا يسمح بهذا التضارب.

---

## ✅ الحل الفوري

### الطريقة 1: من VS Code (الأسهل)
1. افتح Explorer
2. انقر بزر الماوس الأيمن على المجلد `[id]`
3. اختر **Delete**
4. أكد الحذف

### الطريقة 2: من Terminal
```bash
# على Windows PowerShell:
Remove-Item -LiteralPath "src\app\api\v1\contests\[id]" -Recurse -Force

# أو Command Prompt:
rmdir /s /q "src\app\api\v1\contests\[id]"
```

### الطريقة 3: يدويا
```
المسار: src\app\api\v1\contests\[id]\
الملفات:
- route.ts (احذفه)
- DELETE_THIS_FOLDER.txt (احذفه)
```

---

## 📊 الحالة الحالية

| المسار | الحالة | الإجراء |
|--------|--------|--------|
| `src/app/api/v1/contests/[contestId]/` | ✅ | احتفظ |
| `src/app/api/v1/contests/[id]/` | ❌ | احذف |

---

## 🚀 بعد الحذف

```bash
npm run dev
```

الخطأ سيختفي تماماً ✅

---

## 📝 الملفات المتأثرة

✅ **تم تحديثها:**
- `src/app/api/v1/contests/[contestId]/route.ts`

❌ **يجب حذفها:**
- `src/app/api/v1/contests/[id]/route.ts`

---

**⏰ هذا الإصلاح ضروري لتشغيل التطبيق!**
