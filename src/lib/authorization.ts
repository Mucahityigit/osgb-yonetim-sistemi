// ==========================================
// OSGB Yönetim Sistemi - Yetkilendirme (RBAC)
// ==========================================

/**
 * Rol bazlı erişim kontrol kuralları
 * 
 * ADMIN:   OSGB Yöneticisi — Tüm verilere tam erişim, tam CRUD
 * EXPERT:  İş Güvenliği Uzmanı — Atandığı firmalar, CRUD (veri türüne göre)
 * DOCTOR:  İşyeri Hekimi — Atandığı firmalar, CRUD (sağlık verileri)
 * DSP:     Diğer Sağlık Personeli — Atandığı firmalar, kısıtlı CRUD
 * CLIENT:  Müşteri Firma Yetkilisi — SADECE kendi firması, SADECE OKUMA
 */

export type UserRole = 'ADMIN' | 'EXPERT' | 'DOCTOR' | 'DSP' | 'CLIENT'

// Demo kullanıcılar için firma atama haritası
export const DEMO_FIRM_ASSIGNMENTS: Record<string, string[]> = {
  'demo-admin': ['1', '2', '3', '4', '5', '6', '7'],
  'demo-expert': ['1', '2', '5', '6'],
  'demo-doctor': ['1', '3', '4', '5'],
  'demo-client': ['2'],
}

// Personelin İş Sözleşmeleri (OSGB-Personel arası)
export const DEMO_EMPLOYMENT_CONTRACTS = [
  { id: 'emp-1', userId: 'demo-expert', name: 'Ahmet Yılmaz', role: 'İş Güvenliği Uzmanı (A)', start: '2023-06-01', end: '2026-05-31', salary: 45000, status: 'Aktif' },
  { id: 'emp-2', userId: 'demo-doctor', name: 'Dr. Zeynep Acar', role: 'İşyeri Hekimi', start: '2023-01-15', end: '2026-01-14', salary: 55000, status: 'Aktif' },
]

// ==========================================
// SAYFA ERİŞİM İZİNLERİ
// ==========================================
// CLIENT: Kendi firmasının İSG süreçlerini TAKİP edebilir (salt okunur)
// Firmalar, Sözleşmeler, Çalışanlar: CLIENT görmez (yönetim sayfaları)
// Kazalar, Ziyaretler, Eğitimler, Belgeler: CLIENT görebilir (salt okunur)
export const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard':               ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/firmalar':      ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP'],          // CLIENT görmez
  '/dashboard/sozlesmeler':   ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP'],          // CLIENT görmez
  '/dashboard/calisanlar':    ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP'],          // CLIENT görmez
  '/dashboard/ziyaretler':    ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/kazalar':       ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/ramak-kala':    ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/meslek-hastaliklari': ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/risk-degerlendirme':  ['ADMIN', 'EXPERT'],
  '/dashboard/egitimler':     ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/belgeler':      ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/kkd':           ['ADMIN', 'EXPERT', 'DSP', 'CLIENT'],
  '/dashboard/isg-kurulu':    ['ADMIN', 'EXPERT', 'DOCTOR'],
  '/dashboard/olcumler':      ['ADMIN', 'EXPERT', 'CLIENT'],
  '/dashboard/saglik-muayene':['ADMIN', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/psikososyal':   ['ADMIN', 'EXPERT', 'DOCTOR'],
  '/dashboard/isg-katip':     ['ADMIN', 'EXPERT'],
  '/dashboard/faturalar':     ['ADMIN'],
  '/dashboard/raporlar':      ['ADMIN', 'EXPERT', 'DOCTOR'],
  '/dashboard/bildirimler':   ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP', 'CLIENT'],
  '/dashboard/kullanicilar':  ['ADMIN'],
  '/dashboard/denetim-izi':   ['ADMIN'],
  '/dashboard/ayarlar':       ['ADMIN'],
}

