'use client'
import { Icon } from '@/components/layout/Sidebar'

const reports = [
  { category: 'Yasal Zorunlu Raporlar', items: [
    { title: 'Yıllık İş Kazası ve Meslek Hastalığı Özet Raporu', desc: "SGK'ya sunulmak üzere", icon: 'AlertTriangle', formats: ['PDF', 'XLSX'] },
    { title: 'Firma Bazlı Yıllık Ziyaret ve Aktivite Raporu', desc: 'Tüm firmalar için ayrı ayrı', icon: 'MapPin', formats: ['PDF', 'XLSX'] },
    { title: 'Risk Değerlendirmesi Özet Raporu', desc: 'Firma bazında risk durumu', icon: 'BarChart3', formats: ['PDF'] },
    { title: 'Eğitim ve Sertifikasyon Özet Raporu', desc: 'Çalışan bazında eğitim durumu', icon: 'GraduationCap', formats: ['PDF', 'XLSX'] },
    { title: 'İGU Çalışma Saati Beyan Formu', desc: 'Yasal format', icon: 'Clock', formats: ['PDF'] },
    { title: 'KFO ve KAO Raporu', desc: 'Kaza frekans ve ağırlık oranları', icon: 'PieChart', formats: ['PDF', 'XLSX'] },
    { title: 'Periyodik Sağlık Muayene Takip Tablosu', desc: 'Tüm çalışanlar', icon: 'HeartPulse', formats: ['PDF', 'XLSX'] },
    { title: 'KKD Dağıtım ve Teslim Tutanağı', desc: 'İmzalı format', icon: 'HardHat', formats: ['PDF'] },
    { title: 'İSG Kurulu Kararları Yıllık Özet', desc: '50+ çalışanlı firmalar', icon: 'UsersRound', formats: ['PDF'] },
    { title: 'Düzeltici Faaliyet Takip Raporu', desc: 'Açık/kapalı aksiyonlar', icon: 'CheckCircle', formats: ['PDF', 'XLSX'] },
  ]},
  { category: 'Yönetim Raporları', items: [
    { title: 'OSGB Aylık Performans Özeti', desc: 'Tüm firmalar geneli', icon: 'PieChart', formats: ['PDF', 'XLSX'] },
    { title: 'Uzman Bazlı Verimlilik Raporu', desc: 'Ziyaret süresi, firma sayısı', icon: 'Users', formats: ['PDF', 'XLSX'] },
    { title: 'Sözleşme ve Gelir Analizi', desc: 'Aktif/pasif, gelir durumu', icon: 'Receipt', formats: ['PDF', 'XLSX'] },
    { title: 'Firma Segmentasyon Analizi', desc: 'Tehlike sınıfı ve sektöre göre', icon: 'Building2', formats: ['PDF'] },
    { title: 'Kaza Trend Analizi (12 Ay)', desc: 'Sektör karşılaştırmalı', icon: 'AlertTriangle', formats: ['PDF', 'XLSX'] },
    { title: 'İSG-KATİP Uyum Durumu Raporu', desc: 'Atama/onay durumları', icon: 'Link', formats: ['PDF'] },
    { title: 'Gecikmiş SGK Bildirimleri Raporu', desc: '', icon: 'Clock', formats: ['PDF'] },
    { title: 'Eksik Ziyaret Firmaları Listesi', desc: 'RAG kodlu', icon: 'MapPin', formats: ['PDF', 'XLSX'] },
  ]},
]

export default function RaporlarPage() {
  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>Tüm raporlar <strong>PDF, Excel (XLSX)</strong> ve <strong>CSV</strong> formatlarında dışa aktarılabilir. Yasal raporlar standart format şablonlarına uygun üretilir.</div></div>
      {reports.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-glass)' }}>{cat.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {cat.items.map((item, i) => (
              <div key={i} className="card" style={{ padding: 16, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)', flexShrink: 0 }}>
                    <Icon name={item.icon} size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</div>
                    {item.desc && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {item.formats.map(f => (
                        <button key={f} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>
                          <Icon name="Download" size={12} /> {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
