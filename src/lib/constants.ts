// ==========================================
// OSGB Yönetim Sistemi - Sabitler
// RFP v2.0 referansıyla
// ==========================================

// Tehlike sınıfına göre İGU zorunlu ziyaret süreleri (dakika/ay/çalışan)
export const VISIT_DURATION_REQUIREMENTS = {
  A: { expert: 10, doctor: 6 },   // Az Tehlikeli
  B: { expert: 20, doctor: 10 },  // Tehlikeli
  C: { expert: 40, doctor: 15 },  // Çok Tehlikeli
} as const

// Risk sınıflandırması (5x5 Matris)
export const RISK_CLASSIFICATION = {
  LOW: { min: 1, max: 4, label: 'Düşük Risk', color: '#22c55e', emoji: '🟢' },
  MEDIUM: { min: 5, max: 9, label: 'Orta Risk', color: '#eab308', emoji: '🟡' },
  HIGH: { min: 10, max: 16, label: 'Yüksek Risk', color: '#f97316', emoji: '🟠' },
  VERY_HIGH: { min: 17, max: 25, label: 'Çok Yüksek Risk', color: '#ef4444', emoji: '🔴' },
} as const

// Ziyaret süre dolum RAG renkleri
export const RAG_THRESHOLDS = {
  RED: { max: 60, label: 'Kritik', color: '#ef4444' },
  AMBER: { min: 60, max: 90, label: 'Dikkat', color: '#f59e0b' },
  GREEN: { min: 90, label: 'İyi', color: '#22c55e' },
} as const

// SGK bildirim süreleri (iş günü)
export const SGK_DEADLINE_DAYS = 3

// İSG-KATİP onay süresi (iş günü)
export const ISG_KATIP_APPROVAL_DAYS = 5

// Kullanıcı rolleri Türkçe etiketleri
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'OSGB Yöneticisi',
  EXPERT: 'İş Güvenliği Uzmanı',
  CLIENT: 'Müşteri Firma Yetkilisi',
  DOCTOR: 'İşyeri Hekimi',
  DSP: 'Diğer Sağlık Personeli',
}

// Tehlike sınıfı etiketleri
export const RISK_CLASS_LABELS: Record<string, string> = {
  A: 'Az Tehlikeli',
  B: 'Tehlikeli',
  C: 'Çok Tehlikeli',
}

// Ziyaret türü etiketleri
export const VISIT_TYPE_LABELS: Record<string, string> = {
  PERIODIC_CONTROL: 'Periyodik Kontrol',
  EMERGENCY: 'Acil',
  RISK_ASSESSMENT: 'Risk Değerlendirmesi',
  TRAINING: 'Eğitim',
  ACCIDENT_INVESTIGATION: 'Kaza İnceleme',
  ISG_COMMITTEE: 'İSG Kurulu',
  OTHER: 'Diğer',
}

// Kaza türü etiketleri
export const ACCIDENT_TYPE_LABELS: Record<string, string> = {
  FALL: 'Düşme',
  COLLISION: 'Çarpma',
  ELECTRIC: 'Elektrik',
  CHEMICAL: 'Kimyasal',
  FIRE: 'Yangın',
  VEHICLE: 'Araç Kazası',
  CRUSHING: 'Ezilme',
  CUTTING: 'Kesilme',
  OTHER: 'Diğer',
}

// Şiddet seviyeleri
export const SEVERITY_LABELS: Record<string, string> = {
  FIRST_AID: 'İlkyardım',
  OUTPATIENT: 'Ayakta Tedavi',
  INPATIENT: 'Yatarak Tedavi',
  PERMANENT_DISABILITY: 'Daimi İş Göremezlik',
  DEATH: 'Ölüm',
}

// Eğitim türü etiketleri
export const TRAINING_TYPE_LABELS: Record<string, string> = {
  ENTRY: 'İşe Giriş',
  PERIODIC_REFRESH: 'Periyodik Tazeleme',
  TOPIC_SPECIFIC: 'Konuya Özel',
  EMERGENCY: 'Acil Durum',
  PPE_USAGE: 'KKD Kullanımı',
}

