'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const ppeTypes = ['Baret', 'Koruyucu Gözlük', 'İş Eldiveni', 'Emniyet Ayakkabısı', 'Kulak Koruyucu', 'Toz Maskesi', 'Yüz Siperi', 'Paraşüt Tipi Emniyet Kemeri', 'Reflektif Yelek', 'Kimyasal Koruyucu Elbise']
const emptyForm = { firmId: '', employeeId: '', ppeType: 'Baret', ppeStandard: '', quantity: '1', distributionDate: new Date().toISOString().split('T')[0], distributedBy: '', renewalDate: '' }

export default function KkdClient({ initialDistributions, initialFirms, initialEmployees }: { initialDistributions: any[], initialFirms: any[], initialEmployees: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [dists, setDists] = useState<any[]>(initialDistributions)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/kkd'); if (r.ok) setDists(await r.json()) } catch {} }
  const accessible = filterByAccess(dists, 'firmId')
  const empForFirm = formData.firmId ? initialEmployees.filter((e: any) => e.firmId === formData.firmId) : initialEmployees

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.employeeId) e.employeeId = 'Çalışan zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/kkd/${isEditing}` : '/api/kkd'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/kkd/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }

  const openEdit = (d: any) => { setIsEditing(d.id); setFormData({ firmId: d.firmId, employeeId: d.employeeId, ppeType: d.ppeType, ppeStandard: d.ppeStandard || '', quantity: String(d.quantity), distributionDate: d.distributionDate?.split('T')[0] || '', distributedBy: d.distributedBy || '', renewalDate: d.renewalDate?.split('T')[0] || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Dağıtım</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((d: any) => d.renewalDate && new Date(d.renewalDate) < new Date()).length}</div><div className="kpi-label">Yenilenmesi Gereken</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="KKD ara..." /></div></div><div className="toolbar-right">{can('KKD_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> KKD Dağıtım Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Çalışan</th><th>Firma</th><th>KKD Türü</th><th>Standart</th><th>Adet</th><th>Dağıtım Tarihi</th><th>Yenileme</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Kayıt bulunamadı.</td></tr> :
        accessible.map((d: any) => (<tr key={d.id}><td style={{ fontWeight: 600 }}>{d.employee?.name}</td><td>{d.firm?.name}</td><td><span className="badge badge-info">{d.ppeType}</span></td><td>{d.ppeStandard || '-'}</td><td>{d.quantity}</td><td>{formatDate(d.distributionDate)}</td><td>{d.renewalDate ? (new Date(d.renewalDate) < new Date() ? <span className="badge badge-danger">{formatDate(d.renewalDate)}</span> : formatDate(d.renewalDate)) : '-'}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('KKD_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(d)}><Icon name="Edit" size={14} /></button>}
            {can('KKD_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(d.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'KKD Düzenle' : 'Yeni KKD Dağıtımı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value, employeeId: ''})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Çalışan <span className="required">*</span></label><select className={`form-select ${errors.employeeId ? 'border-red-500' : ''}`} value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}><option value="">Seçiniz...</option>{empForFirm.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">KKD Türü</label><select className="form-select" value={formData.ppeType} onChange={e => setFormData({...formData, ppeType: e.target.value})}>{ppeTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div className="form-group"><label className="form-label">CE Standart No</label><input className="form-input" value={formData.ppeStandard} onChange={e => setFormData({...formData, ppeStandard: e.target.value})} placeholder="Örn: EN 397" /></div><div className="form-group"><label className="form-label">Adet</label><input className="form-input" type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Dağıtım Tarihi</label><input className="form-input" type="date" value={formData.distributionDate} onChange={e => setFormData({...formData, distributionDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Dağıtan Kişi</label><input className="form-input" value={formData.distributedBy} onChange={e => setFormData({...formData, distributedBy: e.target.value})} /></div><div className="form-group"><label className="form-label">Yenileme Tarihi</label><input className="form-input" type="date" value={formData.renewalDate} onChange={e => setFormData({...formData, renewalDate: e.target.value})} /></div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">KKD Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu KKD kaydı silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
