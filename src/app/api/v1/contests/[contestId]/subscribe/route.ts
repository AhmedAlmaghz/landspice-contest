import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    const { contestId } = await params;
    const body = await request.json();
    const { participantId, participantName, participantEmail, participantPhone, participantCity } = body;

    // التحقق من المسابقة
    const contest = db.prepare(`
      SELECT * FROM contests WHERE id = ?
    `).get(parseInt(contestId) || -1);

    if (!contest) {
      return NextResponse.json(
        { error: 'المسابقة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من عدم الاشتراك المسبق
    const existingParticipant = db.prepare(`
      SELECT * FROM participants 
      WHERE contest_id = ? AND email = ?
    `).get(parseInt(contestId), participantEmail);

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'أنت مشترك بالفعل في هذه المسابقة' },
        { status: 400 }
      );
    }

    // إضافة المشارك للمسابقة
    const result = db.prepare(`
      INSERT INTO participants (
        contest_id, name, email, phone, city, 
        referral_code, progress, total_actions, 
        total_shares, registration_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      parseInt(contestId),
      participantName,
      participantEmail,
      participantPhone,
      participantCity,
      Math.random().toString(36).substring(2, 10).toUpperCase(),
      0,
      0,
      0,
      new Date().toISOString()
    );

    return NextResponse.json({
      success: true,
      message: 'تم الاشتراك في المسابقة بنجاح',
      participant: {
        id: result.lastInsertRowid,
        contest_id: parseInt(contestId),
        name: participantName,
        email: participantEmail,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error subscribing to contest:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ في الاشتراك' },
      { status: 500 }
    );
  }
}
