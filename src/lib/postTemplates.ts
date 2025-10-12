import { Participant } from '@/types';

export interface PostTemplate {
  id: string;
  name: string;
  description: string;
  generate: (data: any) => string;
}

// قالب إعلان الفائزين
export const winnersAnnouncementTemplate: PostTemplate = {
  id: 'winners-announcement',
  name: 'إعلان الفائزين',
  description: 'قالب للإعلان عن الفائزين في المسابقة',
  generate: (data: { winners: Participant[]; contestTitle: string }) => {
    const { winners, contestTitle } = data;
    
    let post = `🎉 إعلان الفائزين في ${contestTitle}! 🎉\n\n`;
    post += `نهنئ الفائزين الذين تم اختيارهم عشوائياً:\n\n`;
    
    winners.forEach((winner, index) => {
      post += `${index + 1}. ${winner.name} - ${winner.city} 🏆\n`;
    });
    
    post += `\n✨ مبروك للفائزين! سيتم التواصل معكم قريباً.\n`;
    post += `\n🙏 شكراً لجميع المشاركين على دعمكم ومتابعتكم.\n`;
    post += `\n#مسابقة_LandSpice #الفائزون #مبروك`;
    
    return post;
  }
};

// قالب شكر للمشاركين
export const thankYouTemplate: PostTemplate = {
  id: 'thank-you',
  name: 'شكر للمشاركين',
  description: 'قالب لشكر جميع المشاركين',
  generate: (data: { totalParticipants: number; contestTitle: string }) => {
    const { totalParticipants, contestTitle } = data;
    
    let post = `🙏 شكراً لكم! 🙏\n\n`;
    post += `انتهت ${contestTitle} بنجاح كبير!\n\n`;
    post += `📊 إحصائيات المسابقة:\n`;
    post += `• عدد المشاركين: ${totalParticipants} مشارك\n`;
    post += `• شكراً لكل من شارك ودعمنا ❤️\n\n`;
    post += `ترقبوا مسابقات جديدة قريباً! 🎁\n\n`;
    post += `#شكراً #LandSpice #مسابقة`;
    
    return post;
  }
};

// قالب إحصائيات المسابقة
export const statsTemplate: PostTemplate = {
  id: 'contest-stats',
  name: 'إحصائيات المسابقة',
  description: 'قالب لعرض إحصائيات المسابقة',
  generate: (data: { 
    totalParticipants: number;
    totalShares: number;
    totalReferrals: number;
    completedParticipants: number;
    contestTitle: string;
  }) => {
    const { totalParticipants, totalShares, totalReferrals, completedParticipants, contestTitle } = data;
    
    let post = `📊 إحصائيات ${contestTitle} 📊\n\n`;
    post += `نشكركم على المشاركة الرائعة! إليكم الأرقام:\n\n`;
    post += `👥 إجمالي المشاركين: ${totalParticipants}\n`;
    post += `✅ أكملوا جميع المتطلبات: ${completedParticipants}\n`;
    post += `📢 إجمالي المشاركات: ${totalShares}\n`;
    post += `🔗 إجمالي الإحالات: ${totalReferrals}\n\n`;
    post += `شكراً لدعمكم المستمر! ❤️\n\n`;
    post += `#إحصائيات #LandSpice #مسابقة #شكراً`;
    
    return post;
  }
};

// قالب دعوة لمسابقة جديدة
export const newContestTemplate: PostTemplate = {
  id: 'new-contest',
  name: 'مسابقة جديدة',
  description: 'قالب للإعلان عن مسابقة جديدة',
  generate: (data: { 
    contestTitle: string;
    prizeDescription: string;
    endDate: string;
    contestUrl: string;
  }) => {
    const { contestTitle, prizeDescription, endDate, contestUrl } = data;
    
    let post = `🎉 مسابقة جديدة! 🎉\n\n`;
    post += `${contestTitle}\n\n`;
    post += `🎁 الجوائز:\n${prizeDescription}\n\n`;
    post += `📅 تنتهي المسابقة: ${endDate}\n\n`;
    post += `✨ للمشاركة:\n`;
    post += `1️⃣ تابع جميع صفحاتنا\n`;
    post += `2️⃣ شارك المسابقة مع أصدقائك\n`;
    post += `3️⃣ سجل الآن: ${contestUrl}\n\n`;
    post += `حظاً موفقاً للجميع! 🍀\n\n`;
    post += `#مسابقة_جديدة #LandSpice #جوائز #مسابقة`;
    
    return post;
  }
};

// قالب تذكير بانتهاء المسابقة
export const reminderTemplate: PostTemplate = {
  id: 'contest-reminder',
  name: 'تذكير بالمسابقة',
  description: 'قالب للتذكير بانتهاء المسابقة قريباً',
  generate: (data: { 
    contestTitle: string;
    daysLeft: number;
    contestUrl: string;
  }) => {
    const { contestTitle, daysLeft, contestUrl } = data;
    
    let post = `⏰ تذكير مهم! ⏰\n\n`;
    post += `${contestTitle}\n\n`;
    post += `⚠️ تبقى ${daysLeft} أيام فقط على انتهاء المسابقة!\n\n`;
    post += `لم تشارك بعد؟ لا تفوت الفرصة!\n\n`;
    post += `🔗 سجل الآن: ${contestUrl}\n\n`;
    post += `أسرع قبل فوات الأوان! ⏳\n\n`;
    post += `#تذكير #مسابقة #LandSpice #أسرع`;
    
    return post;
  }
};

// دالة للحصول على جميع القوالب
export const getAllTemplates = (): PostTemplate[] => {
  return [
    winnersAnnouncementTemplate,
    thankYouTemplate,
    statsTemplate,
    newContestTemplate,
    reminderTemplate
  ];
};

// دالة للحصول على قالب بالـ ID
export const getTemplateById = (id: string): PostTemplate | undefined => {
  return getAllTemplates().find(template => template.id === id);
};

// دالة لتوليد منشور من قالب
export const generatePost = (templateId: string, data: any): string | null => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  return template.generate(data);
};
