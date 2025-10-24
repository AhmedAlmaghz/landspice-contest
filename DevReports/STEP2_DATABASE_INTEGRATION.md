# 🗄️ الخطوة 2: ربط الخدمات بقاعدة البيانات

**التاريخ:** 2025-10-23  
**المرحلة:** 2 - ربط الخدمات بـ Database

---

## 📋 نظرة عامة

في هذه الخطوة سنقوم بـ:
1. تحديث Repository Pattern لاستخدام Prisma
2. ربط الخدمات بقاعدة البيانات
3. اختبار الاتصال

---

## 🔄 الخطوة 1: تحديث BaseRepository

```typescript
// src/repositories/BaseRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export abstract class BaseRepository<T> {
  protected prisma = prisma;
  protected model: any;

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async findAll(page: number = 1, pageSize: number = 50) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: pageSize,
        where: { deletedAt: null },
      }),
      this.model.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

---

## 🏢 الخطوة 2: تحديث CompanyRepository

```typescript
// src/repositories/CompanyRepository.ts
import { BaseRepository } from './BaseRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyRepository extends BaseRepository<any> {
  constructor() {
    super();
    this.model = prisma.company;
  }

  async findByEmail(email: string) {
    return await this.model.findUnique({
      where: { email },
    });
  }

  async findBySubscriptionStatus(status: string) {
    return await this.model.findMany({
      where: {
        subscriptionStatus: status,
        deletedAt: null,
      },
    });
  }

  async findExpiredSubscriptions() {
    return await this.model.findMany({
      where: {
        subscriptionEndDate: {
          lt: new Date(),
        },
        subscriptionStatus: 'active',
        deletedAt: null,
      },
    });
  }

  async getStats(companyId: string) {
    const [contests, participants, payments] = await Promise.all([
      prisma.contest.count({
        where: { companyId, deletedAt: null },
      }),
      prisma.participant.count({
        where: { companyId },
      }),
      prisma.payment.aggregate({
        where: { companyId, status: 'succeeded' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalContests: contests,
      totalParticipants: participants,
      totalRevenue: payments._sum.amount || 0,
    };
  }
}

export const companyRepository = new CompanyRepository();
```

---

## 🎯 الخطوة 3: تحديث ContestRepository

```typescript
// src/repositories/ContestRepository.ts
import { BaseRepository } from './BaseRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ContestRepository extends BaseRepository<any> {
  constructor() {
    super();
    this.model = prisma.contest;
  }

  async findByCompanyId(companyId: string, page: number = 1, pageSize: number = 50) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.model.findMany({
        where: { companyId, deletedAt: null },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.model.count({
        where: { companyId, deletedAt: null },
      }),
    ]);

    return { data, total, page, pageSize };
  }

  async findByStatus(status: string) {
    return await this.model.findMany({
      where: { status, deletedAt: null },
    });
  }

  async findActiveContests() {
    return await this.model.findMany({
      where: {
        status: 'active',
        startDate: { lte: new Date() },
        endDate: { gt: new Date() },
        deletedAt: null,
      },
    });
  }

  async countByCompanyId(companyId: string) {
    return await this.model.count({
      where: { companyId, deletedAt: null },
    });
  }

  async getStats(contestId: string) {
    const [participants, verified, actions] = await Promise.all([
      prisma.participant.count({
        where: { contestId },
      }),
      prisma.participant.count({
        where: { contestId, emailVerified: true },
      }),
      prisma.socialAction.count({
        where: { contestId, isVerified: true },
      }),
    ]);

    return {
      totalParticipants: participants,
      verifiedParticipants: verified,
      verifiedActions: actions,
    };
  }
}

export const contestRepository = new ContestRepository();
```

---

## 👥 الخطوة 4: تحديث ParticipantRepository

```typescript
// src/repositories/ParticipantRepository.ts
import { BaseRepository } from './BaseRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ParticipantRepository extends BaseRepository<any> {
  constructor() {
    super();
    this.model = prisma.participant;
  }

  async findByContestId(contestId: string, page: number = 1, pageSize: number = 50) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.model.findMany({
        where: { contestId },
        skip,
        take: pageSize,
        orderBy: { progress: 'desc' },
      }),
      this.model.count({
        where: { contestId },
      }),
    ]);

    return { data, total, page, pageSize };
  }

  async findByEmail(contestId: string, email: string) {
    return await this.model.findFirst({
      where: { contestId, email },
    });
  }

  async findByReferralCode(referralCode: string) {
    return await this.model.findUnique({
      where: { referralCode },
    });
  }

  async countByContestId(contestId: string) {
    return await this.model.count({
      where: { contestId },
    });
  }

  async findTopParticipants(contestId: string, limit: number = 10) {
    return await this.model.findMany({
      where: { contestId },
      orderBy: [
        { progress: 'desc' },
        { shares: 'desc' },
        { referrals: 'desc' },
      ],
      take: limit,
    });
  }
}

