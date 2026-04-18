'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const riskMethods: Record<string, string> = { FINE_KINNEY: 'Fine-Kinney', MATRIX_5X5: '5×5 Matris', FMEA: 'FMEA' }
function getStatusBadge(s: string) { const m: Record<string, { cls: string; label: string }> = { DRAFT: { cls: 'badge-default', label: 'Taslak' }, PENDING_APPROVAL: { cls: 'badge-warning', label: 'Onay Bekliyor' }, APPROVED: { cls: 'badge-success', label: 'Onaylandı' }, ARCHIVED: { cls: 'badge-info', label: 'Arşivlendi' } }; const x = m[s] || m.DRAFT; return <span className={`badge ${x.cls}`}>{x.label}</span> }

const emptyForm = { firmId: '', method: 'MATRIX_5X5', validUntil: '' }

export default function RiskClient({ initialAssessments, initialFirms }: { initialAssessments: any[], initialFirms: any[] }) {
  const { filterByAccess, can, user } = useAuth()
  const [assessments, setAssessments] = useState<any[]>(initialAssessments)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/risk-degerlendirme'); if (r.ok) setAssessments(await r.json()) } catch {} }
  const accessible = filterByAccess(assessments, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.validUntil) e.validUntil = 'Geçerlilik tarihi zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/risk-degerlendirme/${isEditing}` : '/api/risk-degerlendirme'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, expertId: user?.id }) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/risk-degerlendirme/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam RD</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((a: any) => a.status === 'PENDING_APPROVAL').length}</div><div className="kpi-label">Onay Bekleyen</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((a: any) => a.status === 'APPROVED').length}</div><div className="kpi-label">Onaylanmış</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Firma veya uzman ara..." /></div></div><div className="toolbar-right">{can('RISK_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni RD Oluştur</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Firma</th><th>Yöntem</th><th>Versiyon</th><th>Uzman</th><th>Geçerlilik</th><th>Risk Sayısı</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Risk değerlendirmesi bulunamadı.</td></tr> :
        accessible.map((a: any) => (<tr key={a.id}><td style={{ fontWeight: 600 }}>{a.firm?.name}</td><td><span className="badge badge-info">{riskMethods[a.method]}</span></td><td>v{a.version}</td><td>{a.expert?.name}</td><td>{formatDate(a.validUntil)}</td><td>{a._count?.items || 0}</td><td>{getStatusBadge(a.status)}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button>
            {can('RISK_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(a.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Risk Değerlendirmesi</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Yöntem <span className="required">*</span></label><select className="form-select" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>{Object.entries(riskMethods).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Geçerlilik Tarihi <span className="required">*</span></label><input className={`form-input ${errors.validUntil ? 'border-red-500' : ''}`} type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} /></div></div>
        <div className="alert alert-info"><Icon name="Info" size={16} /><div>Risk değerlendirmesi en geç 2 yılda bir veya önemli bir değişiklikte yenilenmelidir. (6331 Md. 10)</div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Oluşturuluyor...' : 'Oluştur'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">RD Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu risk değerlendirmesi ve tüm kalemleri silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
