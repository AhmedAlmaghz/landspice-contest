import { NextRequest, NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';

/**
 * البحث عن المشارك باستخدام البريد الإلكتروني أو رقم الهاتف
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const phone = url.searchParams.get('phone');

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'يجب إدخال البريد الإلكتروني أو رقم الهاتف' },
        { status: 400 }
      );
    }

    let participant;
    // Using contest_id 1 as default
    const contestId = 1;

    if (email) {
      // البحث بالبريد الإلكتروني
      participant = participantQueries.findByEmail.get(email, contestId);
    } else if (phone) {
      // البحث برقم الهاتف
      participant = participantQueries.findByPhone.get(phone, contestId);
    }

    if (!participant) {
      return NextResponse.json(
        { error: 'لم يتم العثور على حساب بهذه البيانات' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant
    });

  } catch (error) {
    console.error('Error searching for participant:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث عن الحساب' },
      { status: 500 }
    );
  }
}
