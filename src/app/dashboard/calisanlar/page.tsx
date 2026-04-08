'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { EMPLOYMENT_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockEmployees = [
  { id: '1', firmId: '1', name: 'Hüseyin Çelik', tcNo: '12345678901', firm: 'ABC İnşaat', department: 'İnşaat', jobTitle: 'Kalıpçı', gender: 'E', startDate: '2022-03-15', type: 'FULL_TIME', isActive: true },
  { id: '2', firmId: '2', name: 'Mustafa Şahin', tcNo: '23456789012', firm: 'XYZ Metal', department: 'Üretim', jobTitle: 'Tornacı', gender: 'E', startDate: '2020-08-01', type: 'FULL_TIME', isActive: true },
  { id: '3', firmId: '5', name: 'Elif Yıldırım', tcNo: '34567890123', firm: 'Star Kimya', department: 'Laboratuvar', jobTitle: 'Kimyager', gender: 'K', startDate: '2023-01-10', type: 'FULL_TIME', isActive: true },
  { id: '4', firmId: '1', name: 'Ali Korkmaz', tcNo: '45678901234', firm: 'ABC İnşaat', department: 'İnşaat', jobTitle: 'Operatör', gender: 'E', startDate: '2024-06-01', type: 'TEMPORARY', isActive: true },
  { id: '5', firmId: '4', name: 'Fatma Güneş', tcNo: '56789012345', firm: 'Ofis Park', department: 'İdari', jobTitle: 'Muhasebe', gender: 'K', startDate: '2021-11-20', type: 'FULL_TIME', isActive: true },
]

export default function CalisanlarPage() {
  const { filterByAccess, isAdmin } = useAuth()
  const [showForm, setShowForm] = useState(false)

  // RBAC: Sadece erişilebilir firmaların çalışanlarını göster
  const employees = filterByAccess(mockEmployees, 'firmId')

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{employees.length}</div><div className="kpi-label">Toplam Çalışan</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}><div className="kpi-value">{employees.filter(e => e.gender === 'K').length}</div><div className="kpi-label">Kadın Çalışan</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{employees.filter(e => e.isActive).length}</div><div className="kpi-label">Aktif</div></div>
      </div>
      <div className="toolbar">
        <div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ad, TC No veya firma ara..." /></div></div>
        <div className="toolbar-right">
          {isAdmin && <button className="btn btn-secondary"><Icon name="Download" size={16} /> Excel İçe Aktar</button>}
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Çalışan</button>}
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Ad Soyad</th><th>TC No</th><th>Firma</th><th>Departman</th><th>Görev</th><th>İşe Giriş</th><th>Tür</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {employees.map(e => (<tr key={e.id}><td style={{ fontWeight: 600 }}>{e.name}</td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.tcNo}</td><td>{e.firm}</td><td>{e.department}</td><td>{e.jobTitle}</td><td>{formatDate(e.startDate)}</td><td><span className="badge badge-info">{EMPLOYMENT_TYPE_LABELS[e.type]}</span></td><td>{e.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Çalışan Kaydı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">TC Kimlik No <span className="required">*</span></label><input className="form-input" maxLength={11} /><span className="form-hint">11 haneli, TC algoritması ile doğrulanır</span></div><div className="form-group"><label className="form-label">Ad Soyad <span className="required">*</span></label><input className="form-input" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Departman</label><input className="form-input" /></div><div className="form-group"><label className="form-label">Görev</label><input className="form-input" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Cinsiyet</label><select className="form-select"><option value="E">Erkek</option><option value="K">Kadın</option></select></div><div className="form-group"><label className="form-label">Doğum Tarihi</label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">İşe Giriş Tarihi <span className="required">*</span></label><input className="form-input" type="date" /></div></div>
        <div className="form-group"><label className="form-label">İstihdam Türü</label><select className="form-select">{Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
