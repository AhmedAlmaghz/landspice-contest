import { NextRequest, NextResponse } from 'next/server';
import { participantQueries, winnerQueries } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { numberOfWinners, minProgress } = await request.json();
    
    // Get eligible participants
    const eligibleParticipants = participantQueries.getEligibleForDraw.all(minProgress || 50);
    
    if (eligibleParticipants.length === 0) {
      return NextResponse.json(
        { error: 'لا يوجد مشاركون مؤهلون للسحب' },
        { status: 400 }
      );
    }

    // Previous winners will be replaced

    // Conduct random draw
    const winners = [];
    const availableParticipants = [...eligibleParticipants];
    const actualWinners = Math.min(numberOfWinners || 10, availableParticipants.length);

    for (let i = 0; i < actualWinners; i++) {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[randomIndex] as any;
      
      // Insert winner (contest_id is required but using 1 as default)
      winnerQueries.create.run(1, winner.id, i + 1, 'جائزة');
      
      winners.push({
        ...winner,
        position: i + 1
      });
      
      availableParticipants.splice(randomIndex, 1);
    }

    return NextResponse.json({
      success: true,
      winners
    });
  } catch (error) {
    console.error('Error conducting draw:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إجراء السحب' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return empty winners list for now
    const winners: any[] = [];
    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الفائزين' },
      { status: 500 }
    );
  }
}
