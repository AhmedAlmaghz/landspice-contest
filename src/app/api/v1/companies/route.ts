// src/app/api/v1/companies/route.ts
// API Endpoints لإدارة الشركات

import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/services/CompanyService';
import { authMiddleware, authorizeMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { ValidationError, getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/companies
 * إنشاء شركة جديدة
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // التحقق من البيانات المطلوبة
    if (!data.name || !data.email) {
      throw new ValidationError('اسم الشركة والبريد الإلكتروني مطلوبان');
    }

    // إنشاء الشركة
    const company = await companyService.createCompany(data);

    return NextResponse.json(
      {
        success: true,
        data: company,
        message: 'تم إنشاء الشركة بنجاح',
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
 * GET /api/v1/companies
 * جلب جميع الشركات (للمسؤول فقط)
 */
export async function GET(req: NextRequest) {
  try {
    // جلب معاملات البحث
    const search = req.nextUrl.searchParams.get('search');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '50');

    // إذا كان هناك بحث، لا نحتاج للمصادقة
    if (search) {
      // البحث العام بدون مصادقة
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'contest.db');
      const db = new Database(dbPath);

      const query = `
        SELECT id, name, email, phone, logo_url, website, subscription_plan, created_at
        FROM companies
        WHERE name LIKE ? OR email LIKE ? OR website LIKE ?
        LIMIT ? OFFSET ?
      `;

      const searchTerm = `%${search}%`;
      const companies = db.prepare(query).all(
        searchTerm,
        searchTerm,
        searchTerm,
        pageSize,
        (page - 1) * pageSize
      );

      const countQuery = `
        SELECT COUNT(*) as total FROM companies
        WHERE name LIKE ? OR email LIKE ? OR website LIKE ?
      `;
      const { total } = db.prepare(countQuery).get(searchTerm, searchTerm, searchTerm) as any;

      db.close();

      return NextResponse.json({
        success: true,
        data: companies,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    // التحقق من المصادقة للحصول على جميع الشركات
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    // التحقق من الصلاحيات (مسؤول فقط)
    if (!user.permissions.includes(PERMISSIONS.MANAGE_COMPANIES)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    // جلب الشركات من قاعدة البيانات
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'contest.db');
    const db = new Database(dbPath);

    const query = `
      SELECT id, name, email, phone, logo_url, website, subscription_plan, created_at
      FROM companies
      LIMIT ? OFFSET ?
    `;

    const companies = db.prepare(query).all(pageSize, (page - 1) * pageSize);
    const { total } = db.prepare('SELECT COUNT(*) as total FROM companies').get() as any;

    db.close();

    return NextResponse.json({
      success: true,
      data: companies,
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
