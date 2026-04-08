'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const riskMethods = { FINE_KINNEY: 'Fine-Kinney', MATRIX_5X5: '5×5 Matris', FMEA: 'FMEA' }
const mockAssessments = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', method: 'MATRIX_5X5', version: 3, status: 'APPROVED', expert: 'Ahmet Yılmaz', created: '2025-01-15', validUntil: '2027-01-15', itemCount: 24, highRisk: 5 },
  { id: '2', firmId: '5', firm: 'Star Kimya', method: 'FINE_KINNEY', version: 2, status: 'DRAFT', expert: 'Mehmet Kaya', created: '2025-03-10', validUntil: '2027-03-10', itemCount: 35, highRisk: 12 },
  { id: '3', firmId: '2', firm: 'XYZ Metal', method: 'MATRIX_5X5', version: 1, status: 'PENDING_APPROVAL', expert: 'Ayşe Demir', created: '2025-04-01', validUntil: '2027-04-01', itemCount: 18, highRisk: 3 },
  { id: '4', firmId: '6', firm: 'Delta Lojistik', method: 'MATRIX_5X5', version: 2, status: 'APPROVED', expert: 'Mehmet Kaya', created: '2024-06-01', validUntil: '2026-06-01', itemCount: 15, highRisk: 2 },
]
const mockRiskItems = [
  { id: 'r1', section: 'Genel Alan', hazard: 'Kaygan zemin', probability: 3, severity: 3, score: 9, level: 'MEDIUM', controls: 'Anti-kaydırıcı paspas mevcut', action: 'Zemin kaplaması yenilenecek', responsible: 'İnşaat Müdürü', dueDate: '2025-05-01', status: 'OPEN' },
  { id: 'r2', section: 'İskele', hazard: 'Yüksekten düşme', probability: 4, severity: 5, score: 20, level: 'VERY_HIGH', controls: 'Güvenlik ağı, baret', action: 'Korkuluk sistemi güçlendirilecek', responsible: 'Saha Şefi', dueDate: '2025-04-15', status: 'IN_PROGRESS' },
  { id: 'r3', section: 'Elektrik', hazard: 'Elektrik çarpması', probability: 2, severity: 5, score: 10, level: 'HIGH', controls: 'Kaçak akım rölesi, izoleli alet', action: 'Topraklama kontrolü', responsible: 'Elektrik Teknisyeni', dueDate: '2025-04-20', status: 'OPEN' },
  { id: 'r4', section: 'Depo', hazard: 'Malzeme devrilmesi', probability: 3, severity: 4, score: 12, level: 'HIGH', controls: 'Raf sabitleme', action: 'Raf yükleme kapasitesi etiketlenecek', responsible: 'Depo Sorumlusu', dueDate: '2025-06-01', status: 'OPEN' },
]

function getRiskColor(level: string) { return level === 'VERY_HIGH' ? 'var(--risk-critical)' : level === 'HIGH' ? 'var(--risk-high)' : level === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--risk-low)' }
function getStatusBadge(s: string) { const m: Record<string, { cls: string; label: string }> = { DRAFT: { cls: 'badge-default', label: 'Taslak' }, PENDING_APPROVAL: { cls: 'badge-warning', label: 'Onay Bekliyor' }, APPROVED: { cls: 'badge-success', label: 'Onaylandı' }, ARCHIVED: { cls: 'badge-info', label: 'Arşivlendi' } }; const x = m[s] || m.DRAFT; return <span className={`badge ${x.cls}`}>{x.label}</span> }

