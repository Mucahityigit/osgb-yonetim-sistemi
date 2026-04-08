'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/layout/Sidebar'
import { VISIT_TYPE_LABELS } from '@/lib/constants'
import { formatDate, formatDuration } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

function getCriticalityBadge(level: string) {
  const maps: Record<string, { cls: string; label: string }> = {
    LOW: { cls: 'badge-success', label: 'Düşük' },
    MEDIUM: { cls: 'badge-warning', label: 'Orta' },
    HIGH: { cls: 'badge-orange', label: 'Yüksek' },
    CRITICAL: { cls: 'badge-danger', label: 'Kritik' },
  }
  const m = maps[level] || maps.LOW
  return <span className={`badge ${m.cls}`}>{m.label}</span>
}

const emptyForm = {
  firmId: '', visitType: 'PERIODIC_CONTROL', visitDate: new Date().toISOString().split('T')[0],
  startTime: '09:00', endTime: '12:00', description: '', findings: '', actions: ''
}

export default function ZiyaretlerPage() {
  const router = useRouter()
  const { user, filterByAccess, can } = useAuth()
  
  const [visits, setVisits] = useState<any[]>([])
  const [firmsOptions, setFirmsOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchVisits()
    fetchFirms()
  }, [])

  const fetchVisits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ziyaretler')
      if (res.ok) {
        const data = await res.json()
        setVisits(data)
      }
    } catch (err) { } finally { setIsLoading(false) }
  }

  const fetchFirms = async () => {
    try {
      const res = await fetch('/api/firmalar')
      if (res.ok) {
        const data = await res.json()
        setFirmsOptions(data)
      }
    } catch (err) {}
  }

  // RBAC: Ziyaretleri filtrele (Sadece izinli firmaların ziyaretleri)
  const accessibleVisits = filterByAccess(visits, 'firmId')

  const filtered = accessibleVisits.filter(v => {
    if (search && !v.firm?.name.toLowerCase().includes(search.toLowerCase()) && !v.expert?.name.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter && v.visitType !== typeFilter) return false
    return true
  })

  // Hesaplama: Süre
  function calculateDuration(start: string, end: string) {
    if (!start || !end) return 0
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)
    return (h2 * 60 + m2) - (h1 * 60 + m1)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firmId) newErrors.firmId = 'Firma seçimi zorunludur'
    if (!formData.visitDate) newErrors.visitDate = 'Ziyaret tarihi zorunludur'
    if (!formData.startTime) newErrors.startTime = 'Başlangıç saati zorunludur'
    if (!formData.endTime) newErrors.endTime = 'Bitiş saati zorunludur'
    if (calculateDuration(formData.startTime, formData.endTime) <= 0) {
      newErrors.endTime = 'Bitiş saati başlangıçtan sonra olmalıdır'
    }
    if (!formData.description) newErrors.description = 'Yapılan işlemler zorunludur'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      const duration = calculateDuration(formData.startTime, formData.endTime)
      const payload = {
        ...formData,
        expertId: isEditing ? undefined : user?.id, // Yalnızca oluştururken atarız
        durationMinutes: duration
      }

      const url = isEditing ? `/api/ziyaretler/${isEditing}` : '/api/ziyaretler'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setShowForm(false)
        fetchVisits()
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

  const openNewForm = () => {
    setIsEditing(null)
    setFormData(emptyForm)
    setErrors({})
    setShowForm(true)
  }

  const openEditForm = (visit: any) => {
    setIsEditing(visit.id)
    setFormData({
      firmId: visit.firmId || '',
      visitType: visit.visitType || 'PERIODIC_CONTROL',
      visitDate: visit.visitDate ? visit.visitDate.split('T')[0] : '',
      startTime: visit.startTime ? new Date(visit.startTime).toISOString().substr(11, 5) : '09:00',
      endTime: visit.endTime ? new Date(visit.endTime).toISOString().substr(11, 5) : '17:00',
      description: visit.description || '',
      findings: visit.findings || '',
      actions: visit.actions || ''
    })
    setErrors({})
    setShowForm(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleVisits.length}</div>
          <div className="kpi-label">Toplam Ziyaret</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
          <div className="kpi-value">{formatDuration(accessibleVisits.reduce((s, v) => s + (v.durationMinutes || 0), 0))}</div>
          <div className="kpi-label">Toplam Süre</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Icon name="Search" size={16} />
            <input placeholder="Firma veya uzman ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 200 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Tüm Ziyaret Türleri</option>
            {Object.entries(VISIT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="toolbar-right">
          {can('VISIT_CREATE') && (
            <button className="btn btn-primary" onClick={openNewForm}>
              <Icon name="Plus" size={16} /> Yeni Ziyaret Başlat
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
                <th>Uzman</th>
                <th>Tarih</th>
                <th>Süre</th>
                <th>Tür</th>
                <th>Bulgular</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Ziyaret kaydı bulunamadı.</td></tr>
              ) : (
                filtered.map((visit) => (
                  <tr key={visit.id}>
                    <td style={{ fontWeight: 600 }}>{visit.firm?.name || 'Bilinmiyor'}</td>
                    <td>{visit.expert?.name || '-'}</td>
                    <td>{formatDate(visit.visitDate)}</td>
                    <td>{formatDuration(visit.durationMinutes)}</td>
                    <td><span className="badge badge-info">{VISIT_TYPE_LABELS[visit.visitType]}</span></td>
                    <td style={{ maxWidth: 250, fontSize: 12.5 }} className="truncate">{visit.findings || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" title="Detay" onClick={() => router.push(`/dashboard/ziyaretler/${visit.id}`)}>
                          <Icon name="Eye" size={14} />
                        </button>
                        {can('VISIT_EDIT') && (
                          <button className="btn btn-sm btn-ghost" title="Düzenle" onClick={() => openEditForm(visit)}>
                            <Icon name="Edit" size={14} />
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
              <h3 className="modal-title">{isEditing ? 'Saha Ziyareti Güncelle' : 'Yeni Saha Ziyareti Kaydı'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Firma <span className="required">*</span></label>
                  <select className={`form-select ${errors.firmId ? 'border-red-500' : ''}`} value={formData.firmId} onChange={e => setFormData({...formData, firmId: e.target.value})}>
                    <option value="">Firma seçiniz...</option>
                    {firmsOptions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  {errors.firmId && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.firmId}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Ziyaret Türü <span className="required">*</span></label>
                  <select className="form-select" value={formData.visitType} onChange={e => setFormData({...formData, visitType: e.target.value})}>
                    {Object.entries(VISIT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ziyaret Tarihi <span className="required">*</span></label>
                  <input className={`form-input ${errors.visitDate ? 'border-red-500' : ''}`} type="date" value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})} />
                  {errors.visitDate && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.visitDate}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Başlangıç Saati <span className="required">*</span></label>
                  <input className={`form-input ${errors.startTime ? 'border-red-500' : ''}`} type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                  {errors.startTime && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.startTime}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Bitiş Saati <span className="required">*</span></label>
                  <input className={`form-input ${errors.endTime ? 'border-red-500' : ''}`} type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                  {errors.endTime && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.endTime}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Yapılan İş/İşlemler <span className="required">*</span></label>
                <textarea className={`form-textarea ${errors.description ? 'border-red-500' : ''}`} placeholder="Detaylı açıklama yazınız..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                {errors.description && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.description}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Tespit Edilen Eksiklikler / Uygunsuzluklar</label>
                <textarea className="form-textarea" placeholder="Bulgular..." rows={3} value={formData.findings} onChange={e => setFormData({...formData, findings: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Verilen Öneri ve Düzeltici Faaliyetler</label>
                <textarea className="form-textarea" placeholder="Aksiyonlar..." rows={3} value={formData.actions} onChange={e => setFormData({...formData, actions: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                <Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Ziyareti Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
