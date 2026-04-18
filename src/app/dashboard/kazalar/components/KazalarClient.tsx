'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/layout/Sidebar'
import { ACCIDENT_TYPE_LABELS, SEVERITY_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN': return <span className="badge badge-danger">Açık — SGK Bildirim Bekliyor</span>
    case 'NOTIFIED': return <span className="badge badge-warning">Bildirildi</span>
    case 'CLOSED': return <span className="badge badge-success">Kapatıldı</span>
    default: return <span className="badge badge-default">{status}</span>
  }
}

const emptyForm = {
  firmId: '', injuredName: '', accidentDate: new Date().toISOString().split('T')[0],
  accidentTime: '12:00', location: '', accidentType: 'FALL', severity: 'FIRST_AID',
  bodyPart: '', description: '', rootCause: '', correctiveActions: '', status: 'OPEN'
}

export default function KazalarClient({ initialAccidents, initialFirms }: { initialAccidents: any[], initialFirms: any[] }) {
  const router = useRouter()
  const { filterByAccess, can } = useAuth()
  
  const [accidents, setAccidents] = useState<any[]>(initialAccidents)
  const [firmsOptions] = useState<any[]>(initialFirms)
  const [isLoading, setIsLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchAccidents = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/kazalar')
      if (res.ok) {
        const data = await res.json()
        setAccidents(data)
      }
    } catch (err) {} finally { setIsLoading(false) }
  }

  // RBAC: Sadece erişilebilir firmaların kazalarını göster
  const accessibleAccidents = filterByAccess(accidents, 'firmId')

  const filtered = accessibleAccidents.filter(a => {
    if (search && !a.firm?.name?.toLowerCase().includes(search.toLowerCase()) && !a.injuredName?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firmId) newErrors.firmId = 'Firma zorunludur'
    if (!formData.injuredName) newErrors.injuredName = 'Çalışan adı zorunludur'
    if (!formData.accidentDate) newErrors.accidentDate = 'Kaza tarihi zorunludur'
    if (!formData.accidentTime) newErrors.accidentTime = 'Kaza saati zorunludur'
    if (!formData.location) newErrors.location = 'Kaza yeri zorunludur'
    if (!formData.description) newErrors.description = 'Kaza açıklaması zorunludur'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      const payload = {
        firmId: formData.firmId,
        injuredName: formData.injuredName,
        accidentDate: formData.accidentDate,
        accidentTime: formData.accidentTime,
        location: formData.location,
        accidentType: formData.accidentType,
        severity: formData.severity,
        description: formData.description,
        bodyPart: formData.bodyPart,
        rootCause: formData.rootCause,
        correctiveActions: formData.correctiveActions,
        status: formData.status
      }

      const url = isEditing ? `/api/kazalar/${isEditing}` : '/api/kazalar'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setShowForm(false)
        fetchAccidents()
      } else {
        const err = await res.json()
        alert('Hata: ' + err.error)
      }
    } catch (error) {
      alert('Beklenmeyen bir hata oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/kazalar/${deleteId}`, { method: 'DELETE' })
      if (res.ok) { setDeleteId(null); fetchAccidents() }
      else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Silme sırasında hata oluştu.') }
  }

  const openNewForm = () => {
    setIsEditing(null)
    setFormData(emptyForm)
    setErrors({})
    setShowForm(true)
  }

  const openEditForm = (acc: any) => {
    setIsEditing(acc.id)
    setFormData({
      firmId: acc.firmId || '',
      injuredName: acc.injuredName || '',
      accidentDate: acc.accidentDate ? acc.accidentDate.split('T')[0] : '',
      accidentTime: acc.accidentTime ? new Date(acc.accidentTime).toISOString().substr(11, 5) : '12:00',
      location: acc.location || '',
      accidentType: acc.accidentType || 'FALL',
      severity: acc.severity || 'FIRST_AID',
      bodyPart: acc.bodyPart || '',
      description: acc.description || '',
      rootCause: acc.rootCause || '',
      correctiveActions: acc.correctiveActions || '',
      status: acc.status || 'OPEN'
    })
    setErrors({})
    setShowForm(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleAccidents.filter(a => a.status === 'OPEN').length}</div>
          <div className="kpi-label">SGK Bildirimi Bekleyen</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleAccidents.length}</div>
          <div className="kpi-label">Toplam Kaza</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Icon name="Search" size={16} />
            <input placeholder="Firma, çalışan veya kaza ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          {can('ACCIDENT_CREATE') && (
            <button className="btn btn-primary" onClick={openNewForm}>
              <Icon name="Plus" size={16} /> Kaza Bildirimi Oluştur
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Firma</th>
                <th>Kazalı</th>
                <th>Tarih</th>
                <th>Kaza Türü</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Kaza kaydı bulunamadı.</td></tr>
              ) : (
                filtered.map(acc => (
                  <tr key={acc.id}>
                    <td style={{ fontWeight: 600 }}>{acc.firm?.name || 'Bilinmiyor'}</td>
                    <td>{acc.injuredName}</td>
                    <td>{formatDate(acc.accidentDate)}</td>
                    <td><span className="badge badge-info">{ACCIDENT_TYPE_LABELS[acc.accidentType as "FALL" | "CUT" | "BURN" | "ELECTRIC_SHOCK" | "CHEMICAL_EXPOSURE" | "TRAFFIC" | "HEAVY_LIFTING" | "OTHER"] || acc.accidentType}</span></td>
                    <td>{getStatusBadge(acc.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" title="Detay" onClick={() => router.push(`/dashboard/kazalar/${acc.id}`)}>
                          <Icon name="Eye" size={14} />
                        </button>
                        {can('ACCIDENT_EDIT') && (
                          <button className="btn btn-sm btn-ghost" title="Düzenle" onClick={() => openEditForm(acc)}>
                            <Icon name="Edit" size={14} />
                          </button>
                        )}
                        {can('ACCIDENT_DELETE') && (
                          <button className="btn btn-sm btn-ghost" title="Sil" onClick={() => setDeleteId(acc.id)} style={{ color: 'var(--risk-critical)' }}>
                            <Icon name="Trash2" size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'İş Kazası Kaydını Güncelle' : 'İş Kazası Bildirimi'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning">
                <Icon name="AlertTriangle" size={18} />
                <div><strong>Yasal Uyarı:</strong> İş kazası SGK&apos;ya <strong>3 iş günü</strong> içinde bildirilmelidir. Gecikme para cezası ile sonuçlanır. (6331 Md. 14)</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Firma <span className="required">*</span></label>
                  <select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}>
                    <option value="">Seçiniz...</option>
                    {firmsOptions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  {errors.firmId && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.firmId}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Kaza Tarihi <span className="required">*</span></label>
                  <input className={`form-input ${errors.accidentDate ? 'border-red-500' : ''}`} type="date" value={formData.accidentDate} onChange={e => setFormData({...formData, accidentDate: e.target.value})} />
                  {errors.accidentDate && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.accidentDate}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Kaza Saati <span className="required">*</span></label>
                  <input className={`form-input ${errors.accidentTime ? 'border-red-500' : ''}`} type="time" value={formData.accidentTime} onChange={e => setFormData({...formData, accidentTime: e.target.value})} />
                  {errors.accidentTime && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.accidentTime}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kaza Yeri <span className="required">*</span></label>
                <input className={`form-input ${errors.location ? 'border-red-500' : ''}`} placeholder="Bölüm, kat, alan vb." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                {errors.location && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.location}</span>}
              </div>
              <div style={{ borderTop: '1px solid var(--border-glass)', margin: '20px 0', paddingTop: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Kazalı Çalışan Bilgileri</h4>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Ad Soyad <span className="required">*</span></label>
                  <input className={`form-input ${errors.injuredName ? 'border-red-500' : ''}`} value={formData.injuredName} onChange={e => setFormData({...formData, injuredName: e.target.value})} />
                  {errors.injuredName && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.injuredName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Kaza Türü <span className="required">*</span></label>
                  <select className="form-select" value={formData.accidentType} onChange={e => setFormData({...formData, accidentType: e.target.value})}>
                    {Object.entries(ACCIDENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Yaralanma Şiddeti</label>
                  <select className="form-select" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                    {Object.entries(SEVERITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Yaralanan Bölge</label>
                  <input className="form-input" placeholder="Örn: Sağ el, baş bölgesi" value={formData.bodyPart} onChange={e => setFormData({...formData, bodyPart: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kaza Tanımı <span className="required">*</span></label>
                <textarea className={`form-textarea ${errors.description ? 'border-red-500' : ''}`} placeholder="Kazanın detaylı anlatımı..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                {errors.description && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.description}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kök Neden Analizi</label>
                  <textarea className="form-textarea" rows={3} placeholder="5N1K / Balık Kılçığı yöntemi" value={formData.rootCause} onChange={e => setFormData({...formData, rootCause: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Alınması Gereken Önlemler</label>
                  <textarea className="form-textarea" rows={3} value={formData.correctiveActions} onChange={e => setFormData({...formData, correctiveActions: e.target.value})} />
                </div>
              </div>
              {isEditing && (
                <div className="form-group mt-4 p-4" style={{ backgroundColor: 'var(--bg-glass)', borderRadius: 8 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>SGK Bildirim Durumu</label>
                  <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="OPEN">Açık — SGK Bildirim Bekliyor</option>
                    <option value="NOTIFIED">Bildirildi</option>
                    <option value="CLOSED">Kapatıldı</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button>
              <button className="btn btn-danger" onClick={handleSave} disabled={isSaving}>
                <Icon name="AlertTriangle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaza Bildirimini Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header"><h3 className="modal-title">Kaza Kaydı Silme</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div>
            <div className="modal-body"><div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu kaza kaydı kalıcı olarak silinecektir.</div></div></div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button><button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Sil</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
