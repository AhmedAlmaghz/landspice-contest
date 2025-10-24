import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'contest.db');
const db = new Database(dbPath);

// الشبكات الاجتماعية المتاحة (من قبل الإدارة)
const AVAILABLE_PLATFORMS = [
  { id: 1, name: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { id: 2, name: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { id: 3, name: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { id: 4, name: 'TikTok', icon: 'tiktok', color: '#000000' },
  { id: 5, name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
  { id: 6, name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
  { id: 7, name: 'Telegram', icon: 'telegram', color: '#0088cc' },
  { id: 8, name: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
];

// الحصول على الشبكات المتاحة
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      platforms: AVAILABLE_PLATFORMS
    });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الشبكات الاجتماعية' },
      { status: 500 }
    );
  }
}

// إضافة شبكة اجتماعية للمسابقة
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.contest_id || !data.platform_name || !data.platform_url) {
      return NextResponse.json(
        { error: 'معرف المسابقة واسم المنصة والرابط مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من أن المسابقة موجودة
    const contest = db.prepare('SELECT id FROM contests WHERE id = ?').get(data.contest_id);
    if (!contest) {
      return NextResponse.json(
        { error: 'المسابقة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من عدم تكرار المنصة في نفس المسابقة
    const existing = db.prepare(
      'SELECT id FROM social_platforms WHERE contest_id = ? AND platform_name = ?'
    ).get(data.contest_id, data.platform_name);

    if (existing) {
      return NextResponse.json(
        { error: 'هذه المنصة موجودة بالفعل في المسابقة' },
        { status: 400 }
      );
    }

    // الحصول على أعلى موضع
    const maxPosition = db.prepare(
      'SELECT MAX(position) as max_pos FROM social_platforms WHERE contest_id = ?'
    ).get(data.contest_id) as { max_pos: number | null };

    const position = (maxPosition.max_pos || 0) + 1;

    // إنشاء منصة جديدة
    const result = db.prepare(`
      INSERT INTO social_platforms (contest_id, platform_name, platform_url, action_type, verification_type, position, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.contest_id,
      data.platform_name,
      data.platform_url,
      data.action_type || 'follow',
      data.verification_type || 'automatic',
      position,
      true,
      new Date().toISOString()
    );

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنصة بنجاح',
      platform: {
        id: result.lastInsertRowid,
        contest_id: data.contest_id,
        platform_name: data.platform_name,
        platform_url: data.platform_url,
        position
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating platform:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إضافة المنصة' },
      { status: 500 }
    );
  }
}
