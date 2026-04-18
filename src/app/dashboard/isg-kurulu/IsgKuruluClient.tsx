'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const emptyForm = { firmId: '', meetingDate: '', location: '', durationMinutes: '60', agenda: '', decisions: '', nextMeetingDate: '' }

export default function IsgKuruluClient({ initialMeetings, initialFirms }: { initialMeetings: any[], initialFirms: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [meetings, setMeetings] = useState<any[]>(initialMeetings)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/isg-kurulu'); if (r.ok) setMeetings(await r.json()) } catch {} }
  const accessible = filterByAccess(meetings, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.meetingDate) e.meetingDate = 'Tarih zorunlu'; if (!formData.agenda) e.agenda = 'Gündem zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/isg-kurulu/${isEditing}` : '/api/isg-kurulu'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/isg-kurulu/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openEdit = (m: any) => { setIsEditing(m.id); setFormData({ firmId: m.firmId, meetingDate: m.meetingDate?.split('T')[0] || '', location: m.location || '', durationMinutes: String(m.durationMinutes || 60), agenda: m.agenda, decisions: m.decisions || '', nextMeetingDate: m.nextMeetingDate?.split('T')[0] || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>50 ve üzeri çalışanı olan işyerlerinde İSG Kurulu oluşturulması zorunludur (6331 Md. 22).</div></div>
      <div className="kpi-grid"><div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Toplantı</div></div></div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Firma ara..." /></div></div><div className="toolbar-right">{can('ISG_MEETING_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Toplantı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Toplantı Tarihi</th><th>Yer</th><th>Süre</th><th>Gündem</th><th>Sonraki Toplantı</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Toplantı bulunamadı.</td></tr> :
        accessible.map((m: any) => (<tr key={m.id}><td style={{ fontWeight: 600 }}>{m.firm?.name}</td><td>{formatDate(m.meetingDate)}</td><td>{m.location || '-'}</td><td>{m.durationMinutes ? `${m.durationMinutes} dk` : '-'}</td><td style={{ maxWidth: 200 }} className="truncate">{m.agenda}</td><td>{m.nextMeetingDate ? formatDate(m.nextMeetingDate) : '-'}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('ISG_MEETING_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(m)}><Icon name="Edit" size={14} /></button>}
            {can('ISG_MEETING_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(m.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Toplantı Düzenle' : 'Yeni İSG Kurulu Toplantısı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Toplantı Tarihi <span className="required">*</span></label><input className={`form-input ${errors.meetingDate ? 'border-red-500' : ''}`} type="date" value={formData.meetingDate} onChange={e => setFormData({...formData, meetingDate: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Toplantı Yeri</label><input className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div><div className="form-group"><label className="form-label">Süre (dk)</label><input className="form-input" type="number" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} /></div><div className="form-group"><label className="form-label">Sonraki Toplantı</label><input className="form-input" type="date" value={formData.nextMeetingDate} onChange={e => setFormData({...formData, nextMeetingDate: e.target.value})} /></div></div>
        <div className="form-group"><label className="form-label">Gündem <span className="required">*</span></label><textarea className={`form-textarea ${errors.agenda ? 'border-red-500' : ''}`} rows={4} value={formData.agenda} onChange={e => setFormData({...formData, agenda: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Alınan Kararlar</label><textarea className="form-textarea" rows={3} value={formData.decisions} onChange={e => setFormData({...formData, decisions: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Toplantı Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu toplantı kaydı kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
