'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { TRAINING_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const locLabels: Record<string, string> = { WORKPLACE: 'İşyeri', CONFERENCE_HALL: 'Konferans', ONLINE: 'Online' }
const emptyForm = { firmId: '', trainingTitle: '', trainingDate: '', durationHours: '4', trainerName: '', trainerCert: '', trainingType: 'ENTRY', location: 'WORKPLACE', content: '' }

export default function EgitimlerClient({ initialTrainings, initialFirms }: { initialTrainings: any[], initialFirms: any[] }) {
  const { filterByAccess, can, user } = useAuth()
  const [trainings, setTrainings] = useState<any[]>(initialTrainings)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/egitimler'); if (r.ok) setTrainings(await r.json()) } catch {} }
  const accessible = filterByAccess(trainings, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.trainingTitle) e.trainingTitle = 'Başlık zorunlu'; if (!formData.trainingDate) e.trainingDate = 'Tarih zorunlu'; if (!formData.trainerName) e.trainerName = 'Eğitimci zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/egitimler/${isEditing}` : '/api/egitimler'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, createdById: user?.id }) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Beklenmeyen hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/egitimler/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } else { const e = await r.json(); alert(e.error) } } catch { alert('Hata') } }

  const openEdit = (t: any) => { setIsEditing(t.id); setFormData({ firmId: t.firmId, trainingTitle: t.trainingTitle, trainingDate: t.trainingDate?.split('T')[0] || '', durationHours: String(t.durationHours), trainerName: t.trainerName, trainerCert: t.trainerCert || '', trainingType: t.trainingType, location: t.location, content: t.content || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Eğitim</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.reduce((s: number, t: any) => s + (t._count?.participants || 0), 0)}</div><div className="kpi-label">Toplam Katılımcı</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-cyan)' } as React.CSSProperties}><div className="kpi-value">{accessible.reduce((s: number, t: any) => s + (t.durationHours || 0), 0)}</div><div className="kpi-label">Toplam Saat</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Eğitim veya firma ara..." /></div></div><div className="toolbar-right">{can('TRAINING_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Eğitim Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Eğitim Başlığı</th><th>Firma</th><th>Tarih</th><th>Süre</th><th>Tür</th><th>Eğitimci</th><th>Yer</th><th>Katılımcı</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Eğitim bulunamadı.</td></tr> :
        accessible.map(t => (<tr key={t.id}><td style={{ fontWeight: 600 }}>{t.trainingTitle}</td><td>{t.firm?.name}</td><td>{formatDate(t.trainingDate)}</td><td>{t.durationHours} sa</td><td><span className="badge badge-info">{TRAINING_TYPE_LABELS[t.trainingType]}</span></td><td>{t.trainerName}</td><td><span className="badge badge-default">{locLabels[t.location]}</span></td><td>{t._count?.participants || 0}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('TRAINING_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(t)}><Icon name="Edit" size={14} /></button>}
            {can('TRAINING_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(t.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Eğitim Düzenle' : 'Yeni Eğitim Kaydı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitim Başlığı <span className="required">*</span></label><input className={`form-input ${errors.trainingTitle ? 'border-red-500' : ''}`} value={formData.trainingTitle} onChange={e => setFormData({...formData, trainingTitle: e.target.value})} />{errors.trainingTitle && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.trainingTitle}</span>}</div><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>{errors.firmId && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.firmId}</span>}</div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tarih <span className="required">*</span></label><input className={`form-input ${errors.trainingDate ? 'border-red-500' : ''}`} type="date" value={formData.trainingDate} onChange={e => setFormData({...formData, trainingDate: e.target.value})} />{errors.trainingDate && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.trainingDate}</span>}</div><div className="form-group"><label className="form-label">Süre (Saat)</label><input className="form-input" type="number" min="0.5" step="0.5" value={formData.durationHours} onChange={e => setFormData({...formData, durationHours: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitim Türü</label><select className="form-select" value={formData.trainingType} onChange={e => setFormData({...formData, trainingType: e.target.value})}>{Object.entries(TRAINING_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Eğitim Yeri</label><select className="form-select" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>{Object.entries(locLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Eğitimci Adı <span className="required">*</span></label><input className={`form-input ${errors.trainerName ? 'border-red-500' : ''}`} value={formData.trainerName} onChange={e => setFormData({...formData, trainerName: e.target.value})} />{errors.trainerName && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.trainerName}</span>}</div><div className="form-group"><label className="form-label">Eğitimci Yetkinlik Belgesi</label><input className="form-input" value={formData.trainerCert} onChange={e => setFormData({...formData, trainerCert: e.target.value})} /></div></div>
        <div className="form-group"><label className="form-label">Eğitim İçeriği</label><textarea className="form-textarea" rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Eğitim Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu eğitim kaydı ve katılımcıları kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
