'use client'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockSurveys = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', date: '2025-03-01', participants: 80, stressScore: 3.2, burnoutScore: 2.8, mobbingScore: 1.5, overallRisk: 'MEDIUM', actionPlan: 'İş yükü dağılımı gözden geçirilecek' },
  { id: '2', firmId: '5', firm: 'Star Kimya', date: '2025-02-15', participants: 120, stressScore: 2.5, burnoutScore: 2.1, mobbingScore: 1.2, overallRisk: 'LOW', actionPlan: 'Mevcut durumun korunması' },
]
const riskLabels: Record<string, { label: string; cls: string }> = { LOW: { label: 'Düşük', cls: 'badge-success' }, MEDIUM: { label: 'Orta', cls: 'badge-warning' }, HIGH: { label: 'Yüksek', cls: 'badge-orange' }, CRITICAL: { label: 'Kritik', cls: 'badge-danger' } }

export default function PsikososyalPage() {
  const { filterByAccess, can } = useAuth()
  const surveys = filterByAccess(mockSurveys, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div><strong>Psikososyal Risk Yönetimi:</strong> Türk Borçlar Kanunu Md. 417 ve 6331 Sayılı Kanun kapsamında psikososyal riskler değerlendirilmelidir. COPSOQ standardına uygun anonim anket sistemi kullanılmaktadır.</div></div>
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}><div className="kpi-value">{surveys.length}</div><div className="kpi-label">Toplam Anket</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{surveys.reduce((s, d) => s + d.participants, 0)}</div><div className="kpi-label">Toplam Katılımcı</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-right">{can('PSYCHO_CREATE') && <button className="btn btn-primary"><Icon name="Plus" size={16} /> Yeni Anket Başlat</button>}</div></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {surveys.map(s => (
          <div key={s.id} className="card">
            <div className="card-header"><div><h3 className="card-title">{s.firm}</h3><p className="card-subtitle">{formatDate(s.date)} — {s.participants} katılımcı</p></div><span className={`badge ${riskLabels[s.overallRisk]?.cls}`}>{riskLabels[s.overallRisk]?.label} Risk</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div style={{ fontSize: 24, fontWeight: 700, color: s.stressScore > 3 ? 'var(--risk-high)' : 'var(--risk-low)' }}>{s.stressScore}/5</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Stres Skoru</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div style={{ fontSize: 24, fontWeight: 700, color: s.burnoutScore > 3 ? 'var(--risk-high)' : 'var(--risk-low)' }}>{s.burnoutScore}/5</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Tükenmişlik</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div style={{ fontSize: 24, fontWeight: 700, color: s.mobbingScore > 2 ? 'var(--risk-high)' : 'var(--risk-low)' }}>{s.mobbingScore}/5</div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Mobbing</div></div>
            </div>
            <div><h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Aksiyon Planı:</h4><p style={{ fontSize: 13.5 }}>{s.actionPlan}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
