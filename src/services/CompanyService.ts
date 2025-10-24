// src/services/CompanyService.ts
// خدمة إدارة الشركات

import { Company, CreateCompanyInput, UpdateCompanyInput, SubscriptionPlan, SubscriptionStatus } from '@/types/saas';
import { SUBSCRIPTION_LIMITS } from '@/lib/permissions';

export class CompanyService {
  /**
   * إنشاء شركة جديدة
   */
  async createCompany(data: CreateCompanyInput): Promise<Company> {
    // التحقق من البيانات
    if (!data.name || !data.email) {
      throw new Error('اسم الشركة والبريد الإلكتروني مطلوبان');
    }

    // التحقق من عدم وجود شركة بنفس البريد
    const existingCompany = await this.getCompanyByEmail(data.email);
    if (existingCompany) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
    }

    const company: Company = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      website_url: data.website_url,
      description: data.description,
      subscription_plan: SubscriptionPlan.FREE,
      subscription_status: SubscriptionStatus.ACTIVE,
      subscription_start_date: new Date(),
      settings: {},
      created_at: new Date(),
      updated_at: new Date(),
    };

    // حفظ في قاعدة البيانات
    await this.saveCompany(company);
    return company;
  }

  /**
   * جلب شركة حسب المعرف
   */
  async getCompanyById(id: string): Promise<Company | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * جلب شركة حسب البريد الإلكتروني
   */
  async getCompanyByEmail(email: string): Promise<Company | null> {
    // سيتم استبدال هذا بـ database query
    return null;
  }

  /**
   * تحديث بيانات الشركة
   */
  async updateCompany(id: string, data: UpdateCompanyInput): Promise<Company> {
    const company = await this.getCompanyById(id);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const updated: Company = {
      ...company,
      ...data,
      updated_at: new Date(),
    };

    await this.saveCompany(updated);
    return updated;
  }

  /**
   * تحديث خطة الاشتراك
   */
  async updateSubscriptionPlan(id: string, plan: SubscriptionPlan): Promise<Company> {
    const company = await this.getCompanyById(id);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const updated: Company = {
      ...company,
      subscription_plan: plan,
      updated_at: new Date(),
    };

    await this.saveCompany(updated);
    return updated;
  }

  /**
   * جلب إحصائيات الشركة
   */
  async getCompanyStats(companyId: string) {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    // سيتم استبدال هذا بـ database queries
    return {
      company_id: companyId,
      subscription_plan: company.subscription_plan,
      total_contests: 0,
      active_contests: 0,
      total_participants: 0,
      total_revenue: 0,
    };
  }

  /**
   * التحقق من حد المسابقات
   */
  async canCreateContest(companyId: string): Promise<boolean> {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const limits = SUBSCRIPTION_LIMITS[company.subscription_plan];
    const stats = await this.getCompanyStats(companyId);

    return stats.total_contests < limits.max_contests;
  }

  /**
   * التحقق من حد المشاركين
   */
  async canAddParticipant(companyId: string, contestId: string): Promise<boolean> {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const limits = SUBSCRIPTION_LIMITS[company.subscription_plan];
    const stats = await this.getCompanyStats(companyId);

    return stats.total_participants < limits.max_participants;
  }

  /**
   * التحقق من حد الشبكات
   */
  async canAddPlatform(companyId: string, contestId: string): Promise<boolean> {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const limits = SUBSCRIPTION_LIMITS[company.subscription_plan];
    // سيتم استبدال هذا بـ database query
    const platformCount = 0;

    return platformCount < limits.max_platforms;
  }

  /**
   * حذف شركة (soft delete)
   */
  async deleteCompany(id: string): Promise<void> {
    const company = await this.getCompanyById(id);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }

    const updated: Company = {
      ...company,
      deleted_at: new Date(),
      updated_at: new Date(),
    };

    await this.saveCompany(updated);
  }

  /**
   * حفظ الشركة في قاعدة البيانات
   */
  private async saveCompany(company: Company): Promise<void> {
    // سيتم استبدال هذا بـ database save
    // await db.companies.upsert(company);
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const companyService = new CompanyService();
