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

    // Clear previous winners
    winnerQueries.clear.run();

    // Conduct random draw
    const winners = [];
    const availableParticipants = [...eligibleParticipants];
    const actualWinners = Math.min(numberOfWinners || 10, availableParticipants.length);

    for (let i = 0; i < actualWinners; i++) {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[randomIndex];
      
      // Insert winner
      winnerQueries.create.run(winner.id, i + 1);
      
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
    const winners = winnerQueries.getAll.all();
    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الفائزين' },
      { status: 500 }
    );
  }
}
