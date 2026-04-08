'use client'
import { Icon } from '@/components/layout/Sidebar'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const mockAtamalar = [
  { id: '1', firmId: '1', firm: 'ABC İnşaat', expert: 'Ahmet Yılmaz', role: 'İGU (A Sınıfı)', status: 'SYNCED', assignedAt: '2024-01-15', confirmedAt: '2024-01-18' },
  { id: '2', firmId: '2', firm: 'XYZ Metal', expert: 'Mehmet Kaya', role: 'İGU (B Sınıfı)', status: 'PENDING', assignedAt: '2025-04-01', daysLeft: 2 },
  { id: '3', firmId: '5', firm: 'Star Kimya', expert: 'Mehmet Kaya', role: 'İGU (A Sınıfı)', status: 'BLOCKED', assignedAt: '2025-03-20', reason: 'Çalışan sayısı değişimi' },
  { id: '4', firmId: '6', firm: 'Delta Lojistik', expert: 'Ayşe Demir', role: 'İGU (B Sınıfı)', status: 'SYNCED', assignedAt: '2024-06-01', confirmedAt: '2024-06-04' },
  { id: '5', firmId: '1', firm: 'ABC İnşaat', expert: 'Dr. Zeynep Acar', role: 'İşyeri Hekimi', status: 'SYNCED', assignedAt: '2024-01-15', confirmedAt: '2024-01-20' },
  { id: '6', firmId: '3', firm: 'Mega Tekstil', expert: 'Ahmet Yılmaz', role: 'İGU (C Sınıfı)', status: 'PENDING', assignedAt: '2025-04-02', daysLeft: 4 },
]

function getStatusUI(status: string, daysLeft?: number, reason?: string) {
  switch (status) {
    case 'SYNCED': return <span className="badge badge-success">✅ Senkronize</span>
    case 'PENDING': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="badge badge-warning">⏳ Onay Bekliyor</span>
        {daysLeft !== undefined && (
          <div className={`countdown ${daysLeft <= 2 ? '' : 'warning'}`}>
            <Icon name="Clock" size={14} />{daysLeft} iş günü kaldı
          </div>
        )}
      </div>
    )
    case 'BLOCKED': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="badge badge-danger">🚫 Bloke</span>
        {reason && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{reason}</span>}
      </div>
    )
    default: return <span className="badge badge-default">Bağlı Değil</span>
  }
}

const processSteps = [
  "SGK sicil no ile İSG-KATİP sisteminde firmayı doğrulayın",
  "Uzman için dışa görevlendirme başlatın",
  "İşveren 5 iş günü içinde e-Devlet üzerinden onay vermelidir",
  "Onay sonrası atama senkronize olarak güncellenir",
  "Çalışan sayısı değişiminde blokaj kontrolü yapın",
]

export default function IsgKatipPage() {
  const { filterByAccess } = useAuth()
  const atamalar = filterByAccess(mockAtamalar, 'firmId')
  return (
    <div className="animate-fade-in">
      <div className="alert alert-warning">
        <Icon name="AlertTriangle" size={18} />
        <div>
          <strong>Kritik:</strong> İSG-KATİP sisteminde tescil edilmeyen atamalar resmiyet kazanmaz.
          İşveren tarafından 5 iş günü içinde e-Devlet üzerinden onaylanması zorunludur.
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-low)' } as React.CSSProperties}>
          <div className="kpi-value">{atamalar.filter(a => a.status === 'SYNCED').length}</div>
          <div className="kpi-label">Senkronize</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}>
          <div className="kpi-value">{atamalar.filter(a => a.status === 'PENDING').length}</div>
          <div className="kpi-label">Onay Bekliyor</div>
        </div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}>
          <div className="kpi-value">{atamalar.filter(a => a.status === 'BLOCKED').length}</div>
          <div className="kpi-label">Bloke</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Icon name="Search" size={16} />
            <input placeholder="Firma veya uzman ara..." />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary">
            <Icon name="RefreshCw" size={16} /> Durumu Güncelle
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Firma</th>
                <th>Uzman / Hekim</th>
                <th>Rol</th>
                <th>Atama Tarihi</th>
                <th>Onay Tarihi</th>
                <th>İSG-KATİP Durumu</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {atamalar.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.firm}</td>
                  <td>{a.expert}</td>
                  <td><span className="badge badge-info">{a.role}</span></td>
                  <td>{formatDate(a.assignedAt)}</td>
                  <td>{a.confirmedAt ? formatDate(a.confirmedAt) : '-'}</td>
                  <td>{getStatusUI(a.status, (a as unknown as { daysLeft?: number }).daysLeft, (a as unknown as { reason?: string }).reason)}</td>
                  <td><button className="btn btn-sm btn-ghost"><Icon name="Eye" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>🔗 İSG-KATİP Süreç Rehberi</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {processSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-primary)' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-600)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0
              }}>{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