// Ölçüm türü etiketleri
export const MEASUREMENT_TYPE_LABELS: Record<string, string> = {
  NOISE: 'Gürültü',
  DUST: 'Toz',
  GAS: 'Gaz',
  VIBRATION: 'Titreşim',
  CLIMATE: 'İklim',
  LIGHTING: 'Aydınlatma',
  RADIATION: 'Radyasyon',
  OTHER: 'Diğer',
}

// Belge kategorisi etiketleri
export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  CONTRACT: 'Sözleşme Belgeleri',
  RISK_ASSESSMENT: 'Risk Değerlendirme',
  TRAINING: 'Eğitim Belgeleri',
  WORK_ACCIDENT: 'İş Kazası Dosyası',
  OCCUPATIONAL_DISEASE: 'Meslek Hastalığı',
  MEASUREMENT: 'Ortam Ölçüm Raporları',
  HEALTH_EXAM: 'Sağlık Muayene',
  EMERGENCY_PLAN: 'Acil Durum Planları',
  PPE_RECORD: 'KKD Tutanakları',
  ISG_COMMITTEE: 'İSG Kurulu Tutanakları',
  OTHER: 'Diğer',
}

// Bildirim öncelik etiketleri
export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Düşük',
  MEDIUM: 'Orta',
  HIGH: 'Yüksek',
  CRITICAL: 'Kritik',
}

// NACE kodları ve tehlike sınıfları (yaygın örnekler)
export const NACE_CODES = [
  { code: '01.11', description: 'Tahıl ve baklagil yetiştiriciliği', riskClass: 'B' as const },
  { code: '10.11', description: 'Et işleme ve muhafaza', riskClass: 'C' as const },
  { code: '13.10', description: 'Tekstil elyafı hazırlama ve bükme', riskClass: 'B' as const },
  { code: '20.11', description: 'Sanayi gazları üretimi', riskClass: 'C' as const },
  { code: '23.51', description: 'Çimento imalatı', riskClass: 'C' as const },
  { code: '24.10', description: 'Demir-çelik üretimi', riskClass: 'C' as const },
  { code: '25.11', description: 'Metal yapı imalatı', riskClass: 'C' as const },
  { code: '41.20', description: 'Bina inşaatı', riskClass: 'C' as const },
  { code: '43.11', description: 'Yıkım işleri', riskClass: 'C' as const },
  { code: '45.11', description: 'Motorlu araç ticareti', riskClass: 'A' as const },
  { code: '46.10', description: 'Toptan ticaret', riskClass: 'A' as const },
  { code: '47.11', description: 'Perakende ticaret', riskClass: 'A' as const },
  { code: '49.31', description: 'Şehir içi kara yolu yolcu taşımacılığı', riskClass: 'B' as const },
  { code: '55.10', description: 'Oteller ve konaklama', riskClass: 'A' as const },
  { code: '56.10', description: 'Lokanta ve restoran', riskClass: 'B' as const },
  { code: '62.01', description: 'Bilgisayar programlama', riskClass: 'A' as const },
  { code: '64.19', description: 'Bankacılık', riskClass: 'A' as const },
  { code: '69.10', description: 'Hukuk hizmetleri', riskClass: 'A' as const },
  { code: '70.10', description: 'Yönetim danışmanlığı', riskClass: 'A' as const },
  { code: '80.10', description: 'Özel güvenlik', riskClass: 'B' as const },
  { code: '85.20', description: 'İlköğretim', riskClass: 'A' as const },
  { code: '86.10', description: 'Hastane faaliyetleri', riskClass: 'B' as const },
  { code: '86.21', description: 'Genel tıp pratiği', riskClass: 'B' as const },
  { code: '05.10', description: 'Taş kömürü madenciliği', riskClass: 'C' as const },
  { code: '07.10', description: 'Demir cevheri madenciliği', riskClass: 'C' as const },
  { code: '08.11', description: 'Taş ocakçılığı', riskClass: 'C' as const },
  { code: '35.11', description: 'Elektrik üretimi', riskClass: 'C' as const },
]

