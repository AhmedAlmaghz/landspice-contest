// src/lib/permissions.ts
// نظام الصلاحيات والأدوار

import { UserRole } from '@/types/saas';

export const PERMISSIONS = {
  // صلاحيات المسابقات
  CREATE_CONTEST: 'create_contest',
  EDIT_CONTEST: 'edit_contest',
  DELETE_CONTEST: 'delete_contest',
  VIEW_CONTEST: 'view_contest',
  PUBLISH_CONTEST: 'publish_contest',

  // صلاحيات الشبكات الاجتماعية
  MANAGE_PLATFORMS: 'manage_platforms',
  ADD_PLATFORM: 'add_platform',
  EDIT_PLATFORM: 'edit_platform',
  DELETE_PLATFORM: 'delete_platform',

  // صلاحيات المشاركين
  VIEW_PARTICIPANTS: 'view_participants',
  EXPORT_PARTICIPANTS: 'export_participants',
  MANAGE_PARTICIPANTS: 'manage_participants',
  DELETE_PARTICIPANT: 'delete_participant',

  // صلاحيات السحب والفائزين
  MANAGE_DRAW: 'manage_draw',
  VIEW_WINNERS: 'view_winners',
  ANNOUNCE_WINNERS: 'announce_winners',

  // صلاحيات الإعدادات
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_TEAM: 'manage_team',
  MANAGE_BILLING: 'manage_billing',

  // صلاحيات التحليلات
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_ANALYTICS: 'export_analytics',

  // صلاحيات الإدارة العامة
  MANAGE_COMPANIES: 'manage_companies',
  MANAGE_USERS: 'manage_users',
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [UserRole.COMPANY_ADMIN]: [
    PERMISSIONS.CREATE_CONTEST,
    PERMISSIONS.EDIT_CONTEST,
    PERMISSIONS.DELETE_CONTEST,
    PERMISSIONS.VIEW_CONTEST,
    PERMISSIONS.PUBLISH_CONTEST,
    PERMISSIONS.MANAGE_PLATFORMS,
    PERMISSIONS.ADD_PLATFORM,
    PERMISSIONS.EDIT_PLATFORM,
    PERMISSIONS.DELETE_PLATFORM,
    PERMISSIONS.VIEW_PARTICIPANTS,
    PERMISSIONS.EXPORT_PARTICIPANTS,
    PERMISSIONS.MANAGE_PARTICIPANTS,
    PERMISSIONS.MANAGE_DRAW,
    PERMISSIONS.VIEW_WINNERS,
    PERMISSIONS.ANNOUNCE_WINNERS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_ANALYTICS,
  ],

  [UserRole.COMPANY_MANAGER]: [
    PERMISSIONS.CREATE_CONTEST,
    PERMISSIONS.EDIT_CONTEST,
    PERMISSIONS.VIEW_CONTEST,
    PERMISSIONS.PUBLISH_CONTEST,
    PERMISSIONS.MANAGE_PLATFORMS,
    PERMISSIONS.ADD_PLATFORM,
    PERMISSIONS.EDIT_PLATFORM,
    PERMISSIONS.DELETE_PLATFORM,
    PERMISSIONS.VIEW_PARTICIPANTS,
    PERMISSIONS.EXPORT_PARTICIPANTS,
    PERMISSIONS.MANAGE_DRAW,
    PERMISSIONS.VIEW_WINNERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_ANALYTICS,
  ],

  [UserRole.COMPANY_VIEWER]: [
    PERMISSIONS.VIEW_CONTEST,
    PERMISSIONS.VIEW_PARTICIPANTS,
    PERMISSIONS.VIEW_WINNERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  [UserRole.PARTICIPANT]: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'مسؤول النظام',
    [UserRole.COMPANY_ADMIN]: 'مسؤول الشركة',
    [UserRole.COMPANY_MANAGER]: 'مدير الشركة',
    [UserRole.COMPANY_VIEWER]: 'عارض الشركة',
    [UserRole.PARTICIPANT]: 'مشارك',
  };
  return labels[role];
}

export const SUBSCRIPTION_LIMITS = {
  free: {
    max_contests: 1,
    max_participants: 100,
    max_platforms: 3,
    auto_verify: false,
  },
  pro: {
    max_contests: 10,
    max_participants: 5000,
    max_platforms: 10,
    auto_verify: true,
  },
  enterprise: {
    max_contests: Infinity,
    max_participants: Infinity,
    max_platforms: Infinity,
    auto_verify: true,
  },
} as const;
