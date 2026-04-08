'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { DEMO_EMPLOYMENT_CONTRACTS } from '@/lib/authorization'

// OSGB-Firma Hizmet Sözleşmeleri (Admin ve ilgili müşteri görür)
const mockServiceContracts = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat A.Ş.', type: 'İSG Hizmet Sözleşmesi', start: '2024-01-01', end: '2025-12-31', fee: 8500, isActive: true, isgKatipRef: 'ISG-2024-A001' },
  { id: '2', firmId: '2', firm: 'XYZ Metal Sanayi', type: 'İSG Hizmet Sözleşmesi', start: '2024-06-01', end: '2025-08-15', fee: 6200, isActive: true, isgKatipRef: 'ISG-2024-A002' },
  { id: '3', firmId: '3', firm: 'Mega Tekstil Ltd.', type: 'İSG + Hekim Sözleşmesi', start: '2024-03-01', end: '2025-04-20', fee: 7800, isActive: true, isgKatipRef: 'ISG-2024-A003' },
  { id: '4', firmId: '5', firm: 'Star Kimya A.Ş.', type: 'İSG Hizmet Sözleşmesi', start: '2024-07-01', end: '2025-06-30', fee: 12000, isActive: true, isgKatipRef: '' },
  { id: '5', firmId: '7', firm: 'Güven Gıda San.', type: 'İSG Hizmet Sözleşmesi', start: '2023-03-01', end: '2025-02-28', fee: 5500, isActive: false, isgKatipRef: 'ISG-2023-A010' },
]

