'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const hazardLabels: Record<string, string> = { FALL_RISK: 'Düşme Riski', CHEMICAL_EXPOSURE: 'Kimyasal Maruziyet', ELECTRIC: 'Elektrik', ERGONOMIC: 'Ergonomi', FIRE: 'Yangın', MACHINE: 'Makine', OTHER: 'Diğer' }
const statusLabels: Record<string, { label: string; cls: string }> = { OPEN: { label: 'Açık', cls: 'badge-danger' }, IN_PROGRESS: { label: 'Devam Ediyor', cls: 'badge-warning' }, CLOSED: { label: 'Kapatıldı', cls: 'badge-success' }, VERIFIED: { label: 'Doğrulandı', cls: 'badge-info' } }
const emptyForm = { firmId: '', incidentDate: new Date().toISOString().split('T')[0], incidentTime: '', location: '', hazardType: 'FALL_RISK', description: '', immediateActions: '', rootCause: '', rootCauseMethod: 'BARRIER_ANALYSIS', correctiveActions: '' }

export default function RamakKalaClient({ initialIncidents, initialFirms }: { initialIncidents: any[], initialFirms: any[] }) {
  const { filterByAccess, can, user } = useAuth()
  const [incidents, setIncidents] = useState<any[]>(initialIncidents)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/ramak-kala'); if (r.ok) setIncidents(await r.json()) } catch {} }
  const events = filterByAccess(incidents, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.description) e.description = 'Olay tanımı zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/ramak-kala/${isEditing}` : '/api/ramak-kala'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, expertId: user?.id }) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/ramak-kala/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }

  const openEdit = (d: any) => { setIsEditing(d.id); setFormData({ firmId: d.firmId, incidentDate: d.incidentDate?.split('T')[0] || '', incidentTime: d.incidentTime || '', location: d.location || '', hazardType: d.hazardType, description: d.description, immediateActions: d.immediateActions || '', rootCause: d.rootCause || '', rootCauseMethod: d.rootCauseMethod || 'BARRIER_ANALYSIS', correctiveActions: d.correctiveActions || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>Her ciddi kaza için ortalama 300 ramak kala olayı gerçekleşir (Heinrich Üçgeni).</div></div>
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{events.length}</div><div className="kpi-label">Toplam Ramak Kala</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{events.filter((d: any) => d.correctiveStatus === 'OPEN' || d.correctiveStatus === 'IN_PROGRESS').length}</div><div className="kpi-label">Açık Düzeltici</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ara..." /></div></div><div className="toolbar-right">{can('NEAR_MISS_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Ramak Kala</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Tarih</th><th>Tehlike Türü</th><th>Olay Tanımı</th><th>Düzeltici Durum</th><th>İşlem</th></tr></thead><tbody>
        {events.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Kayıt bulunamadı.</td></tr> :
        events.map((d: any) => (<tr key={d.id}><td style={{ fontWeight: 600 }}>{d.firm?.name}</td><td>{formatDate(d.incidentDate)}</td><td><span className="badge badge-info">{hazardLabels[d.hazardType]}</span></td><td style={{ maxWidth: 250 }} className="truncate">{d.description}</td><td><span className={`badge ${statusLabels[d.correctiveStatus]?.cls}`}>{statusLabels[d.correctiveStatus]?.label}</span></td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('NEAR_MISS_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(d)}><Icon name="Edit" size={14} /></button>}
            {can('NEAR_MISS_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(d.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Ramak Kala Düzenle' : 'Ramak Kala Olay Bildirimi'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Olay Tarihi</label><input className="form-input" type="date" value={formData.incidentDate} onChange={e => setFormData({...formData, incidentDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Saat</label><input className="form-input" type="time" value={formData.incidentTime} onChange={e => setFormData({...formData, incidentTime: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tehlike Türü</label><select className="form-select" value={formData.hazardType} onChange={e => setFormData({...formData, hazardType: e.target.value})}>{Object.entries(hazardLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Olay Yeri</label><input className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div></div>
        <div className="form-group"><label className="form-label">Olay Tanımı <span className="required">*</span></label><textarea className={`form-textarea ${errors.description ? 'border-red-500' : ''}`} rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Derhal Alınan Önlemler</label><textarea className="form-textarea" rows={2} value={formData.immediateActions} onChange={e => setFormData({...formData, immediateActions: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Düzeltici Faaliyet Planı</label><textarea className="form-textarea" rows={3} value={formData.correctiveActions} onChange={e => setFormData({...formData, correctiveActions: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Kayıt Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu kayıt kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
