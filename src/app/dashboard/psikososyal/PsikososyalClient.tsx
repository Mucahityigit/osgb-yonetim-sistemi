'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const riskLabels: Record<string, { label: string; cls: string }> = { LOW: { label: 'Düşük', cls: 'badge-success' }, MEDIUM: { label: 'Orta', cls: 'badge-warning' }, HIGH: { label: 'Yüksek', cls: 'badge-danger' }, VERY_HIGH: { label: 'Çok Yüksek', cls: 'badge-danger' } }
const emptyForm = { firmId: '', surveyDate: '', participantCount: '', stressScore: '', burnoutScore: '', mobbingScore: '', overallRisk: 'LOW', actionPlan: '' }

export default function PsikososyalClient({ initialSurveys, initialFirms }: { initialSurveys: any[], initialFirms: any[] }) {
  const { filterByAccess, can } = useAuth()
  const [surveys, setSurveys] = useState<any[]>(initialSurveys)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/psikososyal'); if (r.ok) setSurveys(await r.json()) } catch {} }
  const accessible = filterByAccess(surveys, 'firmId')

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.surveyDate) e.surveyDate = 'Tarih zorunlu'; if (!formData.participantCount) e.participantCount = 'Katılımcı sayısı zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/psikososyal/${isEditing}` : '/api/psikososyal'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/psikososyal/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openEdit = (s: any) => { setIsEditing(s.id); setFormData({ firmId: s.firmId, surveyDate: s.surveyDate?.split('T')[0] || '', participantCount: String(s.participantCount), stressScore: String(s.stressScore || ''), burnoutScore: String(s.burnoutScore || ''), mobbingScore: String(s.mobbingScore || ''), overallRisk: s.overallRisk || 'LOW', actionPlan: s.actionPlan || '' }); setErrors({}); setShowForm(true) }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Anket</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((s: any) => s.overallRisk === 'HIGH' || s.overallRisk === 'VERY_HIGH').length}</div><div className="kpi-label">Yüksek Risk</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Ara..." /></div></div><div className="toolbar-right">{can('PSYCHO_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Anket</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Tarih</th><th>Katılımcı</th><th>Stres</th><th>Tükenmişlik</th><th>Mobbing</th><th>Risk</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Anket bulunamadı.</td></tr> :
        accessible.map((s: any) => (<tr key={s.id}><td>{formatDate(s.surveyDate)}</td><td>{s.participantCount}</td><td>{s.stressScore != null ? `${s.stressScore}/10` : '-'}</td><td>{s.burnoutScore != null ? `${s.burnoutScore}/10` : '-'}</td><td>{s.mobbingScore != null ? `${s.mobbingScore}/10` : '-'}</td><td><span className={`badge ${riskLabels[s.overallRisk]?.cls}`}>{riskLabels[s.overallRisk]?.label}</span></td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('PSYCHO_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(s)}><Icon name="Edit" size={14} /></button>}
            {can('PSYCHO_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(s.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Anket Düzenle' : 'Yeni Psikososyal Anket'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Anket Tarihi <span className="required">*</span></label><input className={`form-input ${errors.surveyDate ? 'border-red-500' : ''}`} type="date" value={formData.surveyDate} onChange={e => setFormData({...formData, surveyDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Katılımcı Sayısı <span className="required">*</span></label><input className={`form-input ${errors.participantCount ? 'border-red-500' : ''}`} type="number" value={formData.participantCount} onChange={e => setFormData({...formData, participantCount: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Stres Puanı (0-10)</label><input className="form-input" type="number" min="0" max="10" step="0.1" value={formData.stressScore} onChange={e => setFormData({...formData, stressScore: e.target.value})} /></div><div className="form-group"><label className="form-label">Tükenmişlik (0-10)</label><input className="form-input" type="number" min="0" max="10" step="0.1" value={formData.burnoutScore} onChange={e => setFormData({...formData, burnoutScore: e.target.value})} /></div><div className="form-group"><label className="form-label">Mobbing (0-10)</label><input className="form-input" type="number" min="0" max="10" step="0.1" value={formData.mobbingScore} onChange={e => setFormData({...formData, mobbingScore: e.target.value})} /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Genel Risk Seviyesi</label><select className="form-select" value={formData.overallRisk} onChange={e => setFormData({...formData, overallRisk: e.target.value})}>{Object.entries(riskLabels).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}</select></div></div>
        <div className="form-group"><label className="form-label">Aksiyon Planı</label><textarea className="form-textarea" rows={3} value={formData.actionPlan} onChange={e => setFormData({...formData, actionPlan: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Anket Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu anket kaydı silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
