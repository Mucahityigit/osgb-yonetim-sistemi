'use client'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockExams = [
  { id: '1', firmId: '1', employee: 'Hüseyin Çelik', firm: 'ABC İnşaat', type: 'PERIODIC', date: '2025-03-15', doctor: 'Dr. Zeynep Acar', result: 'FIT', nextDate: '2026-03-15', conditions: '' },
  { id: '2', firmId: '5', employee: 'Elif Yıldırım', firm: 'Star Kimya', type: 'PERIODIC', date: '2025-02-20', doctor: 'Dr. Zeynep Acar', result: 'CONDITIONAL', nextDate: '2025-08-20', conditions: 'Solunum fonksiyon testi 6 ayda bir' },
  { id: '3', firmId: '1', employee: 'Ali Korkmaz', firm: 'ABC İnşaat', type: 'ENTRY', date: '2025-04-01', doctor: 'Dr. Zeynep Acar', result: 'FIT', nextDate: '2026-04-01', conditions: '' },
  { id: '4', firmId: '2', employee: 'Mustafa Şahin', firm: 'XYZ Metal', type: 'PERIODIC', date: '2025-01-10', doctor: 'Dr. Çetin Kılıç', result: 'FIT', nextDate: '2026-01-10', conditions: '' },
]
const typeLabels: Record<string, string> = { ENTRY: 'İşe Giriş', PERIODIC: 'Periyodik', EXIT: 'İşten Çıkış' }
const resultLabels: Record<string, { label: string; cls: string }> = { FIT: { label: 'Uygun', cls: 'badge-success' }, UNFIT: { label: 'Uygun Değil', cls: 'badge-danger' }, CONDITIONAL: { label: 'Şartlı', cls: 'badge-warning' } }

export default function SaglikMuayenePage() {
  const { filterByAccess, can } = useAuth()
  const exams = filterByAccess(mockExams, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}><div className="kpi-value">{exams.length}</div><div className="kpi-label">Toplam Muayene</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{exams.filter(e => new Date(e.nextDate) <= new Date(Date.now() + 30*24*60*60*1000)).length}</div><div className="kpi-label">30 Gün İçinde Vadesi Gelen</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}><div className="kpi-value">{exams.filter(e => e.result === 'FIT').length}</div><div className="kpi-label">Uygun</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}><div className="kpi-value">{exams.filter(e => e.result === 'CONDITIONAL').length}</div><div className="kpi-label">Şartlı Uygun</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Çalışan veya firma ara..." /></div></div><div className="toolbar-right">{can('HEALTH_EXAM_CREATE') && <button className="btn btn-primary"><Icon name="Plus" size={16} /> Yeni Muayene Kaydı</button>}</div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Çalışan</th><th>Firma</th><th>Muayene Türü</th><th>Tarih</th><th>Hekim</th><th>Sonuç</th><th>Koşullar</th><th>Sonraki</th><th>İşlem</th></tr></thead><tbody>
        {exams.map(e => (<tr key={e.id}><td style={{ fontWeight: 600 }}>{e.employee}</td><td>{e.firm}</td><td><span className="badge badge-info">{typeLabels[e.type]}</span></td><td>{formatDate(e.date)}</td><td>{e.doctor}</td><td><span className={`badge ${resultLabels[e.result]?.cls}`}>{resultLabels[e.result]?.label}</span></td><td style={{ fontSize: 12 }}>{e.conditions || '-'}</td><td>{formatDate(e.nextDate)}</td><td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td></tr>))}
      </tbody></table></div></div>
    </div>
  )
}
