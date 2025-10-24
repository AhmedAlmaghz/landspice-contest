'use client';

import SocialLinks from './SocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🌶️ LandSpice
            </h3>
            <p className="text-purple-200 leading-relaxed">
              منصة احترافية لإدارة مسابقات المتابعة والمشاركة على وسائل التواصل الاجتماعي.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-purple-200 hover:text-white transition-colors">
                  الصفحة الرئيسية
                </a>
              </li>
              <li>
                <a href="/register" className="text-purple-200 hover:text-white transition-colors">
                  التسجيل
                </a>
              </li>
              <li>
                <a href="/register/company" className="text-purple-200 hover:text-white transition-colors">
                  تسجيل الشركة
                </a>
              </li>
              <li>
                <a href="/register/participant" className="text-purple-200 hover:text-white transition-colors">
                  تسجيل المشارك
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-purple-200 hover:text-white transition-colors">
                  دخول الإدارة
                </a>
              </li>
              <li>
                <a href="/admin" className="text-purple-200 hover:text-white transition-colors">
                  لوحة الإدارة
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الإدارة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/admin/companies" className="text-purple-200 hover:text-white transition-colors">
                  إدارة الشركات
                </a>
              </li>
              <li>
                <a href="/admin/contests" className="text-purple-200 hover:text-white transition-colors">
                  إدارة المسابقات
                </a>
              </li>
              <li>
                <a href="/admin/platforms" className="text-purple-200 hover:text-white transition-colors">
                  إدارة الشبكات
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/company/login" className="text-purple-200 hover:text-white transition-colors">
                  دخول الشركة
                </a>
              </li>
              <li>
                <a href="/company/dashboard" className="text-purple-200 hover:text-white transition-colors">
                  لوحة الشركة
                </a>
              </li>
              <li>
                <a href="/company/contests" className="text-purple-200 hover:text-white transition-colors">
                  المسابقات
                </a>
              </li>
              <li>
                <a href="/company/platforms" className="text-purple-200 hover:text-white transition-colors">
                  الشبكات
                </a>
              </li>
              <li>
                <a href="/company/participants" className="text-purple-200 hover:text-white transition-colors">
                  المشاركون
                </a>
              </li>
              <li>
                <a href="/company/analytics" className="text-purple-200 hover:text-white transition-colors">
                  التحليلات
                </a>
              </li>
            </ul>
          </div>

          {/* Participant Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">المشارك</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/participant/dashboard" className="text-purple-200 hover:text-white transition-colors">
                  لوحة التحكم
                </a>
              </li>
              <li>
                <a href="/participant/contests" className="text-purple-200 hover:text-white transition-colors">
                  المسابقات
                </a>
              </li>
              <li>
                <a href="/participant/profile" className="text-purple-200 hover:text-white transition-colors">
                  الملف الشخصي
                </a>
              </li>
              <li>
                <a href="/participant/referrals" className="text-purple-200 hover:text-white transition-colors">
                  الإحالات
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
            <div className="flex justify-center md:justify-start">
              <SocialLinks
                compact={true}
                className="gap-3"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-purple-700 pt-8 text-center">
          <p className="text-purple-200">
            © {currentYear} LandSpice Contest. جميع الحقوق محفوظة.
          </p>
          <p className="text-purple-300 text-sm mt-2">
            صُنع بـ ❤️ في اليمن 🇾🇪
          </p>
        </div>
      </div>
    </footer>
  );
}
