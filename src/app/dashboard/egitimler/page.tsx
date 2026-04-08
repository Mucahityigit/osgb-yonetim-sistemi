'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { TRAINING_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockTrainings = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', title: 'Temel İSG Eğitimi', date: '2025-04-01', hours: 8, trainer: 'Ahmet Yılmaz', type: 'ENTRY', location: 'WORKPLACE', participants: 25, passed: 23 },
  { id: '2', firmId: '5', firm: 'Star Kimya', title: 'Kimyasal Madde Güvenliği', date: '2025-03-20', hours: 4, trainer: 'Prof. Elif Karahan', type: 'TOPIC_SPECIFIC', location: 'CONFERENCE_HALL', participants: 40, passed: 38 },
  { id: '3', firmId: '2', firm: 'XYZ Metal', title: 'Yangın Söndürme / Tahliye', date: '2025-03-15', hours: 2, trainer: 'Ayşe Demir', type: 'EMERGENCY', location: 'WORKPLACE', participants: 60, passed: 60 },
  { id: '4', firmId: '6', firm: 'Delta Lojistik', title: 'KKD Kullanımı Eğitimi', date: '2025-03-10', hours: 2, trainer: 'Mehmet Kaya', type: 'PPE_USAGE', location: 'ONLINE', participants: 30, passed: 28 },
  { id: '5', firmId: '4', firm: 'Ofis Park', title: 'Periyodik İSG Tazeleme', date: '2025-02-28', hours: 4, trainer: 'Ahmet Yılmaz', type: 'PERIODIC_REFRESH', location: 'WORKPLACE', participants: 15, passed: 15 },
]
const locLabels: Record<string, string> = { WORKPLACE: 'İşyeri', CONFERENCE_HALL: 'Konferans', ONLINE: 'Online' }

export default function EgitimlerPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const trainings = filterByAccess(mockTrainings, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{trainings.length}</div><div className="kpi-label">Bu Ay Eğitim</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{trainings.reduce((s, t) => s + t.participants, 0)}</div><div className="kpi-label">Toplam Katılımcı</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-cyan)' } as React.CSSProperties}><div className="kpi-value">{trainings.reduce((s, t) => s + t.hours, 0)}</div><div className="kpi-label">Toplam Saat</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}><div className="kpi-value">{trainings.length > 0 ? `%${Math.round(trainings.reduce((s, t) => s + t.passed, 0) / trainings.reduce((s, t) => s + t.participants, 0) * 100)}` : '%0'}</div><div className="kpi-label">Başarı Oranı</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Eğitim veya firma ara..." /></div></div><div className="toolbar-right">{can('TRAINING_CREATE') && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Eğitim Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Eğitim Başlığı</th><th>Firma</th><th>Tarih</th><th>Süre</th><th>Tür</th><th>Eğitimci</th><th>Yer</th><th>Katılımcı</th><th>Başarı</th><th>İşlem</th></tr></thead><tbody>
        {trainings.map(t => (<tr key={t.id}><td style={{ fontWeight: 600 }}>{t.title}</td><td>{t.firm}</td><td>{formatDate(t.date)}</td><td>{t.hours} sa</td><td><span className="badge badge-info">{TRAINING_TYPE_LABELS[t.type]}</span></td><td>{t.trainer}</td><td><span className="badge badge-default">{locLabels[t.location]}</span></td><td>{t.participants}</td><td>{t.passed}/{t.participants}</td>
          <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-ghost" title="Detay"><Icon name="Eye" size={14} /></button><button className="btn btn-sm btn-ghost" title="Sertifika"><Icon name="Download" size={14} /></button></div></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Eğitim Kaydı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitim Başlığı <span className="required">*</span></label><input className="form-input" /></div><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tarih <span className="required">*</span></label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">Süre (Saat) <span className="required">*</span></label><input className="form-input" type="number" min="0.5" step="0.5" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitim Türü <span className="required">*</span></label><select className="form-select">{Object.entries(TRAINING_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Eğitim Yeri</label><select className="form-select">{Object.entries(locLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitimci Adı <span className="required">*</span></label><input className="form-input" /></div><div className="form-group"><label className="form-label">Eğitimci Yetkinlik Belgesi</label><input className="form-input" /></div></div>
        <div className="form-group"><label className="form-label">Eğitim İçeriği</label><textarea className="form-textarea" rows={3} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
