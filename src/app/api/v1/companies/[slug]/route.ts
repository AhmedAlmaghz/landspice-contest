import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // البحث عن الشركة باستخدام الـ slug (يمكن أن يكون الاسم أو المعرف)
    const company = db.prepare(`
      SELECT * FROM companies 
      WHERE LOWER(name) = LOWER(?) OR id = ?
      LIMIT 1
    `).get(slug, parseInt(slug) || -1);

    if (!company) {
      return NextResponse.json(
        { error: 'الشركة غير موجودة' },
        { status: 404 }
      );
    }

    // جلب مسابقات الشركة
    const contests = db.prepare(`
      SELECT * FROM contests 
      WHERE company_id = ?
      ORDER BY created_at DESC
    `).all((company as any).id);

    // جلب الفائزين من مسابقات الشركة
    const winners = db.prepare(`
      SELECT w.*, p.name, p.city 
      FROM winners w
      JOIN participants p ON w.participant_id = p.id
      JOIN contests c ON w.contest_id = c.id
      WHERE c.company_id = ?
      ORDER BY w.position ASC
    `).all((company as any).id);

    return NextResponse.json({
      success: true,
      company,
      contests,
      winners
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات الشركة' },
      { status: 500 }
    );
  }
}
