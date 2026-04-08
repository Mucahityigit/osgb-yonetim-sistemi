// ==========================================
// OSGB Yönetim Sistemi - Utility Fonksiyonları
// ==========================================

import { format, formatDistanceToNow, isWeekend } from 'date-fns'
import { tr } from 'date-fns/locale'

/**
 * Tarih formatlama (Türkçe)
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd.MM.yyyy', { locale: tr })
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: tr })
}

export function formatDateLong(date: Date | string): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: tr })
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
}

/**
 * İş günü hesaplama
 */
export function getBusinessDaysRemaining(deadline: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  
  if (target <= today) return 0
  
  let days = 0
  const current = new Date(today)
  while (current < target) {
    current.setDate(current.getDate() + 1)
    if (!isWeekend(current)) days++
  }
  return days
}

/**
 * Para formatı (TL)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Süre formatlama
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} dk`
  if (mins === 0) return `${hours} sa`
  return `${hours} sa ${mins} dk`
}

/**
 * Yüzde formatlama
 */
export function formatPercent(value: number): string {
  return `%${Math.round(value)}`
}

/**
 * Dosya boyutu formatlama
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * KFO (Kaza Frekans Oranı) hesaplama
 * KFO = (Kaza Sayısı × 1.000.000) / Toplam Çalışma Saati
 */
export function calculateKFO(accidentCount: number, totalWorkHours: number): number {
  if (totalWorkHours === 0) return 0
  return (accidentCount * 1000000) / totalWorkHours
}

/**
 * KAO (Kaza Ağırlık Oranı) hesaplama
 * KAO = (Kayıp İş Günü × 1.000.000) / Toplam Çalışma Saati
 */
export function calculateKAO(lostDays: number, totalWorkHours: number): number {
  if (totalWorkHours === 0) return 0
  return (lostDays * 1000000) / totalWorkHours
}

/**
 * Renk kodu üretme (hash-based)
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 65%, 55%)`
}

/**
 * İsim baş harfleri
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Sıralama fonksiyonu
 */
export function sortByDate<T>(items: T[], key: keyof T, desc = true): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[key] as string).getTime()
    const dateB = new Date(b[key] as string).getTime()
    return desc ? dateB - dateA : dateA - dateB
  })
}

/**
 * Arama filtresi
 */
export function searchFilter<T>(items: T[], query: string, keys: (keyof T)[]): T[] {
  if (!query.trim()) return items
  const lowerQuery = query.toLowerCase()
  return items.filter(item =>
    keys.some(key => {
      const value = item[key]
      if (typeof value === 'string') return value.toLowerCase().includes(lowerQuery)
      if (typeof value === 'number') return value.toString().includes(lowerQuery)
      return false
    })
  )
}

/**
 * Classname helper
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Kısaltma (truncate)
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * İstihdam tipini Türkçeye çevir
 */
export function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    OPEN: 'Açık',
    CLOSED: 'Kapalı',
    NOTIFIED: 'Bildirildi',
    DRAFT: 'Taslak',
    PENDING_APPROVAL: 'Onay Bekliyor',
    APPROVED: 'Onaylandı',
    ARCHIVED: 'Arşivlendi',
    IN_PROGRESS: 'Devam Ediyor',
    VERIFIED: 'Doğrulandı',
    SYNCED: 'Senkronize',
    PENDING: 'Beklemede',
    BLOCKED: 'Bloke',
    NOT_LINKED: 'Bağlı Değil',
    PAID: 'Ödendi',
    OVERDUE: 'Gecikmiş',
    CANCELLED: 'İptal',
    FIT: 'Uygun',
    UNFIT: 'Uygun Değil',
    CONDITIONAL: 'Şartlı',
  }
  return statusMap[status] || status
}