// Kontrol hiyerarşisi
export const CONTROL_HIERARCHY = [
  'Eliminasyon (Ortadan Kaldırma)',
  'İkame (Yerine Koyma)',
  'Mühendislik Kontrolleri',
  'İdari Kontroller',
  'KKD (Kişisel Koruyucu Donanım)',
]

// KKD Türleri
export const PPE_TYPES = [
  'Baret',
  'Koruyucu Gözlük',
  'Yüz Siperi',
  'Kulaklık / Kulak Tıkacı',
  'Toz Maskesi',
  'Gaz Maskesi',
  'Koruyucu Eldiven',
  'Güvenlik Ayakkabısı',
  'Yüksekten Düşmeye Karşı Kemer',
  'İş Elbisesi / Tulum',
  'Fosforlu Yelek',
  'Koruyucu Krem',
  'Diğer',
]

// İdari para cezaları (2025 güncel)
export const ADMINISTRATIVE_FINES = {
  NO_EXPERT_DOCTOR: 22400, // TL/ay (minimum)
  NO_ISG_COMMITTEE: 15000, // TL/yıl (yaklaşık)
  NO_RISK_ASSESSMENT: 12000, // TL/yıl
  LATE_ACCIDENT_REPORT: 8000, // TL/bildirim
}

// İstihdam türü etiketleri
export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  TEMPORARY: 'Geçici',
  SUBCONTRACTOR: 'Taşeron',
}

// Sidebar menü yapısı
export const SIDEBAR_MENU = [
  { title: 'Ana Panel', href: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Firmalar', href: '/dashboard/firmalar', icon: 'Building2' },
  { title: 'Sözleşmeler', href: '/dashboard/sozlesmeler', icon: 'FileText' },
  { title: 'Çalışanlar', href: '/dashboard/calisanlar', icon: 'Users' },
  { title: 'Saha Ziyaretleri', href: '/dashboard/ziyaretler', icon: 'MapPin' },
  { title: 'İş Kazaları', href: '/dashboard/kazalar', icon: 'AlertTriangle' },
  { title: 'Ramak Kala', href: '/dashboard/ramak-kala', icon: 'ShieldAlert' },
  { title: 'Meslek Hastalıkları', href: '/dashboard/meslek-hastaliklari', icon: 'Stethoscope' },
  { title: 'Risk Değerlendirme', href: '/dashboard/risk-degerlendirme', icon: 'BarChart3' },
  { title: 'Eğitimler', href: '/dashboard/egitimler', icon: 'GraduationCap' },
  { title: 'Belgeler', href: '/dashboard/belgeler', icon: 'FolderOpen' },
  { title: 'KKD Takip', href: '/dashboard/kkd', icon: 'HardHat' },
  { title: 'İSG Kurulu', href: '/dashboard/isg-kurulu', icon: 'UsersRound' },
  { title: 'Periyodik Ölçümler', href: '/dashboard/olcumler', icon: 'Gauge' },
  { title: 'Sağlık Muayene', href: '/dashboard/saglik-muayene', icon: 'HeartPulse' },
  { title: 'Psikososyal Risk', href: '/dashboard/psikososyal', icon: 'Brain' },
  { title: 'İSG-KATİP', href: '/dashboard/isg-katip', icon: 'Link' },
  { title: 'Faturalar', href: '/dashboard/faturalar', icon: 'Receipt' },
  { title: 'Raporlar', href: '/dashboard/raporlar', icon: 'PieChart' },
  { title: 'Bildirimler', href: '/dashboard/bildirimler', icon: 'Bell' },
  { title: 'Kullanıcılar', href: '/dashboard/kullanicilar', icon: 'UserCog', adminOnly: true },
  { title: 'Denetim İzi', href: '/dashboard/denetim-izi', icon: 'ScrollText', adminOnly: true },
  { title: 'Ayarlar', href: '/dashboard/ayarlar', icon: 'Settings' },
]
