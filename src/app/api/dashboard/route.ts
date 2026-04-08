import { NextResponse } from 'next/server'

// Dashboard özet istatistikleri
const DEMO_STATS = {
  firmalar: { total: 7, active: 6, riskC: 4, riskB: 2, riskA: 1 },
  ziyaretler: { thisMonth: 156, lastMonth: 144, target: 180, completion: 87 },
  kazalar: { thisYear: 3, open: 1, sgkPending: 1, lostDays: 18 },
  egitimler: { thisYear: 12, thisMonth: 3, participantTotal: 340, nextDue: 5 },
  calisanlar: { total: 2340, firms: 47 },
  riskDegerlendirme: { approaching: 7, due60Days: 7 },
  sozlesmeler: { expiring30: 5 },
  
  // Aylık kaza verisi (12 ay)
  monthlyAccidents: [
    { month: 'Oca', count: 2, lostDays: 8 },
    { month: 'Şub', count: 1, lostDays: 3 },
    { month: 'Mar', count: 3, lostDays: 12 },
    { month: 'Nis', count: 1, lostDays: 15 },
    { month: 'May', count: 0, lostDays: 0 },
    { month: 'Haz', count: 2, lostDays: 5 },
    { month: 'Tem', count: 1, lostDays: 2 },
    { month: 'Ağu', count: 0, lostDays: 0 },
    { month: 'Eyl', count: 1, lostDays: 4 },
    { month: 'Eki', count: 2, lostDays: 7 },
    { month: 'Kas', count: 1, lostDays: 1 },
    { month: 'Ara', count: 0, lostDays: 0 },
  ],
  
  // Firma bazlı ziyaret durumu
  firmVisitStatus: [
    { firm: 'ABC İnşaat', target: 480, actual: 420, percentage: 87.5, status: 'amber' },
    { firm: 'XYZ Metal', target: 160, actual: 150, percentage: 93.7, status: 'green' },
    { firm: 'Mega Tekstil', target: 130, actual: 125, percentage: 96.1, status: 'green' },
    { firm: 'Ofis Park', target: 30, actual: 28, percentage: 93.3, status: 'green' },
    { firm: 'Star Kimya', target: 600, actual: 450, percentage: 75.0, status: 'red' },
    { firm: 'Delta Lojistik', target: 90, actual: 85, percentage: 94.4, status: 'green' },
  ],

  // Tehlike sınıfı dağılımı
  riskDistribution: [
    { label: 'Çok Tehlikeli (C)', count: 4, color: '#ef4444' },
    { label: 'Tehlikeli (B)', count: 2, color: '#f59e0b' },
    { label: 'Az Tehlikeli (A)', count: 1, color: '#22c55e' },
  ],

  // Kaza türü dağılımı
  accidentTypeDistribution: [
    { type: 'Düşme', count: 5 },
    { type: 'Kesilme', count: 3 },
    { type: 'Kimyasal', count: 2 },
    { type: 'Elektrik', count: 1 },
    { type: 'Ezilme', count: 1 },
    { type: 'Diğer', count: 2 },
  ],

  // KFO / KAO değerleri
  kfoKao: {
    kfo: 12.8, // Kaza Frekans Oranı
    kao: 0.34, // Kaza Ağırlık Oranı
    sektorKfo: 15.2,
    sektorKao: 0.45,
  },
}

export async function GET() {
  return NextResponse.json(DEMO_STATS)
}
