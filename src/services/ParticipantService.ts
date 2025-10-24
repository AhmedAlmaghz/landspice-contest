// src/services/ParticipantService.ts
// خدمة إدارة المشاركين

import { Participant, CreateParticipantInput } from '@/types/saas';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { companyService } from './CompanyService';
import { contestService } from './ContestService';

export class ParticipantService {
  /**
   * تسجيل مشارك جديد
   */
  async registerParticipant(contestId: string, data: CreateParticipantInput): Promise<Participant> {
    // التحقق من وجود المسابقة
    const contest = await contestService.getContestById(contestId);
    if (!contest) {
      throw new NotFoundError('المسابقة غير موجودة');
    }

    // التحقق من إمكانية إضافة مشارك جديد
    const canAdd = await companyService.canAddParticipant(contest.company_id, contestId);
    if (!canAdd) {
      throw new ValidationError('لقد وصلت إلى حد المشاركين المسموح به في خطتك');
    }

    // التحقق من البيانات
    this.validateParticipantData(data);

    // التحقق من عدم وجود مشارك بنفس البريد
    const existingParticipant = await this.getParticipantByEmail(contestId, data.email);
    if (existingParticipant) {
      throw new ValidationError('هذا البريد الإلكتروني مسجل بالفعل في هذه المسابقة');
    }

    // توليد كود الإحالة
    const referralCode = this.generateReferralCode();

    const participant: Participant = {
      id: this.generateId(),
      contest_id: contestId,
      company_id: contest.company_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      referral_code: referralCode,
      referred_by: data.referred_by,
      progress: 0,
      shares: 0,
      referrals: 0,
      email_verified: false,
      registration_date: new Date(),
    };

    await this.saveParticipant(participant);
    return participant;
  }

  /**
   * جلب مشارك حسب المعرف
   */
  async getParticipantById(id: string): Promise<Participant | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب مشارك حسب البريد الإلكتروني
   */
  async getParticipantByEmail(contestId: string, email: string): Promise<Participant | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب مشارك حسب كود الإحالة
   */
  async getParticipantByReferralCode(referralCode: string): Promise<Participant | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب جميع مشاركي المسابقة
   */
  async getContestParticipants(contestId: string, page: number = 1, pageSize: number = 50) {
    // سيتم استبدال هذا بـ database query
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  /**
   * تحديث تقدم المشارك
   */
  async updateProgress(participantId: string, contestId: string, increment: number = 1): Promise<Participant> {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    if (participant.contest_id !== contestId) {
      throw new ValidationError('المشارك لا ينتمي لهذه المسابقة');
    }

    const updated: Participant = {
      ...participant,
      progress: participant.progress + increment,
      last_activity_date: new Date(),
    };

    await this.saveParticipant(updated);
    return updated;
  }

  /**
   * تحديث عدد المشاركات
   */
  async updateShares(participantId: string, contestId: string, increment: number = 1): Promise<Participant> {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    if (participant.contest_id !== contestId) {
      throw new ValidationError('المشارك لا ينتمي لهذه المسابقة');
    }

    const updated: Participant = {
      ...participant,
      shares: participant.shares + increment,
      last_activity_date: new Date(),
    };

    await this.saveParticipant(updated);
    return updated;
  }

  /**
   * تحديث عدد الإحالات
   */
  async updateReferrals(participantId: string, contestId: string, increment: number = 1): Promise<Participant> {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    if (participant.contest_id !== contestId) {
      throw new ValidationError('المشارك لا ينتمي لهذه المسابقة');
    }

    const updated: Participant = {
      ...participant,
      referrals: participant.referrals + increment,
      last_activity_date: new Date(),
    };

    await this.saveParticipant(updated);
    return updated;
  }

  /**
   * التحقق من البريد الإلكتروني
   */
  async verifyEmail(participantId: string): Promise<Participant> {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    const updated: Participant = {
      ...participant,
      email_verified: true,
      verified_at: new Date(),
    };

    await this.saveParticipant(updated);
    return updated;
  }

  /**
   * حذف مشارك
   */
  async deleteParticipant(participantId: string, contestId: string): Promise<void> {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    if (participant.contest_id !== contestId) {
      throw new ValidationError('المشارك لا ينتمي لهذه المسابقة');
    }

    await this.deleteParticipantFromDB(participantId);
  }

  /**
   * جلب إحصائيات المشارك
   */
  async getParticipantStats(participantId: string) {
    const participant = await this.getParticipantById(participantId);
    if (!participant) {
      throw new NotFoundError('المشارك غير موجود');
    }

    return {
      participant_id: participantId,
      progress: participant.progress,
      shares: participant.shares,
      referrals: participant.referrals,
      email_verified: participant.email_verified,
      registration_date: participant.registration_date,
      last_activity_date: participant.last_activity_date,
    };
  }

  /**
   * البحث عن المشاركين
   */
  async searchParticipants(contestId: string, query: string, page: number = 1, pageSize: number = 50) {
    // سيتم استبدال هذا بـ database query مع full-text search
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  /**
   * تصفية المشاركين
   */
  async filterParticipants(
    contestId: string,
    filters: {
      city?: string;
      email_verified?: boolean;
      min_progress?: number;
      max_progress?: number;
    },
    page: number = 1,
    pageSize: number = 50
  ) {
    // سيتم استبدال هذا بـ database query مع filters
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  /**
   * التحقق من صحة بيانات المشارك
   */
  private validateParticipantData(data: CreateParticipantInput): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('الاسم مطلوب');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new ValidationError('البريد الإلكتروني غير صحيح');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      throw new ValidationError('رقم الهاتف غير صحيح');
    }

    if (data.name.length > 255) {
      throw new ValidationError('الاسم طويل جداً');
    }
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * التحقق من صحة رقم الهاتف
   */
  private isValidPhone(phone: string): boolean {
    // يمكن تخصيص هذا حسب الدول المختلفة
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * توليد كود إحالة فريد
   */
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // بدون 0, O, I, L, 1
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `LS${code}`;
  }

  /**
   * حفظ المشارك في قاعدة البيانات
   */
  private async saveParticipant(participant: Participant): Promise<void> {
    // سيتم استبدال هذا بـ database save
    // await db.participants.upsert(participant);
  }

  /**
   * حذف المشارك من قاعدة البيانات
   */
  private async deleteParticipantFromDB(participantId: string): Promise<void> {
    // سيتم استبدال هذا بـ database delete
    // await db.participants.delete(participantId);
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const participantService = new ParticipantService();