export default function SozlesmelerPage() {
  const { user, isAdmin, isClient, can, filterByAccess } = useAuth()
  const [showForm, setShowForm] = useState(false)

  // ===== ROL BAZLI SÖZLEŞME GÖRÜNTÜLEMEsi =====
  // ADMIN: Tüm hizmet sözleşmelerini görür
  // CLIENT: Sadece kendi firmasının hizmet sözleşmesini görür
  // EXPERT/DOCTOR/DSP: Kendi iş sözleşmelerini görür (OSGB-Personel arası)

  const canSeeServiceContracts = can('CONTRACT_VIEW_SERVICE')
  const canSeeEmploymentContracts = can('CONTRACT_VIEW_EMPLOYMENT')

  // Hizmet sözleşmeleri — Admin tümünü, Client sadece kendisini
  const visibleServiceContracts = canSeeServiceContracts
    ? (isAdmin ? mockServiceContracts : filterByAccess(mockServiceContracts, 'firmId'))
    : []

  // İş sözleşmeleri — Personel sadece kendisini
  const visibleEmploymentContracts = canSeeEmploymentContracts
    ? DEMO_EMPLOYMENT_CONTRACTS.filter(c => isAdmin || c.userId === user?.id)
    : []

  const activeServiceCount = visibleServiceContracts.filter(c => c.isActive).length
  const totalRevenue = visibleServiceContracts.filter(c => c.isActive).reduce((s, c) => s + c.fee, 0)

  return (
    <div className="animate-fade-in">
      {/* Rol bilgisi */}
      {!isAdmin && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <Icon name="Info" size={18} />
          <div>
            {isClient && 'Sadece firmanıza ait hizmet sözleşmelerini görüntüleyebilirsiniz.'}
            {(user?.role === 'EXPERT' || user?.role === 'DOCTOR' || user?.role === 'DSP') &&
              'OSGB ile aranızdaki iş sözleşmenizi görüntüleyebilirsiniz. Firma hizmet sözleşmeleri bu role görünür değildir.'}
          </div>
        </div>
      )}

      {/* KPI */}
      <div className="kpi-grid">
        {canSeeServiceContracts && (
          <>
            <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}>
              <div className="kpi-value">{activeServiceCount}</div>
              <div className="kpi-label">Aktif Hizmet Sözleşmesi</div>
            </div>
            {isAdmin && (
              <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
                <div className="kpi-value">{formatCurrency(totalRevenue)}</div>
                <div className="kpi-label">Aylık Toplam Gelir</div>
              </div>
            )}
          </>
        )}
        {canSeeEmploymentContracts && (
          <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}>
            <div className="kpi-value">{visibleEmploymentContracts.length}</div>
            <div className="kpi-label">{isAdmin ? 'Personel İş Sözleşmesi' : 'İş Sözleşmem'}</div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input"><Icon name="Search" size={16} /><input placeholder="Sözleşme ara..." /></div>
        </div>
        <div className="toolbar-right">
          {can('CONTRACT_CREATE') && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Icon name="Plus" size={16} /> Yeni Sözleşme
            </button>
          )}
        </div>
      </div>

      {/* ===== HİZMET SÖZLEŞMELERİ ===== */}
      {canSeeServiceContracts && visibleServiceContracts.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, marginTop: 8 }}>
            📋 {isClient ? 'Hizmet Sözleşmeniz' : 'OSGB — Firma Hizmet Sözleşmeleri'}
          </h3>
          <div className="card" style={{ padding: 0, marginBottom: 24 }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Firma</th>
                    <th>Sözleşme Türü</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    {isAdmin && <th>Aylık Ücret</th>}
                    <th>İSG-KATİP Ref</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleServiceContracts.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.firm}</td>
                      <td>{c.type}</td>
                      <td>{formatDate(c.start)}</td>
                      <td>{formatDate(c.end)}</td>
                      {isAdmin && <td style={{ fontWeight: 600 }}>{formatCurrency(c.fee)}</td>}
                      <td>{c.isgKatipRef || <span className="badge badge-warning">Bağlı Değil</span>}</td>
                      <td>{c.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-default">Pasif</span>}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button>
                          {can('CONTRACT_CREATE') && <button className="btn btn-sm btn-ghost"><Icon name="Edit" size={14} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===== İŞ SÖZLEŞMELERİ (Personel) ===== */}
      {canSeeEmploymentContracts && visibleEmploymentContracts.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
            👤 {isAdmin ? 'OSGB — Personel İş Sözleşmeleri' : 'İş Sözleşmem (OSGB ile)'}
          </h3>
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Personel</th>
                    <th>Rol / Unvan</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    {isAdmin && <th>Aylık Ücret</th>}
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmploymentContracts.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td><span className="badge badge-info">{c.role}</span></td>
                      <td>{formatDate(c.start)}</td>
                      <td>{formatDate(c.end)}</td>
                      {isAdmin && <td style={{ fontWeight: 600 }}>{formatCurrency(c.salary)}</td>}
                      <td><span className="badge badge-success">{c.status}</span></td>
                      <td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Boş durum */}
      {visibleServiceContracts.length === 0 && visibleEmploymentContracts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Icon name="FileText" size={48} />
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Görüntülenecek sözleşme bulunmuyor.</p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Yeni Sözleşme</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><Icon name="X" size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Firma <span className="required">*</span></label><select className="form-select"><option>Seçiniz...</option></select></div>
                <div className="form-group"><label className="form-label">Sözleşme Türü <span className="required">*</span></label><select className="form-select"><option>İSG Hizmet Sözleşmesi</option><option>İSG + Hekim Sözleşmesi</option><option>Tam Paket</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Başlangıç <span className="required">*</span></label><input className="form-input" type="date" /></div>
                <div className="form-group"><label className="form-label">Bitiş <span className="required">*</span></label><input className="form-input" type="date" /></div>
                <div className="form-group"><label className="form-label">Aylık Ücret (₺) <span className="required">*</span></label><input className="form-input" type="number" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Ödeme Koşulları</label><input className="form-input" placeholder="Örn: 15 günlük vade" /></div>
                <div className="form-group"><label className="form-label">İSG-KATİP Referans</label><input className="form-input" placeholder="İSG-KATİP ref numarası" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>İptal</button>
              <button className="btn btn-primary"><Icon name="CheckCircle" size={16} /> Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
