'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { ROLE_LABELS } from '@/lib/constants'
import { formatDateTime } from '@/lib/utils'

const mockUsers = [
  { id: '1', name: 'Yönetici Admin', email: 'admin@osgb.com', role: 'ADMIN', isActive: true, lastLogin: '2025-04-04T14:30:00', firmCount: null, certificate: null },
  { id: '2', name: 'Ahmet Yılmaz', email: 'uzman@osgb.com', role: 'EXPERT', isActive: true, lastLogin: '2025-04-04T09:15:00', firmCount: 15, certificate: 'A' },
  { id: '3', name: 'Mehmet Kaya', email: 'mehmet@osgb.com', role: 'EXPERT', isActive: true, lastLogin: '2025-04-03T16:45:00', firmCount: 12, certificate: 'B' },
  { id: '4', name: 'Ayşe Demir', email: 'ayse@osgb.com', role: 'EXPERT', isActive: true, lastLogin: '2025-04-04T11:00:00', firmCount: 10, certificate: 'B' },
  { id: '5', name: 'Dr. Zeynep Acar', email: 'hekim@osgb.com', role: 'DOCTOR', isActive: true, lastLogin: '2025-04-03T08:30:00', firmCount: 20, certificate: null },
  { id: '6', name: 'Kemal Şen', email: 'firma@osgb.com', role: 'CLIENT', isActive: true, lastLogin: '2025-04-02T17:00:00', firmCount: 1, certificate: null },
]

export default function KullanicilarPage() {
  const [showForm, setShowForm] = useState(false)
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        {Object.entries(ROLE_LABELS).map(([k, v]) => (
          <div key={k} className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
            <div className="kpi-value">{mockUsers.filter(u => u.role === k).length}</div>
            <div className="kpi-label">{v}</div>
          </div>
        ))}
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Kullanıcı ara..." /></div></div><div className="toolbar-right"><button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Kullanıcı</button></div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Sertifika</th><th>Firma Sayısı</th><th>Son Giriş</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {mockUsers.map(u => (<tr key={u.id}><td style={{ fontWeight: 600 }}>{u.name}</td><td>{u.email}</td><td><span className="badge badge-info">{ROLE_LABELS[u.role]}</span></td><td>{u.certificate ? <span className="badge badge-violet">{u.certificate} Sınıfı</span> : '-'}</td><td>{u.firmCount ?? '-'}</td><td>{u.lastLogin ? formatDateTime(u.lastLogin) : '-'}</td><td>{u.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td><td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-ghost"><Icon name="Edit" size={14} /></button></div></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Kullanıcı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-group"><label className="form-label">Ad Soyad <span className="required">*</span></label><input className="form-input" /></div>
        <div className="form-group"><label className="form-label">E-posta <span className="required">*</span></label><input className="form-input" type="email" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Rol <span className="required">*</span></label><select className="form-select">{Object.entries(ROLE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Sertifika Sınıfı</label><select className="form-select"><option value="">Yok</option><option value="A">A Sınıfı</option><option value="B">B Sınıfı</option><option value="C">C Sınıfı</option></select></div></div>
        <div className="form-group"><label className="form-label">Şifre <span className="required">*</span></label><input className="form-input" type="password" /><span className="form-hint">Min. 12 karakter, büyük/küçük harf, rakam ve özel karakter zorunlu</span></div>
        <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Oluştur</button></div></div></div>)}
    </div>
  )
}
