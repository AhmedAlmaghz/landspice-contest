import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { validateEmail, sanitizeInput, generateReferralCode } from '@/lib/validation';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // التحقق من البيانات المطلوبة
    if (!data.name || !data.email || !data.phone || !data.city) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني ورقم الهاتف والمدينة مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(data.email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // تنظيف البيانات
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      city: sanitizeInput(data.city),
      referredBy: data.referredBy ? sanitizeInput(data.referredBy) : undefined
    };

    // الحصول على المسابقات المتاحة
    const contests = db.prepare(
      'SELECT id FROM contests WHERE status = ? LIMIT 10'
    ).all('active') as { id: number }[];

    if (contests.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد مسابقات متاحة حالياً' },
        { status: 400 }
      );
    }

    // إنشاء رمز إحالة فريد
    let referralCode = generateReferralCode();
    let attempts = 0;
    while (
      db.prepare('SELECT id FROM participants WHERE referral_code = ?').get(referralCode) &&
      attempts < 10
    ) {
      referralCode = generateReferralCode();
      attempts++;
    }

    // إدراج المشارك في جميع المسابقات النشطة
    const participantIds: number[] = [];
    
    for (const contest of contests) {
      // التحقق من عدم تسجيل المشارك مسبقاً في هذه المسابقة
      const existing = db.prepare(
        'SELECT id FROM participants WHERE contest_id = ? AND email = ?'
      ).get(contest.id, sanitizedData.email);

      if (!existing) {
        const result = db.prepare(`
          INSERT INTO participants (contest_id, name, email, phone, city, referral_code, referred_by, progress, total_actions, total_shares, registration_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          contest.id,
          sanitizedData.name,
          sanitizedData.email,
          sanitizedData.phone,
          sanitizedData.city,
          referralCode,
          sanitizedData.referredBy || null,
          0,
          0,
          0,
          new Date().toISOString()
        );

        participantIds.push(result.lastInsertRowid as number);
      }
    }

    if (participantIds.length === 0) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في جميع المسابقات المتاحة' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `تم التسجيل بنجاح في ${participantIds.length} مسابقة`,
      participant: {
        ids: participantIds,
        name: sanitizedData.name,
        email: sanitizedData.email,
        referral_code: referralCode,
        contests_count: participantIds.length
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering participant:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل المشارك' },
      { status: 500 }
    );
  }
}
