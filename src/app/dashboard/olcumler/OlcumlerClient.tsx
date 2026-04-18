'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const measurementTypes: Record<string, string> = { NOISE: 'Gürültü', DUST: 'Toz', LIGHT: 'Aydınlatma', THERMAL: 'Termal Konfor', VIBRATION: 'Titreşim', CHEMICAL: 'Kimyasal', EMF: 'Elektromanyetik Alan' }
const emptyForm = { firmId: '', measurementType: 'NOISE', measurementDate: '', performedBy: '', accreditationNo: '', results: '', exceededLimits: false, nextMeasurementDate: '' }

export default function OlcumlerClient({ initialMeasurements, initialFirms }: { initialMeasurements: any[], initialFirms: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [measurements, setMeasurements] = useState<any[]>(initialMeasurements)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/olcumler'); if (r.ok) setMeasurements(await r.json()) } catch {} }
  const accessible = filterByAccess(measurements, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.measurementDate) e.measurementDate = 'Tarih zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/olcumler/${isEditing}` : '/api/olcumler'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/olcumler/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openEdit = (m: any) => { setIsEditing(m.id); setFormData({ firmId: m.firmId, measurementType: m.measurementType, measurementDate: m.measurementDate?.split('T')[0] || '', performedBy: m.performedBy || '', accreditationNo: m.accreditationNo || '', results: m.results?.value || '', exceededLimits: m.exceededLimits ?? false, nextMeasurementDate: m.nextMeasurementDate?.split('T')[0] || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Ölçüm</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((m: any) => m.exceededLimits).length}</div><div className="kpi-label">Limit Aşımı</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Firma veya ölçüm ara..." /></div></div><div className="toolbar-right">{can('MEASUREMENT_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Ölçüm</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Ölçüm Türü</th><th>Tarih</th><th>Ölçüm Yapan</th><th>Akreditasyon</th><th>Limit Aşımı</th><th>Sonraki Ölçüm</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Ölçüm bulunamadı.</td></tr> :
        accessible.map((m: any) => (<tr key={m.id}><td style={{ fontWeight: 600 }}>{m.firm?.name}</td><td><span className="badge badge-info">{measurementTypes[m.measurementType] || m.measurementType}</span></td><td>{formatDate(m.measurementDate)}</td><td>{m.performedBy || '-'}</td><td>{m.accreditationNo || '-'}</td><td>{m.exceededLimits ? <span className="badge badge-danger">Evet</span> : <span className="badge badge-success">Hayır</span>}</td><td>{m.nextMeasurementDate ? formatDate(m.nextMeasurementDate) : '-'}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('MEASUREMENT_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(m)}><Icon name="Edit" size={14} /></button>}
            {can('MEASUREMENT_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(m.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Ölçüm Düzenle' : 'Yeni Ölçüm Kaydı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Ölçüm Türü</label><select className="form-select" value={formData.measurementType} onChange={e => setFormData({...formData, measurementType: e.target.value})}>{Object.entries(measurementTypes).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Tarih <span className="required">*</span></label><input className={`form-input ${errors.measurementDate ? 'border-red-500' : ''}`} type="date" value={formData.measurementDate} onChange={e => setFormData({...formData, measurementDate: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Ölçüm Yapan Kuruluş</label><input className="form-input" value={formData.performedBy} onChange={e => setFormData({...formData, performedBy: e.target.value})} /></div><div className="form-group"><label className="form-label">Akreditasyon No</label><input className="form-input" value={formData.accreditationNo} onChange={e => setFormData({...formData, accreditationNo: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Sonuçlar</label><input className="form-input" value={formData.results} onChange={e => setFormData({...formData, results: e.target.value})} /></div><div className="form-group"><label className="form-label">Sonraki Ölçüm</label><input className="form-input" type="date" value={formData.nextMeasurementDate} onChange={e => setFormData({...formData, nextMeasurementDate: e.target.value})} /></div></div>
        <div className="form-group"><label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={formData.exceededLimits as boolean} onChange={e => setFormData({...formData, exceededLimits: e.target.checked})} /> Limit Aşımı Tespit Edildi</label></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Ölçüm Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu ölçüm kaydı silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
