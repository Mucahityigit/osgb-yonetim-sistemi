'use client'
import { Icon } from '@/components/layout/Sidebar'
import { formatDateTime } from '@/lib/utils'

const mockLogs = [
  { id: '1', user: 'Ahmet Yılmaz', action: 'CREATE', table: 'site_visits', record: 'SV-2025-156', detail: 'Yeni ziyaret kaydı oluşturuldu — ABC İnşaat', time: '2025-04-04T14:30:15', ip: '192.168.1.105' },
  { id: '2', user: 'Admin', action: 'UPDATE', table: 'organizations', record: 'ORG-001', detail: 'ABC İnşaat çalışan sayısı 115→120 güncellendi', time: '2025-04-04T14:15:00', ip: '192.168.1.100' },
  { id: '3', user: 'Mehmet Kaya', action: 'CREATE', table: 'work_accidents', record: 'WA-2025-003', detail: 'İş kazası bildirimi oluşturuldu — ABC İnşaat', time: '2025-04-02T16:45:30', ip: '192.168.1.110' },
  { id: '4', user: 'Dr. Zeynep Acar', action: 'CREATE', table: 'health_examinations', record: 'HE-2025-045', detail: 'Sağlık muayenesi kaydı — Ali Korkmaz', time: '2025-04-01T10:20:00', ip: '192.168.1.115' },
  { id: '5', user: 'Admin', action: 'UPDATE', table: 'users', record: 'USR-006', detail: 'Kullanıcı rolü güncellendi', time: '2025-04-01T09:00:00', ip: '192.168.1.100' },
  { id: '6', user: 'Ahmet Yılmaz', action: 'CREATE', table: 'risk_items', record: 'RI-2025-089', detail: 'Risk kalemi eklendi — ABC İnşaat RD v3', time: '2025-03-31T15:30:00', ip: '192.168.1.105' },
  { id: '7', user: 'Admin', action: 'DELETE', table: 'documents', record: 'DOC-2025-012', detail: 'Belge arşivlendi (soft-delete)', time: '2025-03-30T11:00:00', ip: '192.168.1.100' },
]
const actionLabels: Record<string, { label: string; cls: string }> = { CREATE: { label: 'Oluşturma', cls: 'badge-success' }, UPDATE: { label: 'Güncelleme', cls: 'badge-warning' }, DELETE: { label: 'Silme', cls: 'badge-danger' }, READ: { label: 'Okuma', cls: 'badge-info' } }

export default function DenetimIziPage() {
  return (
    <div className="animate-fade-in">
      <div className="alert alert-info"><Icon name="Info" size={18} /><div>Denetim izi kayıtları <strong>değiştirilemez (immutable)</strong> yapıdadır ve minimum <strong>2 yıl</strong> saklanır. Tüm veri erişim ve değişiklik işlemleri otomatik olarak kaydedilir.</div></div>
      <div className="toolbar"><div className="toolbar-left"><div className="search-input"><Icon name="Search" size={16} /><input placeholder="Kullanıcı, tablo veya işlem ara..." /></div><select className="form-select" style={{ width: 160 }}><option value="">Tüm İşlemler</option><option value="CREATE">Oluşturma</option><option value="UPDATE">Güncelleme</option><option value="DELETE">Silme</option></select></div><div className="toolbar-right"><button className="btn btn-secondary"><Icon name="Download" size={16} /> Dışa Aktar</button></div></div>
      <div className="card" style={{ padding: 0 }}><div className="table-container"><table className="data-table"><thead><tr><th>Zaman</th><th>Kullanıcı</th><th>İşlem</th><th>Tablo</th><th>Kayıt ID</th><th>Detay</th><th>IP Adresi</th></tr></thead><tbody>
        {mockLogs.map(l => (<tr key={l.id}><td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDateTime(l.time)}</td><td style={{ fontWeight: 500 }}>{l.user}</td><td><span className={`badge ${actionLabels[l.action]?.cls}`}>{actionLabels[l.action]?.label}</span></td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{l.table}</td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{l.record}</td><td style={{ fontSize: 12.5 }}>{l.detail}</td><td style={{ fontFamily: 'monospace', fontSize: 11 }}>{l.ip}</td></tr>))}
      </tbody></table></div></div>
    </div>
  )
}
