'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockData = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', date: '2025-04-01', time: '11:00', location: 'C Blok çatı', hazardType: 'FALL_RISK', description: 'İşçi korkuluk olmayan çatı kenarından geçerken dengesini kaybetti', potentialSeverity: 'INPATIENT', immediateActions: 'Çatı kenarına geçici bariyer konuldu', rootCause: 'Korkuluk eksikliği', correctiveStatus: 'IN_PROGRESS', responsiblePerson: 'Ahmet Yılmaz' },
  { id: '2', firmId: '5', firm: 'Star Kimya', date: '2025-03-25', time: '14:20', location: 'Depo', hazardType: 'CHEMICAL_EXPOSURE', description: 'Asit bidonu devrildi, küçük sızıntı oldu, kimse maruz kalmadı', potentialSeverity: 'OUTPATIENT', immediateActions: 'Nötralize edici ile temizlendi', rootCause: 'Yanlış istifleme', correctiveStatus: 'CLOSED', responsiblePerson: 'Mehmet Kaya' },
  { id: '3', firmId: '2', firm: 'XYZ Metal', date: '2025-03-20', time: '09:45', location: 'Torna bölümü', hazardType: 'MACHINE', description: 'Torna tezgahı koruyucu kapağı açıkken çalıştırıldı', potentialSeverity: 'PERMANENT_DISABILITY', immediateActions: 'Makine durduruldu, interlock sistemi kontrol edildi', rootCause: 'Interlock arızası', correctiveStatus: 'VERIFIED', responsiblePerson: 'Ayşe Demir' },
]

const hazardLabels: Record<string, string> = { FALL_RISK: 'Düşme Riski', CHEMICAL_EXPOSURE: 'Kimyasal Maruziyet', ELECTRIC: 'Elektrik', ERGONOMIC: 'Ergonomi', FIRE: 'Yangın', MACHINE: 'Makine', OTHER: 'Diğer' }
const statusLabels: Record<string, { label: string; cls: string }> = { OPEN: { label: 'Açık', cls: 'badge-danger' }, IN_PROGRESS: { label: 'Devam Ediyor', cls: 'badge-warning' }, CLOSED: { label: 'Kapatıldı', cls: 'badge-success' }, VERIFIED: { label: 'Doğrulandı', cls: 'badge-info' } }

export default function RamakKalaPage() {
  const { filterByAccess, can } = useAuth()
  const [showForm, setShowForm] = useState(false)

  // RBAC: Sadece erişilebilir firmaların ramak kala olaylarını göster
  const events = filterByAccess(mockData, 'firmId')

  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>Her ciddi kaza için ortalama 300 ramak kala olayı gerçekleşir (Heinrich Üçgeni). Ramak kala olaylarının kaydı ve analizi kritik öneme sahiptir.</div></div>
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{events.length}</div><div className="kpi-label">Toplam Ramak Kala</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{events.filter(d => d.correctiveStatus === 'OPEN' || d.correctiveStatus === 'IN_PROGRESS').length}</div><div className="kpi-label">Açık Düzeltici Faaliyet</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}><div className="kpi-value">{events.filter(d => d.correctiveStatus === 'CLOSED' || d.correctiveStatus === 'VERIFIED').length}</div><div className="kpi-label">Kapatılan</div></div>
      </div>
      <div className="toolbar">
        <div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ara..." /></div></div>
        <div className="toolbar-right">
          {can('NEAR_MISS_CREATE') && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><Icon name="Plus" size={16} /> Yeni Ramak Kala Kaydı</button>
          )}
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Tarih</th><th>Tehlike Türü</th><th>Olay Tanımı</th><th>Potansiyel Şiddet</th><th>Düzeltici Durum</th><th>Sorumlu</th><th>İşlem</th></tr></thead><tbody>
        {events.map(d => (<tr key={d.id}><td style={{ fontWeight: 600 }}>{d.firm}</td><td>{formatDate(d.date)}</td><td><span className="badge badge-info">{hazardLabels[d.hazardType]}</span></td><td style={{ maxWidth: 250 }} className="truncate">{d.description}</td><td><span className="badge badge-orange">{d.potentialSeverity}</span></td><td><span className={`badge ${statusLabels[d.correctiveStatus]?.cls}`}>{statusLabels[d.correctiveStatus]?.label}</span></td><td>{d.responsiblePerson}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Ramak Kala Olay Bildirimi</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div><div className="form-group"><label className="form-label">Olay Tarihi <span className="required">*</span></label><input className="form-input" type="date" /></div><div className="form-group"><label className="form-label">Saat</label><input className="form-input" type="time" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tehlike Türü <span className="required">*</span></label><select className="form-select">{Object.entries(hazardLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Olay Yeri</label><input className="form-input" placeholder="Bölüm/Alan" /></div></div>
        <div className="form-group"><label className="form-label">Olay Tanımı <span className="required">*</span></label><textarea className="form-textarea" placeholder="Ne oldu? Ne olabilirdi?" rows={4} /></div>
        <div className="form-group"><label className="form-label">Derhal Alınan Önlemler</label><textarea className="form-textarea" rows={2} /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Kök Neden Analizi</label><select className="form-select"><option value="BARRIER_ANALYSIS">Bariyer Analizi</option><option value="WHY_WHY_ANALYSIS">Neden-Neden Analizi</option><option value="FISHBONE">Balık Kılçığı</option></select></div><div className="form-group"><label className="form-label">Kök Neden Açıklama</label><input className="form-input" /></div></div>
        <div className="form-group"><label className="form-label">Düzeltici Faaliyet Planı</label><textarea className="form-textarea" rows={3} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button><button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button></div></div></div>)}
    </div>
  )
}
