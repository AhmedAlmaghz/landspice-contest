import { NextRequest, NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';
import { RegistrationData, ProgressUpdate } from '@/types';
import { validateRegistrationData, sanitizeInput, generateReferralCode } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      city: sanitizeInput(data.city),
      referredBy: data.referredBy ? sanitizeInput(data.referredBy) : undefined
    };

    // Validate data
    const validation = validateRegistrationData(sanitizedData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }
    
    // Check if participant already exists (using contest_id 1 as default)
    const existingParticipant = participantQueries.findByEmail.get(sanitizedData.email, 1);
    if (existingParticipant) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل مسبقاً. يرجى استخدام بريد آخر أو تسجيل الدخول.' },
        { status: 400 }
      );
    }

    // Verify referral code if provided
    if (sanitizedData.referredBy) {
      const referrer = participantQueries.findByReferralCode.get(sanitizedData.referredBy);
      if (!referrer) {
        return NextResponse.json(
          { error: 'كود الإحالة غير صحيح. يرجى التحقق من الكود والمحاولة مرة أخرى.' },
          { status: 400 }
        );
      }
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let attempts = 0;
    while (participantQueries.findByReferralCode.get(referralCode) && attempts < 10) {
      referralCode = generateReferralCode();
      attempts++;
    }
    
    // Insert participant (using contest_id from data or 1 as default)
    // Note: contest_id must exist in contests table
    const contestId = (data as any).contest_id || 1;
    
    try {
      const result = participantQueries.create.run(
        contestId,
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.city,
        referralCode,
        sanitizedData.referredBy || null
      );
      
      const participantId = result.lastInsertRowid as number;
      
      return NextResponse.json({
        success: true,
        participant: {
          id: participantId,
          referral_code: referralCode
        }
      });
    } catch (dbError: any) {
      // If contest doesn't exist, return error
      if (dbError.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return NextResponse.json(
          { error: 'المسابقة غير موجودة. يرجى إنشاء مسابقة أولاً.' },
          { status: 400 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل المشارك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const participant = participantQueries.findByEmail.get(email);
      if (!participant) {
        return NextResponse.json(
          { error: 'المشارك غير موجود' },
          { status: 404 }
        );
      }
      return NextResponse.json({ participant });
    }

    const participants = participantQueries.getAll.all();
    return NextResponse.json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}
