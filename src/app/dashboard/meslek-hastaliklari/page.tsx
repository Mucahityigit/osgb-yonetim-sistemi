'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockData = [
  { id: '1', firmId: '5', firm: 'Star Kimya', employeeName: 'Veli Usta', tcNo: '12345678901', diagnosis: 'Mesleki Astım', icd10: 'J45', diagnosisDate: '2025-03-15', institution: 'Ankara Meslek Hastalıkları Hastanesi', causativeAgent: 'Kimyasal buhar (toluen)', exposureDuration: '5 yıl', status: 'OPEN', sgkDeadline: '2025-03-20', sgkDaysLeft: 0 },
  { id: '2', firmId: '2', firm: 'XYZ Metal', employeeName: 'Kemal Güneş', tcNo: '98765432109', diagnosis: 'Sensörinöral İşitme Kaybı', icd10: 'H83.3', diagnosisDate: '2025-02-10', institution: 'İstanbul Çapa Tıp Fakültesi', causativeAgent: 'Gürültü (85+ dB)', exposureDuration: '12 yıl', status: 'NOTIFIED', sgkDeadline: '2025-02-15', sgkRefNumber: 'SGK-2025-MH-0012' },
]

export default function MeslekHastaliklariPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)

  // RBAC: Sadece erişilebilir firmaların meslek hastalıklarını göster
  const diseases = filterByAccess(mockData, 'firmId')

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}><div className="kpi-value">{diseases.length}</div><div className="kpi-label">Toplam Meslek Hastalığı</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{diseases.filter(d => d.status === 'OPEN').length}</div><div className="kpi-label">SGK Bildirimi Bekleyen</div></div>
      </div>
      <div className="toolbar">
        <div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ara..." /></div></div>
        <div className="toolbar-right">
          {can('OCC_DISEASE_CREATE') && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Bildirim</button>
          )}
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Çalışan</th><th>Tanı</th><th>ICD-10</th><th>Teşhis Tarihi</th><th>Etken</th><th>SGK Durumu</th><th>İşlem</th></tr></thead><tbody>
        {diseases.map(d => (<tr key={d.id}><td style={{ fontWeight: 600 }}>{d.firm}</td><td>{d.employeeName}</td><td>{d.diagnosis}</td><td><span className="badge badge-violet">{d.icd10}</span></td><td>{formatDate(d.diagnosisDate)}</td><td>{d.causativeAgent}</td><td>{d.status === 'OPEN' ? <span className="badge badge-danger">Bildirimi Bekliyor</span> : <span className="badge badge-success">Bildirildi</span>}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Meslek Hastalığı Bildirimi</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div><strong>Yasal Uyarı:</strong> Meslek hastalığı teşhis tarihinden itibaren <strong>3 iş günü</strong> içinde SGK{"'"}ya bildirilmelidir.</div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Çalışan TC No</label><input className="form-input" maxLength={11} /></div><div className="form-group"><label className="form-label">Çalışan Adı <span className="required">*</span></label><input className="form-input" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tanı <span className="required">*</span></label><input className="form-input" placeholder="Hastalık adı" /></div><div className="form-group"><label className="form-label">ICD-10 Kodu</label><input className="form-input" placeholder="Örn: J45" /></div><div className="form-group"><label className="form-label">Teşhis Tarihi <span className="required">*</span></label><input className="form-input" type="date" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Teşhis Koyan Kurum</label><input className="form-input" /></div><div className="form-group"><label className="form-label">Maruz Kalınan Etken</label><input className="form-input" /></div><div className="form-group"><label className="form-label">Maruziyet Süresi</label><input className="form-input" placeholder="Örn: 5 yıl" /></div></div>
        <div className="form-group"><label className="form-label">İş Uyarlaması / Görev Değişikliği</label><textarea className="form-textarea" rows={2} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