// ==========================================
// İŞLEM İZİNLERİ (CRUD)
// ==========================================
// CLIENT hiçbir yerde CREATE/EDIT/DELETE yapamaz
export const ACTION_PERMISSIONS = {
  // Firma Yönetimi
  FIRM_CREATE:    ['ADMIN'] as UserRole[],
  FIRM_EDIT:      ['ADMIN'] as UserRole[],
  FIRM_DELETE:    ['ADMIN'] as UserRole[],
  FIRM_VIEW:      ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP'] as UserRole[],

  // Sözleşme Yönetimi
  CONTRACT_VIEW_SERVICE:    ['ADMIN', 'CLIENT'] as UserRole[],
  CONTRACT_VIEW_EMPLOYMENT: ['ADMIN', 'EXPERT', 'DOCTOR', 'DSP'] as UserRole[],
  CONTRACT_CREATE:          ['ADMIN'] as UserRole[],

  // Ziyaret Yönetimi
  VISIT_CREATE:   ['ADMIN', 'EXPERT'] as UserRole[],
  VISIT_EDIT:     ['ADMIN', 'EXPERT'] as UserRole[],

  // İş Kazası
  ACCIDENT_CREATE:['ADMIN', 'EXPERT', 'DOCTOR'] as UserRole[],
  ACCIDENT_EDIT:  ['ADMIN', 'EXPERT'] as UserRole[],

  // Ramak Kala
  NEAR_MISS_CREATE: ['ADMIN', 'EXPERT'] as UserRole[],

  // Meslek Hastalığı
  OCC_DISEASE_CREATE: ['ADMIN', 'DOCTOR'] as UserRole[],

  // Risk Değerlendirme
  RISK_CREATE:    ['ADMIN', 'EXPERT'] as UserRole[],
  RISK_APPROVE:   ['ADMIN'] as UserRole[],

  // Eğitim
  TRAINING_CREATE:['ADMIN', 'EXPERT'] as UserRole[],

  // Belge
  DOCUMENT_UPLOAD:['ADMIN', 'EXPERT', 'DOCTOR'] as UserRole[],
  DOCUMENT_DELETE:['ADMIN'] as UserRole[],

  // KKD
  KKD_CREATE:     ['ADMIN', 'EXPERT', 'DSP'] as UserRole[],

  // İSG Kurulu
  ISG_MEETING_CREATE: ['ADMIN', 'EXPERT'] as UserRole[],

  // Ölçümler
  MEASUREMENT_CREATE: ['ADMIN', 'EXPERT'] as UserRole[],

  // Sağlık Muayene
  HEALTH_EXAM_CREATE: ['ADMIN', 'DOCTOR'] as UserRole[],

  // Psikososyal
  PSYCHO_CREATE:  ['ADMIN', 'EXPERT', 'DOCTOR'] as UserRole[],

  // Bildirim
  NOTIFICATION_MANAGE: ['ADMIN'] as UserRole[],

  // Yönetim
  USER_MANAGE:     ['ADMIN'] as UserRole[],
  SETTINGS_MANAGE: ['ADMIN'] as UserRole[],
  AUDIT_VIEW:      ['ADMIN'] as UserRole[],
  INVOICE_MANAGE:  ['ADMIN'] as UserRole[],
  REPORT_EXPORT:   ['ADMIN', 'EXPERT', 'DOCTOR'] as UserRole[],

  // Excel İçe/Dışa Aktar
  DATA_IMPORT:     ['ADMIN'] as UserRole[],
  DATA_EXPORT:     ['ADMIN', 'EXPERT', 'DOCTOR'] as UserRole[],
}

export function canAccessPage(role: UserRole, path: string): boolean {
  const permissions = PAGE_PERMISSIONS[path]
  if (!permissions) return role === 'ADMIN'
  return permissions.includes(role)
}

export function canPerformAction(role: UserRole, action: keyof typeof ACTION_PERMISSIONS): boolean {
  return ACTION_PERMISSIONS[action].includes(role)
}

export function getAccessibleFirmIds(role: UserRole, userId: string, organizationId?: string | null): string[] {
  if (role === 'ADMIN') return []
  if (role === 'CLIENT' && organizationId) return [organizationId]
  return DEMO_FIRM_ASSIGNMENTS[userId] || []
}

export function filterByFirm<T extends Record<string, unknown>>(
  data: T[],
  accessibleFirmIds: string[],
  firmIdKey: keyof T = 'firmId' as keyof T
): T[] {
  if (accessibleFirmIds.length === 0) return data
  return data.filter(item => {
    const fId = String(item[firmIdKey] ?? item.id ?? '')
    return accessibleFirmIds.includes(fId)
  })
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId: string | null
  assignedFirmIds: string[]
}

export function extractUserFromSession(session: { user?: Record<string, unknown> } | null): AuthUser | null {
  if (!session?.user) return null
  const user = session.user
  const role = (String(user.role || 'EXPERT')) as UserRole
  const userId = String(user.id || '')
  const organizationId = user.organizationId ? String(user.organizationId) : null
  const assignedFirmIds = getAccessibleFirmIds(role, userId, organizationId)

  return {
    id: userId,
    name: String(user.name || ''),
    email: String(user.email || ''),
    role,
    organizationId,
    assignedFirmIds,
  }
}

