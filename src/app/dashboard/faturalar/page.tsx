'use client'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockInvoices = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', number: 'FTR-2025-001', date: '2025-04-01', due: '2025-04-15', amount: 8500, tax: 1530, total: 10030, status: 'PENDING' },
  { id: '2', firmId: '2', firm: 'XYZ Metal', number: 'FTR-2025-002', date: '2025-04-01', due: '2025-04-15', amount: 6200, tax: 1116, total: 7316, status: 'PENDING' },
  { id: '3', firmId: '5', firm: 'Star Kimya', number: 'FTR-2025-003', date: '2025-03-01', due: '2025-03-15', amount: 12000, tax: 2160, total: 14160, status: 'PAID' },
  { id: '4', firmId: '6', firm: 'Delta Lojistik', number: 'FTR-2025-004', date: '2025-03-01', due: '2025-03-15', amount: 4800, tax: 864, total: 5664, status: 'OVERDUE' },
  { id: '5', firmId: '4', firm: 'Ofis Park', number: 'FTR-2025-005', date: '2025-03-01', due: '2025-03-15', amount: 3500, tax: 630, total: 4130, status: 'PAID' },
]
const statusLabels: Record<string, { label: string; cls: string }> = { PENDING: { label: 'Bekliyor', cls: 'badge-warning' }, PAID: { label: 'Ödendi', cls: 'badge-success' }, OVERDUE: { label: 'Gecikmiş', cls: 'badge-danger' }, CANCELLED: { label: 'İptal', cls: 'badge-default' } }

export default function FaturalarPage() {
  const { filterByAccess } = useAuth()
  const invoices = filterByAccess(mockInvoices, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(invoices.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.total, 0))}</div><div className="kpi-label">Bekleyen Tutar</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0))}</div><div className="kpi-label">Tahsil Edilen</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.total, 0))}</div><div className="kpi-label">Gecikmiş</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-cyan)' } as React.CSSProperties}><div className="kpi-value">{formatCurrency(invoices.reduce((s, i) => s + i.total, 0))}</div><div className="kpi-label">Toplam Ciro</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Fatura veya firma ara..." /></div></div><div className="toolbar-right"><button className="btn btn-primary"><Icon name="Plus" size={16} /> Yeni Fatura</button></div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Fatura No</th><th>Firma</th><th>Tarih</th><th>Vade</th><th>Tutar</th><th>KDV</th><th>Toplam</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>
        {invoices.map(i => (<tr key={i.id}><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{i.number}</td><td>{i.firm}</td><td>{formatDate(i.date)}</td><td>{formatDate(i.due)}</td><td>{formatCurrency(i.amount)}</td><td>{formatCurrency(i.tax)}</td><td style={{ fontWeight: 700 }}>{formatCurrency(i.total)}</td><td><span className={`badge ${statusLabels[i.status]?.cls}`}>{statusLabels[i.status]?.label}</span></td><td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button><button className="btn btn-sm btn-ghost"><Icon name="Download" size={14} /></button></div></td></tr>))}
      </tbody></table></div></div>
    </div>
  )
}
