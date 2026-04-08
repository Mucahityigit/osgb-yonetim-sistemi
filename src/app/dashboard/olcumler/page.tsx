'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { MEASUREMENT_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockMeasurements = [
  { id: '1', firmId: '2', firm: 'XYZ Metal', type: 'NOISE', date: '2025-03-10', performedBy: 'ABC Ölçüm Ltd.', accreditation: 'TÜRKAK-AB-0123', results: '87 dB(A)', limit: '85 dB(A)', exceeded: true, nextDate: '2026-03-10' },
  { id: '2', firmId: '5', firm: 'Star Kimya', type: 'GAS', date: '2025-02-20', performedBy: 'Çevre Lab A.Ş.', accreditation: 'TÜRKAK-AB-0456', results: 'Toluen: 45 ppm', limit: '50 ppm', exceeded: false, nextDate: '2026-02-20' },
  { id: '3', firmId: '1', firm: 'ABC İnşaat', type: 'DUST', date: '2025-01-15', performedBy: 'ABC Ölçüm Ltd.', accreditation: 'TÜRKAK-AB-0123', results: '4.2 mg/m³', limit: '5 mg/m³', exceeded: false, nextDate: '2026-01-15' },
  { id: '4', firmId: '6', firm: 'Delta Lojistik', type: 'LIGHTING', date: '2025-03-25', performedBy: 'Işık Ölçüm', accreditation: 'TÜRKAK-AB-0789', results: '280 lüx', limit: '300 lüx', exceeded: true, nextDate: '2026-03-25' },
]

export default function OlcumlerPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const measurements = filterByAccess(mockMeasurements, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{measurements.length}</div><div className="kpi-label">Toplam Ölçüm</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{measurements.filter(m => m.exceeded).length}</div><div className="kpi-label">Limit Aşımı 🔴</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{measurements.filter(m => new Date(m.nextDate) <= new Date(Date.now() + 90*24*60*60*1000)).length}</div><div className="kpi-label">Vadesi Gelen</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ara..." /></div></div><div className="toolbar-right">{can('MEASUREMENT_CREATE') && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Ölçüm Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Ölçüm Türü</th><th>Tarih</th><th>Yapan Kurum</th><th>Akreditasyon</th><th>Sonuç</th><th>Limit</th><th>Aşım</th><th>Sonraki</th><th>İşlem</th></tr></thead><tbody>
        {measurements.map(m => (<tr key={m.id}><td style={{ fontWeight: 600 }}>{m.firm}</td><td><span className="badge badge-info">{MEASUREMENT_TYPE_LABELS[m.type]}</span></td><td>{formatDate(m.date)}</td><td>{m.performedBy}</td><td style={{ fontSize: 11 }}>{m.accreditation}</td><td style={{ fontWeight: 600 }}>{m.results}</td><td>{m.limit}</td><td>{m.exceeded ? <span className="badge badge-danger">Aşıldı 🔴</span> : <span className="badge badge-success">Normal</span>}</td><td>{formatDate(m.nextDate)}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Periyodik Ölçüm Kaydı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Ölçüm Türü <span className="required">*</span></label><select className="form-select">{Object.entries(MEASUREMENT_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Ölçüm Tarihi</label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">Yapan Kurum/Kişi</label><input className="form-input" /></div><div className="form-group"><label className="form-label">Akreditasyon No</label><input className="form-input" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Sonuçlar</label><input className="form-input" /></div><div className="form-group"><label className="form-label">Yasal Sınır Değeri</label><input className="form-input" /></div></div>
        <div className="form-group"><label className="form-label">Sonraki Ölçüm Tarihi</label><input className="form-input" type="date" /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