export default function RiskDegerlendirmePage() {
  const { filterByAccess, can } = useAuth()
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const assessments = filterByAccess(mockAssessments, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{assessments.length}</div><div className="kpi-label">Toplam RD</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{assessments.reduce((s, a) => s + a.highRisk, 0)}</div><div className="kpi-label">Yüksek Risk Kalemi</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{assessments.filter(a => a.status === 'PENDING_APPROVAL').length}</div><div className="kpi-label">Onay Bekleyen</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}><div className="kpi-value">{assessments.filter(a => a.status === 'APPROVED').length}</div><div className="kpi-label">Onaylanmış</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Firma veya uzman ara..." /></div></div><div className="toolbar-right">{can('RISK_CREATE') && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni RD Oluştur</button>}</div></div>
      <div className="card" style={{ padding: 0, marginBottom: 24 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Yöntem</th><th>Versiyon</th><th>Uzman</th><th>Tarih</th><th>Geçerlilik</th><th>Risk Sayısı</th><th>Yüksek Risk</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {assessments.map(a => (<tr key={a.id} style={{ cursor: 'pointer', background: selectedAssessment === a.id ? 'rgba(59,130,246,0.06)' : undefined }} onClick={() => setSelectedAssessment(a.id)}>
          <td style={{ fontWeight: 600 }}>{a.firm}</td><td><span className="badge badge-info">{riskMethods[a.method as keyof typeof riskMethods]}</span></td><td>v{a.version}</td><td>{a.expert}</td><td>{formatDate(a.created)}</td><td>{formatDate(a.validUntil)}</td><td>{a.itemCount}</td><td style={{ fontWeight: 700, color: a.highRisk > 5 ? 'var(--risk-critical)' : 'var(--text-primary)' }}>{a.highRisk}</td><td>{getStatusBadge(a.status)}</td>
          <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button><button className="btn btn-sm btn-ghost"><Icon name="Download" size={14} /></button></div></td>
        </tr>))}
      </tbody></table></div></div>

      {/* Risk Matrix Detail */}
      {selectedAssessment && (
        <div className="card">
          <div className="card-header"><div><h2 className="card-title">📊 Risk Kalemleri — {assessments.find(a => a.id === selectedAssessment)?.firm}</h2><p className="card-subtitle">Risk skoru = Olasılık × Şiddet (5×5 Matris)</p></div></div>
          {/* 5x5 Matrix visualization */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: 2, marginBottom: 24, maxWidth: 500 }}>
            <div></div>
            {[1,2,3,4,5].map(s => <div key={s} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: 6 }}>Ş:{s}</div>)}
            {[5,4,3,2,1].map(p => (<>
              <div key={`p${p}`} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O:{p}</div>
              {[1,2,3,4,5].map(s => {
                const score = p * s
                const bg = score >= 17 ? 'rgba(239,68,68,0.3)' : score >= 10 ? 'rgba(249,115,22,0.25)' : score >= 5 ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.15)'
                const color = score >= 17 ? '#f87171' : score >= 10 ? '#fb923c' : score >= 5 ? '#facc15' : '#4ade80'
                return <div key={`${p}-${s}`} style={{ textAlign: 'center', padding: 8, background: bg, borderRadius: 4, fontSize: 13, fontWeight: 700, color }}>{score}</div>
              })}
            </>))}
          </div>
          {/* Risk Table */}
          <div className="table-container"><table className="data-table"><thead><tr><th>Bölüm</th><th>Tehlike</th><th>O</th><th>Ş</th><th>Skor</th><th>Mevcut Kontrol</th><th>Aksiyon</th><th>Sorumlu</th><th>Termin</th><th>Durum</th></tr></thead><tbody>
            {mockRiskItems.map(r => (<tr key={r.id}><td>{r.section}</td><td style={{ fontWeight: 500 }}>{r.hazard}</td><td>{r.probability}</td><td>{r.severity}</td><td style={{ fontWeight: 700, color: getRiskColor(r.level) }}>{r.score}</td><td style={{ fontSize: 12 }}>{r.controls}</td><td style={{ fontSize: 12 }}>{r.action}</td><td>{r.responsible}</td><td>{formatDate(r.dueDate)}</td><td><span className={`badge ${r.status === 'OPEN' ? 'badge-danger' : r.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-success'}`}>{r.status === 'OPEN' ? 'Açık' : r.status === 'IN_PROGRESS' ? 'Devam' : 'Kapalı'}</span></td></tr>))}
          </tbody></table></div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <strong>Kontrol Hiyerarşisi:</strong> Eliminasyon → İkame → Mühendislik → İdari → KKD
          </div>
        </div>
      )}

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Risk Değerlendirmesi</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Yöntem <span className="required">*</span></label><select className="form-select">{Object.entries(riskMethods).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Geçerlilik Tarihi</label><input className="form-input" type="date" /></div></div>
        <div className="alert alert-info"><Icon name="Info" size={16} /><div>Risk değerlendirmesi en geç 2 yılda bir veya önemli bir değişiklikte yenilenmelidir. (6331 Md. 10)</div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Oluştur</button></div></div></div>)}
    </div>
  )
}
