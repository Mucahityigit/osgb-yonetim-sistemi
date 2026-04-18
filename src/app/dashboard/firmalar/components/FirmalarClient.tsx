'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/layout/Sidebar'
import { RISK_CLASS_LABELS, NACE_CODES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

function getStatusBadge(status: string) {
  switch (status) {
    case 'SYNCED': return <span className="badge badge-success">Senkronize</span>
    case 'PENDING': return <span className="badge badge-warning">Onay Bekliyor</span>
    case 'BLOCKED': return <span className="badge badge-danger">Bloke</span>
    case 'NOT_LINKED': return <span className="badge badge-default">Bağlı Değil</span>
    default: return <span className="badge badge-default">{status}</span>
  }
}

function getRiskBadge(rc: string) {
  switch (rc) {
    case 'C': return <span className="badge badge-danger">Çok Tehlikeli</span>
    case 'B': return <span className="badge badge-warning">Tehlikeli</span>
    case 'A': return <span className="badge badge-success">Az Tehlikeli</span>
    default: return <span className="badge badge-default">{rc}</span>
  }
}

const emptyForm = {
  name: '', taxNumber: '', sgkNo: '', naceCode: '', address: '', city: '', district: '',
  employeeCount: '', femaleEmployeeCount: '', youngEmployeeCount: '',
  contactName: '', contactPhone: '', contactEmail: '',
}

export default function FirmalarClient({ initialFirms }: { initialFirms: any[] }) {
  const router = useRouter()
  const { filterByAccess, can } = useAuth()
  
  const [firms, setFirms] = useState<any[]>(initialFirms)
  const [isLoading, setIsLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchFirms = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/firmalar')
      if (res.ok) {
        const data = await res.json()
        setFirms(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // RBAC: Firma verilerini role göre filtrele
  const accessibleFirms = filterByAccess(firms, 'id')

  const filtered = accessibleFirms.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.taxNumber.includes(search)) return false
    if (riskFilter && f.riskClass !== riskFilter) return false
    return true
  })

  const selectedNace = NACE_CODES.find(n => n.code === formData.naceCode)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Firma Adı zorunludur'
    if (!formData.taxNumber) {
      newErrors.taxNumber = 'VKN zorunludur'
    } else if (formData.taxNumber.length !== 10) {
      newErrors.taxNumber = 'VKN 10 haneli olmalıdır'
    }
    if (!formData.sgkNo) newErrors.sgkNo = 'SGK No zorunludur'
    if (!formData.naceCode) newErrors.naceCode = 'NACE kodu seçilmelidir'
    if (!formData.address) newErrors.address = 'Adres zorunludur'
    if (!formData.city) newErrors.city = 'İl zorunludur'
    if (!formData.employeeCount || parseInt(formData.employeeCount) < 1) newErrors.employeeCount = 'Çalışan sayısı en az 1 olmalıdır'
    if (!formData.contactName) newErrors.contactName = 'Yetkili adı zorunludur'
    if (!formData.contactPhone) newErrors.contactPhone = 'Telefon zorunludur'
    if (!formData.contactEmail) newErrors.contactEmail = 'E-posta zorunludur'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        riskClass: selectedNace?.riskClass || 'B'
      }

      const url = isEditing ? `/api/firmalar/${isEditing}` : '/api/firmalar'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setShowForm(false)
        fetchFirms()
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
      const res = await fetch(`/api/firmalar/${deleteId}`, { method: 'DELETE' })
      if (res.ok) { setDeleteId(null); fetchFirms() }
      else { const err = await res.json(); alert('Hata: ' + err.error) }
    } catch { alert('Silme sırasında hata oluştu.') }
  }

  const openNewForm = () => {
    setIsEditing(null)
    setFormData(emptyForm)
    setErrors({})
    setShowForm(true)
  }

  const openEditForm = (firm: any) => {
    setIsEditing(firm.id)
    setFormData({
      name: firm.name || '',
      taxNumber: firm.taxNumber || '',
      sgkNo: firm.sgkNo || '',
      naceCode: firm.naceCode || '',
      address: firm.address || '',
      city: firm.city || '',
      district: firm.district || '',
      employeeCount: String(firm.employeeCount || ''),
      femaleEmployeeCount: String(firm.femaleEmployeeCount || ''),
      youngEmployeeCount: String(firm.youngEmployeeCount || ''),
      contactName: firm.contactName || '',
      contactPhone: firm.contactPhone || '',
      contactEmail: firm.contactEmail || '',
    })
    setErrors({})
    setShowForm(true)
  }

  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleFirms.filter(f => f.isActive).length}</div>
          <div className="kpi-label">Aktif Firma</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleFirms.filter(f => f.riskClass === 'C').length}</div>
          <div className="kpi-label">Çok Tehlikeli</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-medium)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleFirms.filter(f => f.riskClass === 'B').length}</div>
          <div className="kpi-label">Tehlikeli</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}>
          <div className="kpi-value">{accessibleFirms.filter(f => f.riskClass === 'A').length}</div>
          <div className="kpi-label">Az Tehlikeli</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Icon name="Search" size={16} />
            <input
              placeholder="Firma adı veya VKN ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 180 }} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="">Tüm Tehlike Sınıfları</option>
            <option value="A">Az Tehlikeli (A)</option>
            <option value="B">Tehlikeli (B)</option>
            <option value="C">Çok Tehlikeli (C)</option>
          </select>
        </div>
        <div className="toolbar-right">
          {can('FIRM_CREATE') && (
            <button className="btn btn-primary" onClick={openNewForm}>
              <Icon name="Plus" size={16} /> Yeni Kayıt
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Firma Adı</th>
                <th>VKN</th>
                <th>Tehlike Sınıfı</th>
                <th>Çalışan</th>
                <th>İl</th>
                <th>İSG-KATİP</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Firma bulunamadı.</td></tr>
              ) : (
                filtered.map((firm) => (
                  <tr key={firm.id}>
                    <td style={{ fontWeight: 600 }}>{firm.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{firm.taxNumber}</td>
                    <td>{getRiskBadge(firm.riskClass)}</td>
                    <td>{firm.employeeCount}</td>
                    <td>{firm.city}</td>
                    <td>{getStatusBadge(firm.isgKatipStatus)}</td>
                    <td>{formatDate(firm.createdAt || firm.contractEnd)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" title="Detay" onClick={() => router.push(`/dashboard/firmalar/${firm.id}`)}>
                          <Icon name="Eye" size={14} />
                        </button>
                        {can('FIRM_EDIT') && (
                          <button className="btn btn-sm btn-ghost" title="Düzenle" onClick={() => openEditForm(firm)}>
                            <Icon name="Edit" size={14} />
                          </button>
                        )}
                        {can('FIRM_DELETE') && (
                          <button className="btn btn-sm btn-ghost" title="Sil" onClick={() => setDeleteId(firm.id)} style={{ color: 'var(--risk-critical)' }}>
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

      {/* Modal: Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'Firma Bilgilerini Güncelle' : 'Yeni Firma Kaydı'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Firma Adı <span className="required">*</span></label>
                  <input className={`form-input ${errors.name ? 'border-red-500' : ''}`} placeholder="Resmi ünvan" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  {errors.name && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Vergi No (VKN) <span className="required">*</span></label>
                  <input className={`form-input ${errors.taxNumber ? 'border-red-500' : ''}`} placeholder="10 haneli" maxLength={10} value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} />
                  {errors.taxNumber 
                    ? <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.taxNumber}</span>
                    : <span className="form-hint">10 haneli numerik</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SGK İşyeri Sicil No <span className="required">*</span></label>
                  <input className={`form-input ${errors.sgkNo ? 'border-red-500' : ''}`} placeholder="SGK sicil numarası" value={formData.sgkNo} onChange={(e) => setFormData({ ...formData, sgkNo: e.target.value })} />
                  {errors.sgkNo && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.sgkNo}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">NACE/Sektör Kodu <span className="required">*</span></label>
                  <select className={`form-select ${errors.naceCode ? 'border-red-500' : ''}`} value={formData.naceCode} onChange={(e) => setFormData({ ...formData, naceCode: e.target.value })}>
                    <option value="">Seçiniz...</option>
                    {NACE_CODES.map(n => (
                      <option key={n.code} value={n.code}>{n.code} — {n.description}</option>
                    ))}
                  </select>
                  {errors.naceCode && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.naceCode}</span>}
                  {selectedNace && !errors.naceCode && (
                    <span className="form-hint">Tehlike Sınıfı: <strong>{RISK_CLASS_LABELS[selectedNace.riskClass as "A" | "B" | "C"]}</strong> (otomatik)</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Adres <span className="required">*</span></label>
                  <input className={`form-input ${errors.address ? 'border-red-500' : ''}`} placeholder="Tam adres" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  {errors.address && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.address}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">İl <span className="required">*</span></label>
                  <input className={`form-input ${errors.city ? 'border-red-500' : ''}`} placeholder="İl" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  {errors.city && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">İlçe</label>
                  <input className="form-input" placeholder="İlçe" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Çalışan Sayısı <span className="required">*</span></label>
                  <input className={`form-input ${errors.employeeCount ? 'border-red-500' : ''}`} type="number" min="1" value={formData.employeeCount} onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })} />
                  {errors.employeeCount && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.employeeCount}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Kadın Çalışan</label>
                  <input className="form-input" type="number" min="0" value={formData.femaleEmployeeCount} onChange={(e) => setFormData({ ...formData, femaleEmployeeCount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">18 Yaş Altı</label>
                  <input className="form-input" type="number" min="0" value={formData.youngEmployeeCount} onChange={(e) => setFormData({ ...formData, youngEmployeeCount: e.target.value })} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', margin: '20px 0', paddingTop: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>İletişim Bilgileri</h4>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Yetkili Kişi Adı <span className="required">*</span></label>
                  <input className={`form-input ${errors.contactName ? 'border-red-500' : ''}`} placeholder="Ad Soyad" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
                  {errors.contactName && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.contactName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon <span className="required">*</span></label>
                  <input className={`form-input ${errors.contactPhone ? 'border-red-500' : ''}`} placeholder="05XX XXX XX XX" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                  {errors.contactPhone && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.contactPhone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">E-posta <span className="required">*</span></label>
                  <input className={`form-input ${errors.contactEmail ? 'border-red-500' : ''}`} type="email" placeholder="yetkili@firma.com" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                  {errors.contactEmail && <span className="form-hint" style={{ color: 'var(--risk-critical)' }}>{errors.contactEmail}</span>}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={isSaving}>İptal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                <Icon name="CheckCircle" size={16} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header"><h3 className="modal-title">Firma Silme Onayı</h3><button className="modal-close" onClick={() => setDeleteId(null)}><Icon name="X" size={20} /></button></div>
            <div className="modal-body">
              <div className="alert alert-warning"><Icon name="AlertTriangle" size={18} /><div>Bu firma ve ilişkili tüm verileri kalıcı olarak silinecektir. Bu işlem geri alınamaz!</div></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>İptal</button>
              <button className="btn btn-danger" onClick={handleDelete}><Icon name="Trash2" size={16} /> Firmayı Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
