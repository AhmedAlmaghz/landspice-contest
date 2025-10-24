// Navigation and Routes Configuration

export const ROUTES = {
  // Public Routes
  HOME: '/',
  REGISTER: '/register',
  REGISTER_COMPANY: '/register/company',
  REGISTER_PARTICIPANT: '/register/participant',
  ALL_CONTESTS: '/contests',
  ALL_COMPANIES: '/companies',
  
  // Admin Routes
  ADMIN: '/admin',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_CONTESTS: '/admin/contests',
  ADMIN_PLATFORMS: '/admin/platforms',
  ADMIN_LOGIN: '/admin/login',
  
  // Company Routes
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_CONTESTS: '/company/contests',
  COMPANY_PLATFORMS: '/company/platforms',
  COMPANY_PARTICIPANTS: '/company/participants',
  COMPANY_ANALYTICS: '/company/analytics',
  COMPANY_LOGIN: '/company/login',
  
  // Participant Routes
  PARTICIPANT_DASHBOARD: '/participant/dashboard',
  PARTICIPANT_CONTESTS: '/participant/contests',
  PARTICIPANT_PROFILE: '/participant/profile',
  PARTICIPANT_REFERRALS: '/participant/referrals',
};

export const NAVIGATION_ITEMS = {
  ADMIN: [
    { label: 'لوحة التحكم', href: ROUTES.ADMIN, icon: 'BarChart3' },
    { label: 'الشركات', href: ROUTES.ADMIN_COMPANIES, icon: 'Building2' },
    { label: 'المسابقات', href: ROUTES.ADMIN_CONTESTS, icon: 'Trophy' },
    { label: 'الشبكات الاجتماعية', href: ROUTES.ADMIN_PLATFORMS, icon: 'Share2' },
  ],
  COMPANY: [
    { label: 'لوحة التحكم', href: ROUTES.COMPANY_DASHBOARD, icon: 'BarChart3' },
    { label: 'المسابقات', href: ROUTES.COMPANY_CONTESTS, icon: 'Trophy' },
    { label: 'الشبكات الاجتماعية', href: ROUTES.COMPANY_PLATFORMS, icon: 'Share2' },
    { label: 'المشاركون', href: ROUTES.COMPANY_PARTICIPANTS, icon: 'Users' },
    { label: 'التحليلات', href: ROUTES.COMPANY_ANALYTICS, icon: 'TrendingUp' },
  ],
  PARTICIPANT: [
    { label: 'لوحة التحكم', href: ROUTES.PARTICIPANT_DASHBOARD, icon: 'BarChart3' },
    { label: 'المسابقات', href: ROUTES.PARTICIPANT_CONTESTS, icon: 'Trophy' },
    { label: 'الملف الشخصي', href: ROUTES.PARTICIPANT_PROFILE, icon: 'User' },
    { label: 'الإحالات', href: ROUTES.PARTICIPANT_REFERRALS, icon: 'Gift' },
  ],
};

export const BREADCRUMB_ITEMS: Record<string, Array<{ label: string; href?: string }>> = {
  [ROUTES.ADMIN]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة التحكم' }],
  [ROUTES.ADMIN_COMPANIES]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'الإدارة', href: ROUTES.ADMIN }, { label: 'الشركات' }],
  [ROUTES.ADMIN_CONTESTS]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'الإدارة', href: ROUTES.ADMIN }, { label: 'المسابقات' }],
  [ROUTES.ADMIN_PLATFORMS]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'الإدارة', href: ROUTES.ADMIN }, { label: 'الشبكات الاجتماعية' }],
  [ROUTES.COMPANY_DASHBOARD]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة الشركة' }],
  [ROUTES.COMPANY_CONTESTS]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة الشركة', href: ROUTES.COMPANY_DASHBOARD }, { label: 'المسابقات' }],
  [ROUTES.COMPANY_PLATFORMS]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة الشركة', href: ROUTES.COMPANY_DASHBOARD }, { label: 'الشبكات الاجتماعية' }],
  [ROUTES.PARTICIPANT_DASHBOARD]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة المشارك' }],
  [ROUTES.PARTICIPANT_CONTESTS]: [{ label: 'الرئيسية', href: ROUTES.HOME }, { label: 'لوحة المشارك', href: ROUTES.PARTICIPANT_DASHBOARD }, { label: 'المسابقات' }],
};