export const participantRepository = new ParticipantRepository();
```

---

## 🌐 الخطوة 5: تحديث SocialPlatformRepository

```typescript
// src/repositories/SocialPlatformRepository.ts
import { BaseRepository } from './BaseRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SocialPlatformRepository extends BaseRepository<any> {
  constructor() {
    super();
    this.model = prisma.socialPlatform;
  }

  async findByContestId(contestId: string) {
    return await this.model.findMany({
      where: { contestId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findActiveByContestId(contestId: string) {
    return await this.model.findMany({
      where: { contestId, isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async countByContestId(contestId: string) {
    return await this.model.count({
      where: { contestId },
    });
  }

  async updateOrder(platformIds: string[]) {
    for (let i = 0; i < platformIds.length; i++) {
      await this.model.update({
        where: { id: platformIds[i] },
        data: { orderIndex: i },
      });
    }
  }
}

export const socialPlatformRepository = new SocialPlatformRepository();
```

---

## 🔗 الخطوة 6: تحديث الخدمات

### تحديث CompanyService

```typescript
// src/services/CompanyService.ts
import { companyRepository } from '@/repositories/CompanyRepository';

export class CompanyService {
  async createCompany(data: CreateCompanyInput) {
    return await companyRepository.create(data);
  }

  async getCompanyById(id: string) {
    return await companyRepository.findById(id);
  }

  async getCompanyByEmail(email: string) {
    return await companyRepository.findByEmail(email);
  }

  async updateCompany(id: string, data: UpdateCompanyInput) {
    return await companyRepository.update(id, data);
  }

  async getCompanyStats(companyId: string) {
    return await companyRepository.getStats(companyId);
  }
}
```

---

## ✅ الخطوة 7: اختبار الاتصال

```typescript
// src/lib/test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## 🚀 الخطوة 8: تشغيل الاختبار

```bash
# 1. تشغيل التطبيق
npm run dev

# 2. في ملف جديد، اختبر الاتصال
npx ts-node src/lib/test-db.ts

# 3. تحقق من قاعدة البيانات
npx prisma studio
```

---

## 📋 قائمة التحقق

- [ ] تحديث BaseRepository
- [ ] تحديث جميع Repositories
- [ ] تحديث جميع الخدمات
- [ ] اختبار الاتصال بقاعدة البيانات
- [ ] التحقق من Prisma Studio
- [ ] تشغيل التطبيق بنجاح

---

## 🎯 الخطوة التالية

بعد إكمال هذه الخطوات:

1. ✅ التبعيات مثبتة
2. ✅ قاعدة البيانات جاهزة
3. ✅ الخدمات مرتبطة بـ Database

**الخطوة التالية:** ربط الواجهات بـ API Routes

---

**التاريخ:** 2025-10-23  
**المرحلة:** 2 - ربط الخدمات بـ Database  
**الحالة:** جاهز للتطبيق
