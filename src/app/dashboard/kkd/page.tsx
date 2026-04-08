'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { PPE_TYPES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockPPE = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', employee: 'Hüseyin Çelik', ppeType: 'Baret', standard: 'EN 397', qty: 1, date: '2025-03-01', renewalDate: '2026-03-01', distributedBy: 'Ahmet Yılmaz', isReturned: false },
  { id: '2', firmId: '1', firm: 'ABC İnşaat', employee: 'Ali Korkmaz', ppeType: 'Güvenlik Ayakkabısı', standard: 'EN ISO 20345', qty: 1, date: '2025-02-15', renewalDate: '2025-08-15', distributedBy: 'Ahmet Yılmaz', isReturned: false },
  { id: '3', firmId: '5', firm: 'Star Kimya', employee: 'Elif Yıldırım', ppeType: 'Gaz Maskesi', standard: 'EN 136', qty: 1, date: '2025-01-10', renewalDate: '2025-07-10', distributedBy: 'Mehmet Kaya', isReturned: false },
  { id: '4', firmId: '2', firm: 'XYZ Metal', employee: 'Mustafa Şahin', ppeType: 'Koruyucu Gözlük', standard: 'EN 166', qty: 2, date: '2025-03-20', renewalDate: '2025-09-20', distributedBy: 'Ayşe Demir', isReturned: false },
]

export default function KKDPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const ppeList = filterByAccess(mockPPE, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{ppeList.length}</div><div className="kpi-label">Toplam Dağıtım</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{ppeList.filter(p => new Date(p.renewalDate) <= new Date(Date.now() + 90*24*60*60*1000)).length}</div><div className="kpi-label">Yenileme Zamanı Gelen</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Çalışan veya KKD ara..." /></div></div><div className="toolbar-right">{can('KKD_CREATE') && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> KKD Dağıtım Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Çalışan</th><th>KKD Türü</th><th>Standart</th><th>Adet</th><th>Teslim Tarihi</th><th>Yenileme</th><th>Teslim Eden</th><th>İşlem</th></tr></thead><tbody>
        {ppeList.map(p => (<tr key={p.id}><td>{p.firm}</td><td style={{ fontWeight: 600 }}>{p.employee}</td><td><span className="badge badge-info">{p.ppeType}</span></td><td style={{ fontSize: 12 }}>{p.standard}</td><td>{p.qty}</td><td>{formatDate(p.date)}</td><td>{formatDate(p.renewalDate)}</td><td>{p.distributedBy}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">KKD Dağıtım Kaydı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Çalışan <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">KKD Türü <span className="required">*</span></label><select className="form-select">{PPE_TYPES.map(p => <option key={p}>{p}</option>)}</select></div><div className="form-group"><label className="form-label">CE Standart No</label><input className="form-input" placeholder="Örn: EN 397" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Adet</label><input className="form-input" type="number" min="1" defaultValue={1} /></div><div className="form-group"><label className="form-label">Teslim Tarihi</label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">Yenileme Tarihi</label><input className="form-input" type="date" /></div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
