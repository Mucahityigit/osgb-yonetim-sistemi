'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const emptyForm = { firmId: '', contractType: 'İSG Hizmet Sözleşmesi', startDate: '', endDate: '', monthlyFee: '', paymentTerms: '', isgKatipRef: '' }

export default function SozlesmelerClient({ initialContracts, initialFirms }: { initialContracts: any[], initialFirms: any[] }) {
  const { can, isAdmin, filterByAccess } = useAuth()
  const [contracts, setContracts] = useState<any[]>(initialContracts)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/sozlesmeler'); if (r.ok) setContracts(await r.json()) } catch {} }
  const accessible = isAdmin ? contracts : filterByAccess(contracts, 'firmId')
  const activeCount = accessible.filter(c => c.isActive).length
  const totalRevenue = accessible.filter(c => c.isActive).reduce((s: number, c: any) => s + (c.monthlyFee || 0), 0)

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.startDate) e.startDate = 'Başlangıç zorunlu'; if (!formData.endDate) e.endDate = 'Bitiş zorunlu'; if (!formData.monthlyFee) e.monthlyFee = 'Ücret zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/sozlesmeler/${isEditing}` : '/api/sozlesmeler'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/sozlesmeler/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }

  const openEdit = (c: any) => { setIsEditing(c.id); setFormData({ firmId: c.firmId, contractType: c.contractType, startDate: c.startDate?.split('T')[0] || '', endDate: c.endDate?.split('T')[0] || '', monthlyFee: String(c.monthlyFee), paymentTerms: c.paymentTerms || '', isgKatipRef: c.isgKatipRef || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{activeCount}</div><div className="kpi-label">Aktif Sözleşme</div></div>
        {isAdmin && <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(totalRevenue)}</div><div className="kpi-label">Aylık Toplam Gelir</div></div>}
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Sözleşme ara..." /></div></div><div className="toolbar-right">{can('CONTRACT_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Sözleşme</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Sözleşme Türü</th><th>Başlangıç</th><th>Bitiş</th>{isAdmin && <th>Aylık Ücret</th>}<th>İSG-KATİP Ref</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Sözleşme bulunamadı.</td></tr> :
        accessible.map(c => (<tr key={c.id}><td style={{ fontWeight: 600 }}>{c.firm?.name}</td><td>{c.contractType}</td><td>{formatDate(c.startDate)}</td><td>{formatDate(c.endDate)}</td>{isAdmin && <td style={{ fontWeight: 600 }}>{formatCurrency(c.monthlyFee)}</td>}<td>{c.isgKatipRef || <span className="badge badge-warning">Bağlı Değil</span>}</td><td>{c.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('CONTRACT_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}><Icon name="Edit" size={14} /></button>}
            {can('CONTRACT_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(c.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Sözleşme Düzenle' : 'Yeni Sözleşme'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Sözleşme Türü</label><select className="form-select" value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})}><option>İSG Hizmet Sözleşmesi</option><option>İSG + Hekim Sözleşmesi</option><option>Tam Paket</option></select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Başlangıç <span className="required">*</span></label><input className={`form-input ${errors.startDate ? 'border-red-500' : ''}`} type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Bitiş <span className="required">*</span></label><input className={`form-input ${errors.endDate ? 'border-red-500' : ''}`} type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Aylık Ücret (₺) <span className="required">*</span></label><input className={`form-input ${errors.monthlyFee ? 'border-red-500' : ''}`} type="number" value={formData.monthlyFee} onChange={e => setFormData({...formData, monthlyFee: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Ödeme Koşulları</label><input className="form-input" value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} placeholder="Örn: 15 günlük vade" /></div><div className="form-group"><label className="form-label">İSG-KATİP Referans</label><input className="form-input" value={formData.isgKatipRef} onChange={e => setFormData({...formData, isgKatipRef: e.target.value})} /></div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Sözleşme Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu sözleşme kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
