// src/app/api/v1/contests/route.ts
// API Endpoints لإدارة المسابقات

import { NextRequest, NextResponse } from 'next/server';
import { contestService } from '@/services/ContestService';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { ValidationError, getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/contests
 * إنشاء مسابقة جديدة
 */
export async function POST(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    // التحقق من الصلاحيات
    if (!user.permissions.includes(PERMISSIONS.CREATE_CONTEST)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لإنشاء مسابقة' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // التحقق من البيانات المطلوبة
    if (!data.title || !data.start_date || !data.end_date) {
      throw new ValidationError('العنوان وتاريخ البداية والنهاية مطلوبة');
    }

    // إنشاء المسابقة
    const contest = await contestService.createContest(user.company_id, data);

    return NextResponse.json(
      {
        success: true,
        data: contest,
        message: 'تم إنشاء المسابقة بنجاح',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = getErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.message,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * GET /api/v1/contests
 * جلب مسابقات الشركة أو البحث عن المسابقات
 */
export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '50');
    const status = req.nextUrl.searchParams.get('status');

    // إذا كان هناك بحث، لا نحتاج للمصادقة
    if (search) {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'contest.db');
      const db = new Database(dbPath);

      const searchTerm = `%${search}%`;
      let query = `
        SELECT c.id, c.title, c.description, c.status, c.end_date, c.prize_description, c.max_participants, comp.name as company_name
        FROM contests c
        JOIN companies comp ON c.company_id = comp.id
        WHERE c.title LIKE ? OR c.description LIKE ? OR comp.name LIKE ?
      `;

      let countQuery = `
        SELECT COUNT(*) as total FROM contests c
        JOIN companies comp ON c.company_id = comp.id
        WHERE c.title LIKE ? OR c.description LIKE ? OR comp.name LIKE ?
      `;

      if (status) {
        query += ` AND c.status = ?`;
        countQuery += ` AND c.status = ?`;
      }

      query += ` LIMIT ? OFFSET ?`;

      const params = status 
        ? [searchTerm, searchTerm, searchTerm, status, pageSize, (page - 1) * pageSize]
        : [searchTerm, searchTerm, searchTerm, pageSize, (page - 1) * pageSize];

      const contests = db.prepare(query).all(...params);
      
      const countParams = status
        ? [searchTerm, searchTerm, searchTerm, status]
        : [searchTerm, searchTerm, searchTerm];
      const { total } = db.prepare(countQuery).get(...countParams) as any;

      db.close();

      return NextResponse.json({
        success: true,
        data: contests,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    // التحقق من المصادقة للحصول على مسابقات الشركة
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    // التحقق من الصلاحيات
    if (!user.permissions.includes(PERMISSIONS.VIEW_CONTEST)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    // جلب المسابقات من قاعدة البيانات
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'contest.db');
    const db = new Database(dbPath);

    let query = `
      SELECT id, title, description, status, end_date, prize_description, max_participants
      FROM contests
      WHERE company_id = ?
    `;

    let countQuery = `SELECT COUNT(*) as total FROM contests WHERE company_id = ?`;
    const params = [user.company_id];

    if (status) {
      query += ` AND status = ?`;
      countQuery += ` AND status = ?`;
      params.push(status);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, (page - 1) * pageSize);

    const contests = db.prepare(query).all(...params);
    const countParams = status ? [user.company_id, status] : [user.company_id];
    const { total } = db.prepare(countQuery).get(...countParams) as any;

    db.close();

    return NextResponse.json({
      success: true,
      data: contests,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    const errorResponse = getErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.message,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    );
  }
}
