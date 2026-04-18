'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const statusLabels: Record<string, { label: string; cls: string }> = { PENDING: { label: 'Bekliyor', cls: 'badge-warning' }, PAID: { label: 'Ödendi', cls: 'badge-success' }, OVERDUE: { label: 'Gecikmiş', cls: 'badge-danger' }, CANCELLED: { label: 'İptal', cls: 'badge-default' } }
const emptyForm = { firmId: '', invoiceNumber: '', invoiceDate: '', dueDate: '', amount: '', description: '' }

export default function FaturalarClient({ initialInvoices, initialFirms }: { initialInvoices: any[], initialFirms: any[] }) {
  const { can } = useAuth()
  const [invoices, setInvoices] = useState<any[]>(initialInvoices)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/faturalar'); if (r.ok) setInvoices(await r.json()) } catch {} }

  const totalPending = invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.invoiceNumber) e.invoiceNumber = 'Fatura no zorunlu'; if (!formData.invoiceDate) e.invoiceDate = 'Tarih zorunlu'; if (!formData.amount) e.amount = 'Tutar zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/faturalar/${isEditing}` : '/api/faturalar'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/faturalar/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{invoices.length}</div><div className="kpi-label">Toplam Fatura</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(totalPending)}</div><div className="kpi-label">Bekleyen Tahsilat</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(totalPaid)}</div><div className="kpi-label">Tahsil Edilen</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Fatura no veya firma ara..." /></div></div><div className="toolbar-right">{can('INVOICE_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Fatura</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Fatura No</th><th>Firma</th><th>Tarih</th><th>Vade</th><th>Tutar</th><th>KDV</th><th>Toplam</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {invoices.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Fatura bulunamadı.</td></tr> :
        invoices.map((i: any) => (<tr key={i.id}><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{i.invoiceNumber}</td><td>{i.firm?.name}</td><td>{formatDate(i.invoiceDate)}</td><td>{formatDate(i.dueDate)}</td><td>{formatCurrency(i.amount)}</td><td>{formatCurrency(i.taxAmount)}</td><td style={{ fontWeight: 600 }}>{formatCurrency(i.totalAmount)}</td><td><span className={`badge ${statusLabels[i.status]?.cls}`}>{statusLabels[i.status]?.label}</span></td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('INVOICE_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(i.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Fatura</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Fatura No <span className="required">*</span></label><input className={`form-input ${errors.invoiceNumber ? 'border-red-500' : ''}`} value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Fatura Tarihi <span className="required">*</span></label><input className={`form-input ${errors.invoiceDate ? 'border-red-500' : ''}`} type="date" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Vade Tarihi</label><input className="form-input" type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Tutar (₺) <span className="required">*</span></label><input className={`form-input ${errors.amount ? 'border-red-500' : ''}`} type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div></div>
        <div className="form-group"><label className="form-label">Açıklama</label><input className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Fatura Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu fatura kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
