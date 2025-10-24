// src/services/SocialPlatformService.ts
// خدمة إدارة الشبكات الاجتماعية الديناميكية

import { SocialPlatform, AddPlatformInput, UpdatePlatformInput } from '@/types/saas';
import { contestService } from './ContestService';
import { companyService } from './CompanyService';

export class SocialPlatformService {
  /**
   * إضافة شبكة اجتماعية جديدة
   */
  async addPlatform(contestId: string, companyId: string, data: AddPlatformInput): Promise<SocialPlatform> {
    // التحقق من وجود المسابقة
    const contest = await contestService.getContestById(contestId);
    if (!contest) {
      throw new Error('المسابقة غير موجودة');
    }

    // التحقق من الملكية
    if (contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لإضافة شبكة لهذه المسابقة');
    }

    // التحقق من إمكانية إضافة شبكة جديدة
    const canAdd = await companyService.canAddPlatform(companyId, contestId);
    if (!canAdd) {
      throw new Error('لقد وصلت إلى حد الشبكات المسموح به في خطتك');
    }

    // التحقق من البيانات
    if (!data.display_name || !data.url) {
      throw new Error('اسم الشبكة والرابط مطلوبان');
    }

    // التحقق من صحة الرابط
    try {
      new URL(data.url);
    } catch {
      throw new Error('الرابط غير صحيح');
    }

    // جلب أكبر order_index
    const platforms = await this.getPlatformsByContest(contestId);
    const maxOrder = platforms.length > 0 ? Math.max(...platforms.map(p => p.order_index)) : -1;

    const platform: SocialPlatform = {
      id: this.generateId(),
      contest_id: contestId,
      name: data.name,
      display_name: data.display_name,
      url: data.url,
      icon_url: data.icon_url,
      action_type: data.action_type,
      action_description: data.action_description,
      auto_verify: data.auto_verify ?? false,
      verification_method: data.verification_method ?? 'manual',
      order_index: data.order_index ?? (maxOrder + 1),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.savePlatform(platform);
    return platform;
  }

  /**
   * جلب شبكة حسب المعرف
   */
  async getPlatformById(id: string): Promise<SocialPlatform | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب شبكات المسابقة
   */
  async getPlatformsByContest(contestId: string): Promise<SocialPlatform[]> {
    // سيتم استبدال هذا بـ database query
    return [];
  }

  /**
   * تحديث الشبكة
   */
  async updatePlatform(
    platformId: string,
    contestId: string,
    companyId: string,
    data: UpdatePlatformInput
  ): Promise<SocialPlatform> {
    const platform = await this.getPlatformById(platformId);
    if (!platform) {
      throw new Error('الشبكة غير موجودة');
    }

    // التحقق من الملكية
    const contest = await contestService.getContestById(contestId);
    if (!contest || contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لتعديل هذه الشبكة');
    }

    // التحقق من صحة الرابط إن وجد
    if (data.url) {
      try {
        new URL(data.url);
      } catch {
        throw new Error('الرابط غير صحيح');
      }
    }

    const updated: SocialPlatform = {
      ...platform,
      ...data,
      updated_at: new Date(),
    };

    await this.savePlatform(updated);
    return updated;
  }

  /**
   * حذف الشبكة
   */
  async deletePlatform(platformId: string, contestId: string, companyId: string): Promise<void> {
    const platform = await this.getPlatformById(platformId);
    if (!platform) {
      throw new Error('الشبكة غير موجودة');
    }

    // التحقق من الملكية
    const contest = await contestService.getContestById(contestId);
    if (!contest || contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لحذف هذه الشبكة');
    }

    // حذف من قاعدة البيانات
    await this.deletePlatformFromDB(platformId);

    // إعادة ترتيب الشبكات المتبقية
    const platforms = await this.getPlatformsByContest(contestId);
    for (let i = 0; i < platforms.length; i++) {
      if (platforms[i].order_index !== i) {
        await this.updatePlatform(platforms[i].id, contestId, companyId, { order_index: i });
      }
    }
  }

  /**
   * إعادة ترتيب الشبكات
   */
  async reorderPlatforms(
    contestId: string,
    companyId: string,
    platformIds: string[]
  ): Promise<void> {
    // التحقق من الملكية
    const contest = await contestService.getContestById(contestId);
    if (!contest || contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لإعادة ترتيب الشبكات');
    }

    // إعادة الترتيب
    for (let i = 0; i < platformIds.length; i++) {
      const platform = await this.getPlatformById(platformIds[i]);
      if (platform && platform.contest_id === contestId) {
        await this.savePlatform({
          ...platform,
          order_index: i,
          updated_at: new Date(),
        });
      }
    }
  }

  /**
   * تفعيل/تعطيل الشبكة
   */
  async togglePlatform(platformId: string, contestId: string, companyId: string): Promise<SocialPlatform> {
    const platform = await this.getPlatformById(platformId);
    if (!platform) {
      throw new Error('الشبكة غير موجودة');
    }

    // التحقق من الملكية
    const contest = await contestService.getContestById(contestId);
    if (!contest || contest.company_id !== companyId) {
      throw new Error('ليس لديك صلاحية لتعديل هذه الشبكة');
    }

    const updated: SocialPlatform = {
      ...platform,
      is_active: !platform.is_active,
      updated_at: new Date(),
    };

    await this.savePlatform(updated);
    return updated;
  }

  /**
   * جلب الشبكات النشطة فقط
   */
  async getActivePlatforms(contestId: string): Promise<SocialPlatform[]> {
    const platforms = await this.getPlatformsByContest(contestId);
    return platforms.filter(p => p.is_active).sort((a, b) => a.order_index - b.order_index);
  }

  /**
   * حفظ الشبكة في قاعدة البيانات
   */
  private async savePlatform(platform: SocialPlatform): Promise<void> {
    // سيتم استبدال هذا بـ database save
    // await db.social_platforms.upsert(platform);
  }

  /**
   * حذف الشبكة من قاعدة البيانات
   */
  private async deletePlatformFromDB(platformId: string): Promise<void> {
    // سيتم استبدال هذا بـ database delete
    // await db.social_platforms.delete(platformId);
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `platform_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const socialPlatformService = new SocialPlatformService();
