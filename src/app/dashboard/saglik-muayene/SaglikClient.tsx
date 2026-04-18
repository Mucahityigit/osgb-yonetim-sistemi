'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const examTypeLabels: Record<string, string> = { ENTRY: 'İşe Giriş', PERIODIC: 'Periyodik', REASSIGNMENT: 'İşyeri Değişiklik', EXIT: 'Ayrılış', SPECIAL: 'Özel' }
const resultLabels: Record<string, { label: string; cls: string }> = { FIT: { label: 'Çalışabilir', cls: 'badge-success' }, UNFIT: { label: 'Çalışamaz', cls: 'badge-danger' }, CONDITIONAL: { label: 'Şartlı', cls: 'badge-warning' } }
const emptyForm = { firmId: '', employeeId: '', examDate: '', examType: 'PERIODIC', result: 'FIT', conditions: '', nextExamDate: '' }

export default function SaglikClient({ initialExams, initialFirms, initialEmployees }: { initialExams: any[], initialFirms: any[], initialEmployees: any[] }) {
  const { filterByAccess, can, user } = useAuth()
  const [exams, setExams] = useState<any[]>(initialExams)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchData = async () => { try { const r = await fetch('/api/saglik-muayene'); if (r.ok) setExams(await r.json()) } catch {} }
  const accessible = filterByAccess(exams, 'firmId')
  const empForFirm = formData.firmId ? initialEmployees.filter((e: any) => e.firmId === formData.firmId) : initialEmployees

  const validate = () => { const e: Record<string, string> = {}; if (!formData.firmId) e.firmId = 'Firma zorunlu'; if (!formData.employeeId) e.employeeId = 'Çalışan zorunlu'; if (!formData.examDate) e.examDate = 'Tarih zorunlu'; setErrors(e); return Object.keys(e).length === 0 }

  const handleSave = async () => {
    if (!validate()) return; setIsSaving(true)
    try {
      const url = isEditing ? `/api/saglik-muayene/${isEditing}` : '/api/saglik-muayene'
      const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, doctorId: user?.id }) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchData() } else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Hata.') } finally { setIsSaving(false) }
  }

  const handleDelete = async () => { if (!deleteId) return; try { const r = await fetch(`/api/saglik-muayene/${deleteId}`, { method: 'DELETE' }); if (r.ok) { setDeleteId(null); fetchData() } } catch { alert('Hata') } }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{accessible.length}</div><div className="kpi-label">Toplam Muayene</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((e: any) => e.result === 'CONDITIONAL').length}</div><div className="kpi-label">Şartlı</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{accessible.filter((e: any) => e.result === 'UNFIT').length}</div><div className="kpi-label">Çalışamaz</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Çalışan veya firma ara..." /></div></div><div className="toolbar-right">{can('HEALTH_EXAM_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Muayene</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Çalışan</th><th>Firma</th><th>Tarih</th><th>Muayene Türü</th><th>Hekim</th><th>Sonuç</th><th>Sonraki Muayene</th><th>İşlem</th></tr></thead><tbody>
        {accessible.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Muayene bulunamadı.</td></tr> :
        accessible.map((e: any) => (<tr key={e.id}><td style={{ fontWeight: 600 }}>{e.employee?.name}</td><td>{e.firm?.name}</td><td>{formatDate(e.examDate)}</td><td><span className="badge badge-info">{examTypeLabels[e.examType]}</span></td><td>{e.doctor?.name}</td><td><span className={`badge ${resultLabels[e.result]?.cls}`}>{resultLabels[e.result]?.label}</span></td><td>{e.nextExamDate ? formatDate(e.nextExamDate) : '-'}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('HEALTH_EXAM_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(e.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">Yeni Sağlık Muayenesi</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-row"><div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value, employeeId: ''})}><option value="">Seçiniz...</option>{initialFirms.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div><div className="form-group"><label className="form-label">Çalışan <span className="required">*</span></label><select className={`form-select ${errors.employeeId ? 'border-red-500' : ''}`} value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}><option value="">Seçiniz...</option>{empForFirm.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Muayene Tarihi <span className="required">*</span></label><input className={`form-input ${errors.examDate ? 'border-red-500' : ''}`} type="date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} /></div><div className="form-group"><label className="form-label">Muayene Türü</label><select className="form-select" value={formData.examType} onChange={e => setFormData({...formData, examType: e.target.value})}>{Object.entries(examTypeLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Sonuç</label><select className="form-select" value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})}>{Object.entries(resultLabels).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}</select></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Koşullar/Notlar</label><textarea className="form-textarea" rows={2} value={formData.conditions} onChange={e => setFormData({...formData, conditions: e.target.value})} /></div><div className="form-group"><label className="form-label">Sonraki Muayene Tarihi</label><input className="form-input" type="date" value={formData.nextExamDate} onChange={e => setFormData({...formData, nextExamDate: e.target.value})} /></div></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Muayene Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu muayene kaydı kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
