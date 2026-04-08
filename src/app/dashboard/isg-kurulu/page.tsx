'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockMeetings = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat (120 çalışan)', date: '2025-04-01', location: 'Toplantı Salonu', duration: 90, agenda: 'Mart ayı kaza analizi, İskele güvenliği tedbirleri, KKD dağıtım durumu', decisions: '1. İskele kontrol sıklığı artırılacak\n2. Baret kullanımı zorunluluğu sıkılaştırılacak', nextDate: '2025-05-01', attendees: 8 },
  { id: '2', firmId: '5', firm: 'Star Kimya (150 çalışan)', date: '2025-03-15', location: 'Konferans Odası', duration: 60, agenda: 'Kimyasal depolama güvenliği, Yangın tatbikatı planlaması', decisions: '1. MSDS sayfaları güncellendi\n2. Mayıs ayında tatbikat yapılacak', nextDate: '2025-04-15', attendees: 7 },
]

export default function IsgKuruluPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const meetings = filterByAccess(mockMeetings, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>50 ve üzeri çalışanı olan işyerleri için İSG Kurulu oluşturma ve toplantı yapma zorunluluğu bulunmaktadır. (6331 Md. 22)</div></div>
      <div className="kpi-grid"><div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{meetings.length}</div><div className="kpi-label">Toplam Toplantı</div></div><div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{meetings.length}</div><div className="kpi-label">50+ Çalışanlı Firma</div></div></div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Firma ara..." /></div></div><div className="toolbar-right">{can('ISG_MEETING_CREATE') && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Toplantı Kaydı</button>}</div></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {meetings.map(m => (
          <div key={m.id} className="card">
            <div className="card-header"><div><h3 className="card-title">{m.firm}</h3><p className="card-subtitle">{formatDate(m.date)} — {m.location} — {m.duration} dk — {m.attendees} katılımcı</p></div><div style={{ display: 'flex', gap: 8 }}><button className="btn btn-sm btn-secondary"><Icon name="Download" size={14} /> PDF Tutanak</button></div></div>
            <div style={{ marginBottom: 12 }}><h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Gündem:</h4><p style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{m.agenda}</p></div>
            <div style={{ marginBottom: 12 }}><h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Kararlar:</h4><pre style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)' }}>{m.decisions}</pre></div>
            <div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sonraki Toplantı: <strong>{formatDate(m.nextDate)}</strong></span></div>
          </div>
        ))}
      </div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">İSG Kurulu Toplantı Kaydı</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz (50+ çalışan)...</option></select></div><div className="form-group"><label className="form-label">Toplantı Tarihi <span className="required">*</span></label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">Süre (dk)</label><input className="form-input" type="number" min="15" /></div></div>
        <div className="form-group"><label className="form-label">Yer</label><input className="form-input" /></div>
        <div className="form-group"><label className="form-label">Gündem Maddeleri <span className="required">*</span></label><textarea className="form-textarea" rows={3} /></div>
        <div className="form-group"><label className="form-label">Alınan Kararlar</label><textarea className="form-textarea" rows={3} /></div>
        <div className="form-group"><label className="form-label">Sonraki Toplantı Tarihi</label><input className="form-input" type="date" /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
