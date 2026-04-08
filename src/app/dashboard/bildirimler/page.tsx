'use client'
import { Icon } from '@/components/layout/Sidebar'
import { useAuth } from '@/hooks/useAuth'

const mockNotifications = [
  { id: '1', firmId: '1', type: 'SGK_DEADLINE', priority: 'CRITICAL', title: 'SGK Bildirim Acil', message: 'ABC İnşaat — İş kazası bildirimi için son 1 iş günü! Hemen bildirim yapılmalı.', time: '2 saat önce', isRead: false },
  { id: '2', firmId: '2', type: 'ISG_KATIP_APPROVAL', priority: 'CRITICAL', title: 'İSG-KATİP Onay Bekliyor', message: 'XYZ Metal — İşveren onayı 4. iş günü. Firma yetkilisine hatırlatma yapılmalı.', time: '3 saat önce', isRead: false },
  { id: '3', firmId: '3', type: 'CONTRACT_EXPIRY', priority: 'HIGH', title: 'Sözleşme Bitiş Uyarısı', message: 'Mega Tekstil sözleşmesi 12 gün sonra doluyor. Yenileme görüşmesi yapılmalı.', time: '5 saat önce', isRead: false },
  { id: '4', firmId: '5', type: 'VISIT_DEFICIT', priority: 'HIGH', title: 'Ziyaret Süresi Eksik', message: 'Star Kimya firmasının ziyaret süre doluluk oranı %45. Hedefin altında!', time: '6 saat önce', isRead: true },
  { id: '5', firmId: '6', type: 'RISK_ASSESSMENT_DUE', priority: 'MEDIUM', title: 'Risk Değerlendirmesi Vadesi', message: 'Delta Lojistik — RD yenileme tarihi 28 gün sonra. Revizyon planlanmalı.', time: '1 gün önce', isRead: true },
  { id: '6', firmId: '1', type: 'TRAINING_DUE', priority: 'MEDIUM', title: 'Eğitim Tazeleme Zamanı', message: '15 çalışanın periyodik eğitim tazeleme zamanı geldi.', time: '1 gün önce', isRead: true },
  { id: '7', firmId: '2', type: 'HEALTH_EXAM_DUE', priority: 'MEDIUM', title: 'Periyodik Muayene', message: '8 çalışanın periyodik sağlık muayenesi 30 gün içinde yapılmalı.', time: '2 gün önce', isRead: true },
  { id: '8', firmId: '1', type: 'PPE_RENEWAL', priority: 'LOW', title: 'KKD Yenileme', message: '3 çalışanın KKD yenileme tarihi yaklaşıyor.', time: '3 gün önce', isRead: true },
  { id: '9', firmId: '4', type: 'VISIT_COMPLETED', priority: 'LOW', title: 'Ziyaret Tamamlandı', message: 'Ofis Park — Ahmet Yılmaz tarafından ziyaret raporu gönderildi.', time: '3 gün önce', isRead: true },
]

const priorityColors: Record<string, string> = { CRITICAL: 'var(--risk-critical)', HIGH: 'var(--risk-high)', MEDIUM: 'var(--risk-medium)', LOW: 'var(--primary-400)' }
const priorityLabels: Record<string, string> = { CRITICAL: 'Kritik', HIGH: 'Yüksek', MEDIUM: 'Orta', LOW: 'Düşük' }

export default function BildirimlerPage() {
  const { filterByAccess } = useAuth()
  const notifications = filterByAccess(mockNotifications, 'firmId')
  const unreadCount = notifications.filter(n => !n.isRead).length
  return (
    <div className="animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{unreadCount}</div><div className="kpi-label">Okunmamış</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}><div className="kpi-value">{notifications.length}</div><div className="kpi-label">Toplam Bildirim</div></div>
        <div className="kpi-card" style={{ '--kpi-color': 'var(--risk-critical)' } as React.CSSProperties}><div className="kpi-value">{notifications.filter(n => n.priority === 'CRITICAL').length}</div><div className="kpi-label">Kritik</div></div>
      </div>
      <div className="toolbar"><div className="toolbar-right"><button className="btn btn-secondary"><Icon name="CheckCircle" size={16} /> Tümünü Okundu İşaretle</button></div></div>
      <div className="card" style={{ padding: 0 }}>
        {notifications.map(n => (
          <div key={n.id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
            <div className="notification-dot" style={{ background: priorityColors[n.priority], boxShadow: `0 0 6px ${priorityColors[n.priority]}` }} />
            <div className="notification-content" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="notification-title">{n.title}</span>
                <span className="badge" style={{ background: `${priorityColors[n.priority]}20`, color: priorityColors[n.priority], fontSize: 10 }}>{priorityLabels[n.priority]}</span>
              </div>
              <div className="notification-message">{n.message}</div>
              <div className="notification-time">{n.time}</div>
            </div>
            {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)', flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
