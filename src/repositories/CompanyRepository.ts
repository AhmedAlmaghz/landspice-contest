// src/repositories/CompanyRepository.ts
// Repository لإدارة الشركات

import { Company } from '@/types/saas';
import { BaseRepository } from './BaseRepository';

export interface ICompanyRepository extends BaseRepository<Company> {
  findByEmail(email: string): Promise<Company | null>;
  findBySubscriptionStatus(status: string): Promise<Company[]>;
  findExpiredSubscriptions(): Promise<Company[]>;
}

export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  constructor() {
    super('companies');
  }

  /**
   * جلب شركة حسب البريد الإلكتروني
   */
  async findByEmail(email: string): Promise<Company | null> {
    try {
      // سيتم استبدال هذا بـ database query
      // const result = await db.query(
      //   `SELECT * FROM ${this.tableName} WHERE email = $1 AND deleted_at IS NULL`,
      //   [email]
      // );
      // return result.rows[0] || null;
      return null;
    } catch (error) {
      console.error('Error finding company by email:', error);
      throw error;
    }
  }

  /**
   * جلب الشركات حسب حالة الاشتراك
   */
  async findBySubscriptionStatus(status: string): Promise<Company[]> {
    try {
      // سيتم استبدال هذا بـ database query
      // const result = await db.query(
      //   `SELECT * FROM ${this.tableName} WHERE subscription_status = $1 AND deleted_at IS NULL`,
      //   [status]
      // );
      // return result.rows;
      return [];
    } catch (error) {
      console.error('Error finding companies by subscription status:', error);
      throw error;
    }
  }

  /**
   * جلب الشركات التي انتهت اشتراكاتها
   */
  async findExpiredSubscriptions(): Promise<Company[]> {
    try {
      // سيتم استبدال هذا بـ database query
      // const result = await db.query(
      //   `SELECT * FROM ${this.tableName} 
      //    WHERE subscription_end_date < NOW() 
      //    AND subscription_status = 'active' 
      //    AND deleted_at IS NULL`
      // );
      // return result.rows;
      return [];
    } catch (error) {
      console.error('Error finding expired subscriptions:', error);
      throw error;
    }
  }

  /**
   * تحديث حالة الاشتراك
   */
  async updateSubscriptionStatus(companyId: string, status: string): Promise<Company> {
    try {
      return await this.update(companyId, {
        subscription_status: status as any,
        updated_at: new Date(),
      });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * جلب إحصائيات الشركة
   */
  async getStats(companyId: string) {
    try {
      // سيتم استبدال هذا بـ database query
      // const result = await db.query(
      //   `SELECT 
      //      (SELECT COUNT(*) FROM contests WHERE company_id = $1 AND deleted_at IS NULL) as total_contests,
      //      (SELECT COUNT(*) FROM contests WHERE company_id = $1 AND status = 'active' AND deleted_at IS NULL) as active_contests,
      //      (SELECT COUNT(*) FROM participants WHERE company_id = $1) as total_participants
      //    FROM companies WHERE id = $1`,
      //   [companyId]
      // );
      // return result.rows[0];
      return {
        total_contests: 0,
        active_contests: 0,
        total_participants: 0,
      };
    } catch (error) {
      console.error('Error getting company stats:', error);
      throw error;
    }
  }
}

export const companyRepository = new CompanyRepository();
