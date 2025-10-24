// src/services/ContestService.ts
// خدمة إدارة المسابقات

import { Contest, CreateContestInput, UpdateContestInput, ContestStatus, ContestWithDetails } from '@/types/saas';
import { companyService } from './CompanyService';

export class ContestService {
  /**
   * إنشاء مسابقة جديدة
   */
  async createContest(companyId: string, data: CreateContestInput): Promise<Contest> {
    // التحقق من وجود الشركة
    const company = await companyService.getCompanyById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    // التحقق من إمكانية إنشاء مسابقة جديدة
    const canCreate = await companyService.canCreateContest(companyId);
    if (!canCreate) {
      throw new Error('لقد وصلت إلى حد المسابقات المسموح به في خطتك');
    }

    // التحقق من البيانات
    if (!data.title) {
      throw new Error('عنوان المسابقة مطلوب');
    }

    if (data.end_date <= data.start_date) {
      throw new Error('تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية');
    }

    const contest: Contest = {
      id: this.generateId(),
      company_id: companyId,
      title: data.title,
      description: data.description,
      banner_url: data.banner_url,
      start_date: data.start_date,
      end_date: data.end_date,
      prize_description: data.prize_description,
      max_participants: data.max_participants,
      require_email_verification: data.require_email_verification ?? true,
      status: ContestStatus.DRAFT,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.saveContest(contest);
    return contest;
  }

  /**
   * جلب مسابقة حسب المعرف
   */
  async getContestById(id: string): Promise<Contest | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب جميع مسابقات الشركة
   */
  async getCompanyContests(companyId: string): Promise<Contest[]> {
    // سيتم استبدال هذا بـ database query
    return [];
  }

  /**
   * جلب مسابقة مع تفاصيلها
   */
  async getContestWithDetails(id: string): Promise<ContestWithDetails | null> {
    const contest = await this.getContestById(id);
    if (!contest) {
      return null;
    }

    // سيتم استبدال هذا بـ database queries
    const platforms = [];
    const participantCount = 0;

    return {
      ...contest,
      platforms,
      participantCount,
    };
  }

  /**
   * تحديث بيانات المسابقة
   */
  async updateContest(id: string, companyId: string, data: UpdateContestInput): Promise<Contest> {
    const contest = await this.getContestById(id);
    if (!contest) {
      throw new Error('المسابقة غير موجودة');
    }

    // التحقق من الملكية
    if (contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لتعديل هذه المسابقة');
    }

    // التحقق من أن المسابقة في حالة draft
    if (contest.status !== ContestStatus.DRAFT) {
      throw new Error('لا يمكن تعديل مسابقة نشطة أو منتهية');
    }

    if (data.end_date && data.start_date && data.end_date <= data.start_date) {
      throw new Error('تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية');
    }

    const updated: Contest = {
      ...contest,
      ...data,
      updated_at: new Date(),
    };

    await this.saveContest(updated);
    return updated;
  }

  /**
   * نشر المسابقة
   */
  async publishContest(id: string, companyId: string): Promise<Contest> {
    const contest = await this.getContestById(id);
    if (!contest) {
      throw new Error('المسابقة غير موجودة');
    }

    // التحقق من الملكية
    if (contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لنشر هذه المسابقة');
    }

    // التحقق من أن المسابقة في حالة draft
    if (contest.status !== ContestStatus.DRAFT) {
      throw new Error('يمكن نشر المسابقات في حالة draft فقط');
    }

    // التحقق من وجود شبكات اجتماعية
    const platforms = await this.getPlatforms(id);
    if (platforms.length === 0) {
      throw new Error('يجب إضافة شبكة اجتماعية واحدة على الأقل قبل النشر');
    }

    const updated: Contest = {
      ...contest,
      status: ContestStatus.ACTIVE,
      updated_at: new Date(),
    };

    await this.saveContest(updated);
    return updated;
  }

  /**
   * إنهاء المسابقة
   */
  async endContest(id: string, companyId: string): Promise<Contest> {
    const contest = await this.getContestById(id);
    if (!contest) {
      throw new Error('المسابقة غير موجودة');
    }

    // التحقق من الملكية
    if (contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لإنهاء هذه المسابقة');
    }

    const updated: Contest = {
      ...contest,
      status: ContestStatus.ENDED,
      updated_at: new Date(),
    };

    await this.saveContest(updated);
    return updated;
  }

  /**
   * حذف المسابقة
   */
  async deleteContest(id: string, companyId: string): Promise<void> {
    const contest = await this.getContestById(id);
    if (!contest) {
      throw new Error('المسابقة غير موجودة');
    }

    // التحقق من الملكية
    if (contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لحذف هذه المسابقة');
    }

    const updated: Contest = {
      ...contest,
      status: ContestStatus.CANCELLED,
      deleted_at: new Date(),
      updated_at: new Date(),
    };

    await this.saveContest(updated);
  }

  /**
   * جلب شبكات المسابقة
   */
  private async getPlatforms(contestId: string) {
    // سيتم استبدال هذا بـ database query
    return [];
  }

  /**
   * حفظ المسابقة في قاعدة البيانات
   */
  private async saveContest(contest: Contest): Promise<void> {
    // سيتم استبدال هذا بـ database save
    // await db.contests.upsert(contest);
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `contest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const contestService = new ContestService();
