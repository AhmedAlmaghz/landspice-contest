'use client';

import { CheckCircle } from 'lucide-react';

export default function ContestRules() {
  const rules = [
    'يجب متابعة جميع صفحاتنا على وسائل التواصل الاجتماعي',
    'مشاركة المسابقة مع الأصدقاء والمجموعات',
    'كل مشاركة تحسب نقطة إضافية',
    'المسابقة تنتهي في التاريخ المحدد',
    'سيتم السحب العشوائي وإعلان النتائج',
    'سيتم التواصل مع الفائزين عبر الهاتف أو البريد الإلكتروني',
    'يجب أن يكون المشارك مقيم في الجمهورية اليمنية',
    'يحق للمنظمين تعديل شروط المسابقة في أي وقت',
    'المشاركة في المسابقة تعني الموافقة على جميع الشروط والأحكام'
  ];

  return (
    <div className="card hover:shadow-2xl transition-all duration-300">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <span className="text-5xl">📋</span>
        </div>
        <h3 className="text-4xl font-bold text-gray-800 mb-3">شروط وأحكام المسابقة</h3>
        <p className="text-gray-600 text-lg">يرجى قراءة الشروط بعناية قبل المشاركة</p>
      </div>
      
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-102 border border-gray-100"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              {index + 1}
            </div>
            <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <p className="text-gray-800 text-lg leading-relaxed font-medium">{rule}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📞</span>
          <h4 className="text-2xl font-bold text-blue-900">للاستفسارات والدعم</h4>
        </div>
        <p className="text-blue-800 text-lg leading-relaxed">
          إذا كان لديك أي استفسارات حول المسابقة أو تحتاج إلى مساعدة، نحن هنا لخدمتك!
          <br />
          <span className="font-semibold">تواصل معنا عبر وسائل التواصل الاجتماعي أو البريد الإلكتروني.</span>
        </p>
      </div>
    </div>
  );
}
