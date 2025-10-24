import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';
import { validateEmail } from '@/lib/validation';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // التحقق من البيانات المطلوبة
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة' },
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

    // التحقق من عدم تكرار البريد الإلكتروني
    const existingCompany = db.prepare(
      'SELECT id FROM companies WHERE email = ?'
    ).get(data.email);

    if (existingCompany) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء شركة جديدة
    const result = db.prepare(`
      INSERT INTO companies (name, email, phone, subscription_plan, max_contests, max_participants, max_social_platforms, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.email,
      data.phone,
      data.subscription_plan || 'free',
      data.subscription_plan === 'pro' ? 5 : (data.subscription_plan === 'enterprise' ? 20 : 1),
      data.subscription_plan === 'pro' ? 5000 : (data.subscription_plan === 'enterprise' ? 50000 : 500),
      data.subscription_plan === 'pro' ? 10 : (data.subscription_plan === 'enterprise' ? 20 : 5),
      new Date().toISOString()
    );

    const companyId = result.lastInsertRowid as number;

    // إنشاء كلمة مرور عشوائية للمسؤول
    const adminPassword = Math.random().toString(36).substring(2, 10);

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الشركة بنجاح',
      company: {
        id: companyId,
        name: data.name,
        email: data.email,
        subscription_plan: data.subscription_plan || 'free'
      },
      adminCredentials: {
        email: data.email,
        password: adminPassword
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error registering company:', error);
    
    // معالجة خطأ UNIQUE constraint
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      if (error.message.includes('companies.name')) {
        return NextResponse.json(
          { error: 'اسم الشركة موجود بالفعل' },
          { status: 400 }
        );
      }
      if (error.message.includes('companies.email')) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مسجل بالفعل' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الشركة' },
      { status: 500 }
    );
  }
}
