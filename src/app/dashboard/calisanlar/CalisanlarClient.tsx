'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { EMPLOYMENT_TYPE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const emptyForm = { tcNo: '', name: '', firmId: '', department: '', jobTitle: '', gender: 'E', birthDate: '', startDate: '', employmentType: 'FULL_TIME' }

export default function CalisanlarClient({ initialEmployees, initialFirms }: { initialEmployees: any[], initialFirms: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [employees, setEmployees] = useState<any[]>(initialEmployees)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')

  const fetchData = async () => { try { const res = await fetch('/api/calisanlar'); if (res.ok) setEmployees(await res.json()) } catch {} }
  const accessibleEmployees = filterByAccess(employees, 'firmId')
  const filtered = accessibleEmployees.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.tcNo.includes(search) || e.firm?.name?.toLowerCase().includes(search.toLowerCase()))

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.tcNo || formData.tcNo.length !== 11) e.tcNo = 'TC 11 haneli olmalı'; if (!formData.name) e.name = 'Ad zorunlu'; if (!formData.startDate) e.startDate = 'Tarih zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    try {
      const url = isEditing ? `/api/calisanlar/${isEditing}` : '/api/calisanlar'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Beklenmeyen hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const res = await fetch(`/api/calisanlar/${deleteId}`, { method: 'DELETE' }); if (res.ok) { setDeleteId(null); fetchData() } else { const e = await res.json(); alert(e.error) } } catch { alert('Hata') } }

  const openEdit = (e: any) => { setIsEditing(e.id); setFormData({ tcNo: e.tcNo, name: e.name, firmId: e.firmId, department: e.department || '', jobTitle: e.jobTitle || '', gender: e.gender || 'E', birthDate: e.birthDate ? e.birthDate.split('T')[0] : '', startDate: e.startDate ? e.startDate.split('T')[0] : '', employmentType: e.employmentType || 'FULL_TIME' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessibleEmployees.length}</div><div className="kpi-label">Toplam Çalışan</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}><div className="kpi-value">{accessibleEmployees.filter(e => e.gender === 'K').length}</div><div className="kpi-label">Kadın Çalışan</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{accessibleEmployees.filter(e => e.isActive).length}</div><div className="kpi-label">Aktif</div></div>
      </div>
      <div className="toolbar">
        <div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ad, TC No veya firma ara..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <div className="toolbar-right">
          {can('EMPLOYEE_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Çalışan</button>}
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Ad Soyad</th><th>TC No</th><th>Firma</th><th>Departman</th><th>Görev</th><th>İşe Giriş</th><th>Tür</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {filtered.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Çalışan bulunamadı.</td></tr> :
        filtered.map(e => (<tr key={e.id}><td style={{ fontWeight: 600 }}>{e.name}</td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.tcNo}</td><td>{e.firm?.name || '-'}</td><td>{e.department || '-'}</td><td>{e.jobTitle || '-'}</td><td>{formatDate(e.startDate)}</td><td><span className="badge badge-info">{EMPLOYMENT_TYPE_LABELS[e.employmentType]}</span></td><td>{e.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('EMPLOYEE_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(e)}><Icon name="Edit" size={14} /></button>}
            {can('EMPLOYEE_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(e.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Çalışan Düzenle' : 'Yeni Çalışan Kaydı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">TC Kimlik No <span className="required">*</span></label><input className={`form-input ${errors.tcNo ? 'border-red-500' : ''}`} maxLength={11} value={formData.tcNo} onChange={e => setFormData({...formData, tcNo: e.target.value})} />{errors.tcNo && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.tcNo}</span>}</div><div className="form-group"><label className="form-label">Ad Soyad <span className="required">*</span></label><input className={`form-input ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />{errors.name && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.name}</span>}</div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>{errors.firmId && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.firmId}</span>}</div><div className="form-group"><label className="form-label">Departman</label><input className="form-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} /></div><div className="form-group"><label className="form-label">Görev</label><input className="form-input" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Cinsiyet</label><select className="form-select" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option value="E">Erkek</option><option value="K">Kadın</option></select></div><div className="form-group"><label className="form-label">Doğum Tarihi</label><input className="form-input" type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} /></div><div className="form-group"><label className="form-label">İşe Giriş Tarihi <span className="required">*</span></label><input className={`form-input ${errors.startDate ? 'border-red-500' : ''}`} type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />{errors.startDate && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.startDate}</span>}</div></div>
        <div className="form-group"><label className="form-label">İstihdam Türü</label><select className="form-select" value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}>{Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Çalışan Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu çalışan kaydı kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
