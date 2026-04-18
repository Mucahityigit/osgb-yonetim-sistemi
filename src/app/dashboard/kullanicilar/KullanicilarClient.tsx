'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { ROLE_LABELS } from '@/lib/constants'
import { formatDateTime } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const emptyForm = { name: '', email: '', password: '', role: 'EXPERT', certificateType: '', phone: '' }

export default function KullanicilarClient({ initialUsers }: { initialUsers: any[] }) {
  const { can } = useAuth()
  const [users, setUsers] = useState<any[]>(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchUsers = async () => {
    try { const res = await fetch('/api/kullanicilar'); if (res.ok) setUsers(await res.json()) } catch {}
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name) e.name = 'Ad zorunludur'
    if (!formData.email) e.email = 'E-posta zorunludur'
    if (!isEditing && !formData.password) e.password = 'Şifre zorunludur'
    if (formData.password && formData.password.length < 8) e.password = 'Min. 8 karakter'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    try {
      const url = isEditing ? `/api/kullanicilar/${isEditing}` : '/api/kullanicilar'
      const method = isEditing ? 'PUT' : 'POST'
      const payload: Record<string, unknown> = { name: formData.name, email: formData.email, role: formData.role, phone: formData.phone || null, certificateType: formData.certificateType || null }
      if (formData.password) payload.password = formData.password
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { setShowForm(false); setIsEditing(null); fetchUsers() }
      else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Beklenmeyen hata.') }
    finally { setIsSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/kullanicilar/${deleteId}`, { method: 'DELETE' })
      if (res.ok) { setDeleteId(null); fetchUsers() }
      else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Silme hatası.') }
  }

  const openEdit = (u: any) => {
    setIsEditing(u.id)
    setFormData({ name: u.name, email: u.email, password: '', role: u.role, certificateType: u.certificateType || '', phone: u.phone || '' })
    setErrors({}); setShowForm(true)
  }
  const openNew = () => { setIsEditing(null); setFormData(emptyForm); setErrors({}); setShowForm(true) }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        {Object.entries(ROLE_LABELS).map(([k, v]) => (
          <div key={k} className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
            <div className="kpi-value">{users.filter(u => u.role === k).length}</div>
            <div className="kpi-label">{v}</div>
          </div>
        ))}
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Kullanıcı ara..." /></div></div><div className="toolbar-right">{can('USER_CREATE') && <button className="btn btn-primary" onClick={openNew}><Icon name="Plus" size={16} /> Yeni Kullanıcı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Sertifika</th><th>Firma Sayısı</th><th>Son Giriş</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {users.map(u => (<tr key={u.id}><td style={{ fontWeight: 600 }}>{u.name}</td><td>{u.email}</td><td><span className="badge badge-info">{ROLE_LABELS[u.role]}</span></td><td>{u.certificateType ? <span className="badge badge-violet">{u.certificateType} Sınıfı</span> : '-'}</td><td>{u._count?.assignments ?? '-'}</td><td>{u.lastLogin ? formatDateTime(u.lastLogin) : '-'}</td><td>{u.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td>
          <td><div style={{ display: 'flex', gap: 4 }}>
            {can('USER_EDIT') && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(u)}><Icon name="Edit" size={14} /></button>}
            {can('USER_DELETE') && <button className="btn btn-sm btn-ghost" onClick={() => setDeleteId(u.id)} style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}
          </div></td></tr>))}
      </tbody></table></div></div>

      {showForm && (<div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><h3 className="modal-title">{isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h3><button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button></div><div className="modal-body">
        <div className="form-group"><label className="form-label">Ad Soyad <span className="required">*</span></label><input className={`form-input ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />{errors.name && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.name}</span>}</div>
        <div className="form-group"><label className="form-label">E-posta <span className="required">*</span></label><input className={`form-input ${errors.email ? 'border-red-500' : ''}`} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />{errors.email && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.email}</span>}</div>
        <div className="form-row"><div className="form-group"><label className="form-label">Rol <span className="required">*</span></label><select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>{Object.entries(ROLE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="form-group"><label className="form-label">Sertifika Sınıfı</label><select className="form-select" value={formData.certificateType} onChange={e => setFormData({...formData, certificateType: e.target.value})}><option value="">Yok</option><option value="A">A Sınıfı</option><option value="B">B Sınıfı</option><option value="C">C Sınıfı</option></select></div></div>
        <div className="form-group"><label className="form-label">Şifre {!isEditing && <span className="required">*</span>}</label><input className={`form-input ${errors.password ? 'border-red-500' : ''}`} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={isEditing ? 'Değiştirmek için yeni şifre girin' : ''} />{errors.password && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.password}</span>}{!errors.password && <span className="form-hint">Min. 8 karakter</span>}</div>
        <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
      </div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button><button className="btn btn-primary" onClick={handleSave} disabled={isSaving}><Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button></div></div></div>)}

      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}><div className="modal-header"><h3 className="modal-title">Kullanıcı Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div><div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu kullanıcı kalıcı olarak silinecektir.</div></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div></div></div>)}
    </div>
  )
}
