'use client'
import { useState } from 'react'
import { Icon } from '@/components/layout/Sidebar'
import { DOCUMENT_CATEGORY_LABELS } from '@/lib/constants'
import { formatDate, formatFileSize } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockDocs = [
  { id: '1', firmId: '1', name: 'ABC_Insaat_Risk_Degerlendirmesi_v3.pdf', category: 'RISK_ASSESSMENT', firm: 'ABC İnşaat', size: 2450000, uploadDate: '2025-04-01', uploadedBy: 'Ahmet Yılmaz' },
  { id: '2', firmId: '5', name: 'Star_Kimya_ISG_Sozlesmesi_2025.pdf', category: 'CONTRACT', firm: 'Star Kimya', size: 890000, uploadDate: '2025-03-15', uploadedBy: 'Admin' },
  { id: '3', firmId: '2', name: 'XYZ_Metal_Yangin_Egitim_Katilimci.pdf', category: 'TRAINING', firm: 'XYZ Metal', size: 1200000, uploadDate: '2025-03-15', uploadedBy: 'Ayşe Demir' },
  { id: '4', firmId: '1', name: 'ABC_Insaat_Is_Kazasi_20250402.pdf', category: 'WORK_ACCIDENT', firm: 'ABC İnşaat', size: 3100000, uploadDate: '2025-04-02', uploadedBy: 'Ahmet Yılmaz' },
  { id: '5', firmId: '6', name: 'Delta_Lojistik_Gurultu_Olcum.pdf', category: 'MEASUREMENT', firm: 'Delta Lojistik', size: 5600000, uploadDate: '2025-02-20', uploadedBy: 'Mehmet Kaya' },
  { id: '6', firmId: '4', name: 'Ofis_Park_Acil_Durum_Plani.pdf', category: 'EMERGENCY_PLAN', firm: 'Ofis Park', size: 1800000, uploadDate: '2025-01-10', uploadedBy: 'Admin' },
]

export default function BelgelerPage() {
  const { filterByAccess, can } = useAuth()
  const [catFilter, setCatFilter] = useState('')
  const docs = filterByAccess(mockDocs, 'firmId')
  const filtered = catFilter ? docs.filter(d => d.category === catFilter) : docs
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{docs.length}</div><div className="kpi-label">Toplam Belge</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-cyan)' } as React.CSSProperties}><div className="kpi-value">{formatFileSize(docs.reduce((s, d) => s + d.size, 0))}</div><div className="kpi-label">Toplam Boyut</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{new Set(docs.map(d => d.category)).size}</div><div className="kpi-label">Kategori</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Belge adı, firma ara..." /></div><select className="form-select" style={{ width: 200 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}><option value="">Tüm Kategoriler</option>{Object.entries(DOCUMENT_CATEGORY_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div><div className="toolbar-right">{can('DOCUMENT_UPLOAD') && <button className="btn btn-primary"><Icon name="Plus" size={16} /> Belge Yükle</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Belge Adı</th><th>Kategori</th><th>Firma</th><th>Boyut</th><th>Yükleme</th><th>Yükleyen</th><th>İşlem</th></tr></thead><tbody>
        {filtered.map(d => (<tr key={d.id}><td style={{ fontWeight: 500 }}>{d.name}</td><td><span className="badge badge-info">{DOCUMENT_CATEGORY_LABELS[d.category]}</span></td><td>{d.firm}</td><td>{formatFileSize(d.size)}</td><td>{formatDate(d.uploadDate)}</td><td>{d.uploadedBy}</td><td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-ghost" title="İndir"><Icon name="Download" size={14} /></button><button className="btn btn-sm btn-ghost" title="Görüntüle"><Icon name="Eye" size={14} /></button>{can('DOCUMENT_DELETE') && <button className="btn btn-sm btn-ghost" title="Sil" style={{ color: 'var(--risk-critical)' }}><Icon name="Trash2" size={14} /></button>}</div></td></tr>))}
      </tbody></table></div></div>
    </div>
  )
}
