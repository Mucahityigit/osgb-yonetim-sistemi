// ==========================================
// OSGB Yönetim Sistemi - Doğrulama Fonksiyonları
// RFP v2.0 Bölüm 6.2 referansıyla
// ==========================================

/**
 * VKN (Vergi Kimlik Numarası) checksum doğrulama
 * 10 haneli, Türk VKN algoritmasına uygun
 */
export function validateVKN(vkn: string): boolean {
  if (!vkn || vkn.length !== 10 || !/^\d{10}$/.test(vkn)) return false
  
  const digits = vkn.split('').map(Number)
  let sum = 0
  
  for (let i = 0; i < 9; i++) {
    let tmp = (digits[i] + (9 - i)) % 10
    tmp = (tmp * Math.pow(2, (9 - i))) % 9
    if (tmp === 0 && (digits[i] + (9 - i)) % 10 !== 0) tmp = 9
    sum += tmp
  }
  
  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === digits[9]
}

/**
 * TC Kimlik Numarası doğrulama
 * 11 haneli, Türk TC algoritmasına uygun
 */
export function validateTCKN(tckn: string): boolean {
  if (!tckn || tckn.length !== 11 || !/^\d{11}$/.test(tckn)) return false
  if (tckn[0] === '0') return false
  
  const digits = tckn.split('').map(Number)
  
  // 10. hane kontrolü
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  const check10 = ((oddSum * 7) - evenSum) % 10
  if (check10 !== digits[9]) return false
  
  // 11. hane kontrolü
  let total = 0
  for (let i = 0; i < 10; i++) {
    total += digits[i]
  }
  if (total % 10 !== digits[10]) return false
  
  return true
}

/**
 * E-posta format doğrulama
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Telefon numarası doğrulama (Türkiye)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-|\(|\)/g, '')
  const phoneRegex = /^(\+90|0)?[1-9][0-9]{9}$/
  return phoneRegex.test(cleaned)
}

/**
 * Şifre politikası doğrulama
 * Min. 12 karakter, büyük/küçük/rakam/özel karakter zorunlu
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 12) errors.push('En az 12 karakter olmalıdır')
  if (!/[A-Z]/.test(password)) errors.push('En az 1 büyük harf içermelidir')
  if (!/[a-z]/.test(password)) errors.push('En az 1 küçük harf içermelidir')
  if (!/[0-9]/.test(password)) errors.push('En az 1 rakam içermelidir')
  if (!/[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?]/.test(password)) errors.push('En az 1 özel karakter içermelidir')
  
  return { valid: errors.length === 0, errors }
}

/**
 * Risk skoru hesaplama
 */
export function calculateRiskScore(probability: number, severity: number, frequency?: number): number {
  if (frequency !== undefined) {
    // Fine-Kinney metodu
    return probability * severity * frequency
  }
  // 5x5 Matris
  return probability * severity
}

/**
 * Risk seviyesi belirleme (5x5 matris için)
 */
export function getRiskLevel(score: number): { level: string; color: string; label: string } {
  if (score <= 4) return { level: 'LOW', color: '#22c55e', label: 'Düşük Risk' }
  if (score <= 9) return { level: 'MEDIUM', color: '#eab308', label: 'Orta Risk' }
  if (score <= 16) return { level: 'HIGH', color: '#f97316', label: 'Yüksek Risk' }
  return { level: 'VERY_HIGH', color: '#ef4444', label: 'Çok Yüksek Risk' }
}

/**
 * Belge boyutu doğrulama (max 50 MB)
 */
export function validateFileSize(sizeBytes: number): boolean {
  return sizeBytes <= 50 * 1024 * 1024
}

/**
 * İzin verilen dosya formatları
 */
export function validateFileType(mimeType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'video/mp4',
  ]
  return allowedTypes.includes(mimeType)
}

/**
 * Sözleşme tarihi doğrulama
 */
export function validateContractDates(startDate: Date, endDate: Date): boolean {
  return endDate > startDate
}

/**
 * SGK 3 iş günü hesaplama
 */
export function calculateSGKDeadline(accidentDate: Date): Date {
  const deadline = new Date(accidentDate)
  let businessDays = 0
  
  while (businessDays < 3) {
    deadline.setDate(deadline.getDate() + 1)
    const day = deadline.getDay()
    if (day !== 0 && day !== 6) { // Pazar=0, Cumartesi=6
      businessDays++
    }
  }
  
  return deadline
}

/**
 * Aylık gerekli ziyaret süresi hesaplama
 */
export function calculateRequiredVisitMinutes(
  riskClass: 'A' | 'B' | 'C',
  employeeCount: number,
  type: 'expert' | 'doctor' = 'expert'
): number {
  const rates: Record<string, Record<string, number>> = {
    A: { expert: 10, doctor: 6 },
    B: { expert: 20, doctor: 10 },
    C: { expert: 40, doctor: 15 },
  }
  return rates[riskClass][type] * employeeCount
}

/**
 * RAG durumu belirleme
 */
export function getRAGStatus(completionPercent: number): { status: string; color: string; label: string } {
  if (completionPercent < 60) return { status: 'RED', color: '#ef4444', label: 'Kritik' }
  if (completionPercent < 90) return { status: 'AMBER', color: '#f59e0b', label: 'Dikkat' }
  return { status: 'GREEN', color: '#22c55e', label: 'İyi' }
}
