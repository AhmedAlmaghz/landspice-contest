import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/participants
 * البحث عن المشاركين
 */
export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '50');

    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'contest.db');
    const db = new Database(dbPath);

    let query = `
      SELECT id, name, email, phone, city, referral_code, progress, registration_date
      FROM participants
    `;

    let countQuery = `SELECT COUNT(*) as total FROM participants`;
    let params: any[] = [];

    if (search) {
      const searchTerm = `%${search}%`;
      query += ` WHERE name LIKE ? OR email LIKE ? OR city LIKE ?`;
      countQuery += ` WHERE name LIKE ? OR email LIKE ? OR city LIKE ?`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, (page - 1) * pageSize);

    const participants = db.prepare(query).all(...params);
    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const { total } = db.prepare(countQuery).get(...countParams) as any;

    db.close();

    return NextResponse.json({
      success: true,
      data: participants,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في البحث',
      },
      { status: 500 }
    );
  }
}
