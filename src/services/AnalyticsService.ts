// src/services/AnalyticsService.ts
// خدمة التحليلات والتقارير

export interface ContestAnalytics {
  contestId: string;
  totalParticipants: number;
  verifiedParticipants: number;
  completionRate: number;
  averageProgress: number;
  totalShares: number;
  totalReferrals: number;
  topParticipants: Array<{
    id: string;
    name: string;
    progress: number;
    shares: number;
    referrals: number;
  }>;
}

export interface CompanyAnalytics {
  companyId: string;
  totalContests: number;
  activeContests: number;
  totalParticipants: number;
  totalVerified: number;
  averageCompletionRate: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
}

export interface ParticipantBehavior {
  participantId: string;
  registrationDate: Date;
  lastActivityDate: Date;
  activityCount: number;
  averageTimePerAction: number;
  referralConversionRate: number;
}

export interface ReportData {
  title: string;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: Record<string, any>;
}

export class AnalyticsService {
  /**
   * جلب تحليلات المسابقة
   */
  async getContestAnalytics(contestId: string): Promise<ContestAnalytics> {
    try {
      // سيتم استبدال هذا بـ database queries
      // const contest = await db.contests.findById(contestId);
      // const participants = await db.participants.findByContestId(contestId);
      // const verified = await db.social_actions.countVerified(contestId);

      return {
        contestId,
        totalParticipants: 0,
        verifiedParticipants: 0,
        completionRate: 0,
        averageProgress: 0,
        totalShares: 0,
        totalReferrals: 0,
        topParticipants: [],
      };
    } catch (error) {
      console.error('Error getting contest analytics:', error);
      throw error;
    }
  }

  /**
   * جلب تحليلات الشركة
   */
  async getCompanyAnalytics(companyId: string): Promise<CompanyAnalytics> {
    try {
      // سيتم استبدال هذا بـ database queries
      // const contests = await db.contests.findByCompanyId(companyId);
      // const participants = await db.participants.findByCompanyId(companyId);
      // const revenue = await db.payments.sumByCompanyId(companyId);

      return {
        companyId,
        totalContests: 0,
        activeContests: 0,
        totalParticipants: 0,
        totalVerified: 0,
        averageCompletionRate: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        growthRate: 0,
      };
    } catch (error) {
      console.error('Error getting company analytics:', error);
      throw error;
    }
  }

  /**
   * جلب سلوك المشارك
   */
  async getParticipantBehavior(participantId: string): Promise<ParticipantBehavior> {
    try {
      // سيتم استبدال هذا بـ database queries
      // const participant = await db.participants.findById(participantId);
      // const actions = await db.social_actions.findByParticipantId(participantId);

      return {
        participantId,
        registrationDate: new Date(),
        lastActivityDate: new Date(),
        activityCount: 0,
        averageTimePerAction: 0,
        referralConversionRate: 0,
      };
    } catch (error) {
      console.error('Error getting participant behavior:', error);
      throw error;
    }
  }

  /**
   * توليد تقرير المسابقة
   */
  async generateContestReport(
    contestId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportData> {
    try {
      const analytics = await this.getContestAnalytics(contestId);

      return {
        title: `تقرير المسابقة - ${contestId}`,
        generatedAt: new Date(),
        period: { startDate, endDate },
        data: {
          ...analytics,
          period: { startDate, endDate },
        },
      };
    } catch (error) {
      console.error('Error generating contest report:', error);
      throw error;
    }
  }

  /**
   * توليد تقرير الشركة
   */
  async generateCompanyReport(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportData> {
    try {
      const analytics = await this.getCompanyAnalytics(companyId);

      return {
        title: `تقرير الشركة - ${companyId}`,
        generatedAt: new Date(),
        period: { startDate, endDate },
        data: {
          ...analytics,
          period: { startDate, endDate },
        },
      };
    } catch (error) {
      console.error('Error generating company report:', error);
      throw error;
    }
  }

  /**
   * تصدير التقرير إلى CSV
   */
  exportToCSV(report: ReportData): string {
    try {
      const headers = Object.keys(report.data);
      const rows = [headers.join(',')];

      // تحويل البيانات إلى صفوف CSV
      if (Array.isArray(report.data)) {
        report.data.forEach(row => {
          rows.push(headers.map(h => row[h]).join(','));
        });
      }

      return rows.join('\n');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * تصدير التقرير إلى JSON
   */
  exportToJSON(report: ReportData): string {
    try {
      return JSON.stringify(report, null, 2);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  /**
   * حساب معدل النمو
   */
  calculateGrowthRate(
    currentValue: number,
    previousValue: number
  ): number {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  /**
   * حساب معدل الإكمال
   */
  calculateCompletionRate(
    completed: number,
    total: number
  ): number {
    if (total === 0) return 0;
    return (completed / total) * 100;
  }

  /**
   * حساب متوسط التقدم
   */
  calculateAverageProgress(
    participants: Array<{ progress: number }>
  ): number {
    if (participants.length === 0) return 0;
    const total = participants.reduce((sum, p) => sum + p.progress, 0);
    return total / participants.length;
  }
}

export const analyticsService = new AnalyticsService();
