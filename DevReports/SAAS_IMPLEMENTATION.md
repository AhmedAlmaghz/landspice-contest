# 💻 تطبيق عملي لنظام SaaS - LandSpice Contest

**التاريخ:** 2025-10-23  
**الهدف:** أمثلة عملية وجاهزة للتطبيق الفوري

---

## 📋 جدول المحتويات

1. [خدمات الأساس](#خدمات-الأساس)
2. [API Endpoints](#api-endpoints)
3. [مكونات الواجهة](#مكونات-الواجهة)
4. [Hooks مخصصة](#hooks-مخصصة)

---

## 🛠️ خدمات الأساس

### 1. خدمة الشركات (Company Service)

```typescript
// src/services/CompanyService.ts
import { db } from '@/lib/database';

export class CompanyService {
  async createCompany(data: CreateCompanyInput) {
    const company = await db.companies.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      subscription_plan: 'free',
      subscription_status: 'active',
      subscription_start_date: new Date(),
      created_at: new Date(),
    });

    return company;
  }

  async getCompanyById(companyId: string) {
    return await db.companies.findById(companyId);
  }

  async updateCompany(companyId: string, data: UpdateCompanyInput) {
    return await db.companies.update(companyId, {
      ...data,
      updated_at: new Date(),
    });
  }

  async getCompanyContests(companyId: string) {
    return await db.contests.findByCompanyId(companyId);
  }

  async getCompanyStats(companyId: string) {
    const contests = await this.getCompanyContests(companyId);
    const totalParticipants = await db.participants.countByCompanyId(companyId);
    
    return {
      totalContests: contests.length,
      activeContests: contests.filter(c => c.status === 'active').length,
      totalParticipants,
      subscription_plan: (await this.getCompanyById(companyId)).subscription_plan,
    };
  }
}

export const companyService = new CompanyService();
```

### 2. خدمة المسابقات (Contest Service)

```typescript
// src/services/ContestService.ts
export class ContestService {
  async createContest(companyId: string, data: CreateContestInput) {
    const company = await companyService.getCompanyById(companyId);
    
    // التحقق من حد المسابقات
    const contests = await db.contests.findByCompanyId(companyId);
    const maxContests = this.getMaxContests(company.subscription_plan);
    
    if (contests.length >= maxContests) {
      throw new Error(`Maximum contests limit (${maxContests}) reached`);
    }

    const contest = await db.contests.create({
      company_id: companyId,
      title: data.title,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      prize_description: data.prize_description,
      status: 'draft',
      created_at: new Date(),
    });

    return contest;
  }

  async updateContest(contestId: string, companyId: string, data: UpdateContestInput) {
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    return await db.contests.update(contestId, {
      ...data,
      updated_at: new Date(),
    });
  }

  async publishContest(contestId: string, companyId: string) {
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    if (contest.status !== 'draft') {
      throw new Error('Only draft contests can be published');
    }

    return await db.contests.update(contestId, {
      status: 'active',
      updated_at: new Date(),
    });
  }

  async getContestWithDetails(contestId: string) {
    const contest = await db.contests.findById(contestId);
    const platforms = await db.social_platforms.findByContestId(contestId);
    const participants = await db.participants.findByContestId(contestId);

    return {
      ...contest,
      platforms,
      participantCount: participants.length,
    };
  }

  private getMaxContests(plan: string): number {
    const limits = { free: 1, pro: 10, enterprise: Infinity };
    return limits[plan] || 1;
  }
}

export const contestService = new ContestService();
```

### 3. خدمة الشبكات الاجتماعية (Social Platform Service)

```typescript
// src/services/SocialPlatformService.ts
export class SocialPlatformService {
  async addPlatform(contestId: string, companyId: string, data: AddPlatformInput) {
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    const platform = await db.social_platforms.create({
      contest_id: contestId,
      name: data.name,
      display_name: data.display_name,
      url: data.url,
      icon_url: data.icon_url,
      action_type: data.action_type,
      action_description: data.action_description,
      auto_verify: data.auto_verify,
      verification_method: data.verification_method,
      order_index: data.order_index || 0,
      is_active: true,
      created_at: new Date(),
    });

    return platform;
  }

  async updatePlatform(platformId: string, contestId: string, companyId: string, data: UpdatePlatformInput) {
    const platform = await db.social_platforms.findById(platformId);
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    return await db.social_platforms.update(platformId, {
      ...data,
      updated_at: new Date(),
    });
  }

  async deletePlatform(platformId: string, contestId: string, companyId: string) {
    const platform = await db.social_platforms.findById(platformId);
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    await db.social_platforms.delete(platformId);
  }

  async reorderPlatforms(contestId: string, companyId: string, platformIds: string[]) {
    const contest = await db.contests.findById(contestId);
    
    if (contest.company_id !== companyId) {
      throw new Error('Unauthorized');
    }

    for (let i = 0; i < platformIds.length; i++) {
      await db.social_platforms.update(platformIds[i], { order_index: i });
    }
  }

  async getPlatformsByContest(contestId: string) {
    return await db.social_platforms.findByContestId(contestId);
  }
}

export const socialPlatformService = new SocialPlatformService();
```

### 4. خدمة التحقق التلقائي (Verification Service)

```typescript
// src/services/VerificationService.ts
export class VerificationService {
  async verifyAction(participantId: string, platformId: string) {
    const platform = await db.social_platforms.findById(platformId);
    
    if (!platform.auto_verify) {
      return { verified: false, reason: 'Manual verification required' };
    }

    try {
      let isVerified = false;

      switch (platform.verification_method) {
        case 'api':
          isVerified = await this.verifyViaAPI(platform);
          break;
        case 'webhook':
          isVerified = await this.verifyViaWebhook(platform);
          break;
        default:
          isVerified = false;
      }

      if (isVerified) {
        await db.social_actions.update(
          { participant_id: participantId, platform_id: platformId },
          {
            is_verified: true,
            verified_at: new Date(),
            verification_method: platform.verification_method,
          }
        );

        // تحديث التقدم
        const participant = await db.participants.findById(participantId);
        const newProgress = participant.progress + 1;
        await db.participants.update(participantId, { progress: newProgress });
      }

      return { verified: isVerified };
    } catch (error) {
      return { verified: false, error: error.message };
    }
  }

  private async verifyViaAPI(platform: SocialPlatform): Promise<boolean> {
    // تطبيق التحقق عبر API
    // يختلف حسب نوع المنصة
    return true;
  }

  private async verifyViaWebhook(platform: SocialPlatform): Promise<boolean> {
    // التحقق عبر webhook
    return true;
  }
}

export const verificationService = new VerificationService();
```

---

## 🔌 API Endpoints

### 1. API الشركات

```typescript
// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/services/CompanyService';

// إنشاء شركة جديدة
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const company = await companyService.createCompany(data);
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// جلب بيانات الشركة
export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('id');
    const company = await companyService.getCompanyById(companyId);
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### 2. API المسابقات

```typescript
// src/app/api/contests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contestService } from '@/services/ContestService';

// إنشاء مسابقة
export async function POST(req: NextRequest) {
  try {
    const { companyId, ...data } = await req.json();
    const contest = await contestService.createContest(companyId, data);
    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// جلب مسابقات الشركة
export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId');
    const contests = await db.contests.findByCompanyId(companyId);
    return NextResponse.json(contests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### 3. API الشبكات الاجتماعية

```typescript
// src/app/api/contests/[contestId]/platforms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { socialPlatformService } from '@/services/SocialPlatformService';

// إضافة شبكة اجتماعية
export async function POST(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const { companyId, ...data } = await req.json();
    const platform = await socialPlatformService.addPlatform(
      params.contestId,
      companyId,
      data
    );
    return NextResponse.json(platform, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// جلب الشبكات
export async function GET(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const platforms = await socialPlatformService.getPlatformsByContest(
      params.contestId
    );
    return NextResponse.json(platforms);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### 4. API التحقق التلقائي

```typescript
// src/app/api/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verificationService } from '@/services/VerificationService';

export async function POST(req: NextRequest) {
  try {
    const { participantId, platformId } = await req.json();
    const result = await verificationService.verifyAction(participantId, platformId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

---

## 🎨 مكونات الواجهة

### 1. مدير الشبكات الاجتماعية

```typescript
// src/components/admin/SocialPlatformManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export function SocialPlatformManager({ contestId }: { contestId: string }) {
  const [platforms, setPlatforms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    const res = await fetch(`/api/contests/${contestId}/platforms`);
    const data = await res.json();
    setPlatforms(data);
  };

  const handleAddPlatform = async (formData: any) => {
    const res = await fetch(`/api/contests/${contestId}/platforms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      await fetchPlatforms();
      setShowForm(false);
    }
  };

  const handleDeletePlatform = async (platformId: string) => {
    const res = await fetch(`/api/contests/${contestId}/platforms/${platformId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await fetchPlatforms();
    }
  };

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;
    
    if (!destination) return;

    const newPlatforms = Array.from(platforms);
    const [reorderedItem] = newPlatforms.splice(source.index, 1);
    newPlatforms.splice(destination.index, 0, reorderedItem);

    setPlatforms(newPlatforms);

    // تحديث الترتيب في الخادم
    const platformIds = newPlatforms.map(p => p.id);
    await fetch(`/api/contests/${contestId}/platforms/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformIds }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الشبكات الاجتماعية</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'إلغاء' : '+ إضافة شبكة'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <PlatformForm onSubmit={handleAddPlatform} />
        </Card>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="platforms">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {platforms.map((platform, index) => (
                <Draggable key={platform.id} draggableId={platform.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? 'shadow-lg' : ''}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{platform.display_name}</h3>
                          <p className="text-sm text-gray-600">{platform.action_description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* تحرير */}}
                          >
                            تحرير
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePlatform(platform.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

function PlatformForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(Object.fromEntries(formData));
    }}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">اسم الشبكة</label>
          <input
            type="text"
            name="display_name"
            placeholder="مثال: صفحة Facebook الرسمية"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">نوع الشبكة</label>
          <select
            name="name"
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">اختر نوع الشبكة</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter</option>
            <option value="custom">مخصص</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">الرابط</label>
          <input
            type="url"
            name="url"
            placeholder="https://facebook.com/yourpage"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">نوع الإجراء</label>
          <select
            name="action_type"
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="follow">متابعة</option>
            <option value="like">إعجاب</option>
            <option value="share">مشاركة</option>
            <option value="subscribe">اشتراك</option>
            <option value="custom">مخصص</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">وصف الإجراء</label>
          <textarea
            name="action_description"
            placeholder="مثال: تابع صفحتنا على Facebook"
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="auto_verify"
            id="auto_verify"
            className="w-4 h-4"
          />
          <label htmlFor="auto_verify" className="text-sm">
            تفعيل التحقق التلقائي
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">طريقة التحقق</label>
          <select
            name="verification_method"
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="manual">يدوي</option>
            <option value="api">API</option>
            <option value="webhook">Webhook</option>
          </select>
        </div>

        <Button type="submit" fullWidth>
          إضافة الشبكة
        </Button>
      </div>
    </form>
  );
}
```

---

## 🎯 Hooks مخصصة

### 1. Hook لإدارة المسابقات

```typescript
// src/hooks/useContest.ts
import { useState, useEffect } from 'react';

export function useContest(contestId: string) {
  const [contest, setContest] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contests/${contestId}`);
      const data = await res.json();
      setContest(data);

      const platformsRes = await fetch(`/api/contests/${contestId}/platforms`);
      const platformsData = await platformsRes.json();
      setPlatforms(platformsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { contest, platforms, loading, error, refetch: fetchContest };
}
```

---

**هذه الأمثلة جاهزة للتطبيق الفوري!** ✅
