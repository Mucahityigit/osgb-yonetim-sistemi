'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const statusLabels: Record<string, { label: string; cls: string }> = { OPEN: { label: 'Açık', cls: 'badge-danger' }, UNDER_REVIEW: { label: 'İnceleniyor', cls: 'badge-warning' }, SGK_REPORTED: { label: 'SGK Bildirildi', cls: 'badge-info' }, CLOSED: { label: 'Kapatıldı', cls: 'badge-success' } }
const emptyForm = { firmId: '', employeeName: '', employeeTcNo: '', diagnosis: '', icd10Code: '', diagnosisDate: '', diagnosisInstitution: '', causativeAgent: '', exposureDuration: '', jobModification: '' }

export default function MeslekHastaliklariClient({ initialDiseases, initialFirms }: { initialDiseases: any[], initialFirms: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [diseases, setDiseases] = useState<any[]>(initialDiseases)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/meslek-hastaliklari'); if (r.ok) setDiseases(await r.json()) } catch {} }
  const accessible = filterByAccess(diseases, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.employeeName) e.employeeName = 'Çalışan zorunlu'; if (!formData.diagnosis) e.diagnosis = 'Tanı zorunlu'; if (!formData.diagnosisDate) e.diagnosisDate = 'Tarih zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/meslek-hastaliklari/${isEditing}` : '/api/meslek-hastaliklari'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/meslek-hastaliklari/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openEdit = (d: any) => { setIsEditing(d.id); setFormData({ firmId: d.firmId, employeeName: d.employeeName, employeeTcNo: d.employeeTcNo || '', diagnosis: d.diagnosis, icd10Code: d.icd10Code || '', diagnosisDate: d.diagnosisDate?.split('T')[0] || '', diagnosisInstitution: d.diagnosisInstitution || '', causativeAgent: d.causativeAgent || '', exposureDuration: d.exposureDuration || '', jobModification: d.jobModification || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>İşveren, meslek hastalığı tanısı konduktan sonra 3 iş günü içinde SGK'ya bildirmek zorundadır. (5510 Md. 14)</div></div>
      <div className="kpi-grid"><div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Meslek Hastalığı</div></div><div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((d: any) => d.status === 'OPEN').length}</div><div className="kpi-label">Açık Vakalar</div></div></div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Çalışan veya tanı ara..." /></div></div><div className="toolbar-right">{can('OCC_DISEASE_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Kayıt</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Çalışan</th><th>Firma</th><th>Tanı</th><th>ICD-10</th><th>Tanı Tarihi</th><th>Etken</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Meslek hastalığı kaydı bulunamadı.</td></tr> :
        accessible.map((d: any) => (<tr key={d.id}><td style={{ fontWeight: 600 }}>{d.employeeName}</td><td>{d.firm?.name}</td><td>{d.diagnosis}</td><td><span className="badge badge-default">{d.icd10Code || '-'}</span></td><td>{formatDate(d.diagnosisDate)}</td><td>{d.causativeAgent || '-'}</td><td><span className={`badge ${statusLabels[d.status]?.cls}`}>{statusLabels[d.status]?.label}</span></td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('OCC_DISEASE_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(d)}><Icon name="Edit" size={14} /></button>}
            {can('OCC_DISEASE_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(d.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Hastalık Düzenle' : 'Yeni Meslek Hastalığı Bildirimi'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Çalışan Ad Soyad <span className="required">*</span></label><input className={`form-input ${errors.employeeName ? 'border-red-500' : ''}`} value={formData.employeeName} onChange={e => setFormData({...formData, employeeName: e.target.value})} /></div><div className="form-group"><label className="form-label">TC No</label><input className="form-input" maxLength={11} value={formData.employeeTcNo} onChange={e => setFormData({...formData, employeeTcNo: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tanı <span className="required">*</span></label><input className={`form-input ${errors.diagnosis ? 'border-red-500' : ''}`} value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />{errors.diagnosis && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.diagnosis}</span>}</div><div className="form-group"><label className="form-label">ICD-10 Kodu</label><input className="form-input" value={formData.icd10Code} onChange={e => setFormData({...formData, icd10Code: e.target.value})} placeholder="Örn: J62.0" /></div><div className="form-group"><label className="form-label">Tanı Tarihi <span className="required">*</span></label><input className={`form-input ${errors.diagnosisDate ? 'border-red-500' : ''}`} type="date" value={formData.diagnosisDate} onChange={e => setFormData({...formData, diagnosisDate: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Tanı Kuruluşu</label><input className="form-input" value={formData.diagnosisInstitution} onChange={e => setFormData({...formData, diagnosisInstitution: e.target.value})} /></div><div className="form-group"><label className="form-label">Hastalığa Neden Olan Etken</label><input className="form-input" value={formData.causativeAgent} onChange={e => setFormData({...formData, causativeAgent: e.target.value})} /></div><div className="form-group"><label className="form-label">Maruziyete Süresi</label><input className="form-input" value={formData.exposureDuration} onChange={e => setFormData({...formData, exposureDuration: e.target.value})} placeholder="Örn: 15 yıl" /></div></div>
        <div className="form-group"><label className="form-label">İş Uyarlaması</label><textarea className="form-textarea" rows={2} value={formData.jobModification} onChange={e => setFormData({...formData, jobModification: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Kayıt Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu kayıt kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
