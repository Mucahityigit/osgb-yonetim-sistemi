'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { SIDEBAR_MENU } from '@/lib/constants'
import { canAccessPage, type UserRole } from '@/lib/authorization'

// Simple icon component using Lucide-style SVGs
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    LayoutDashboard: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
    Building2: 'M6 2h12v20H6zM2 22h20M9 6h2m4 0h2M9 10h2m4 0h2M9 14h2m4 0h2M9 18h2',
    FileText: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    Users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
    MapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z',
    AlertTriangle: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01',
    ShieldAlert: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
    BarChart3: 'M12 20V10 M18 20V4 M6 20v-4',
    GraduationCap: 'M22 10l-10-5L2 10l10 5z M6 12v5c3 3 6 3 6 3s3 0 6-3v-5',
    FolderOpen: 'M2 19V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z',
    HardHat: 'M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a8 8 0 00-16 0v2z M10 8V5 M14 8V5 M12 2a2 2 0 012 2v4H10V4a2 2 0 012-2z',
    UsersRound: 'M18 21a8 8 0 00-16 0 M12 11a4 4 0 100-8 4 4 0 000 8z',
    Gauge: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33',
    HeartPulse: 'M19.5 12.572l-7.5 7.428-7.5-7.428a5 5 0 117.5-6.566 5 5 0 017.5 6.572z M12 6l2 4h3l-2 4',
    Brain: 'M12 2a7 7 0 017 7c0 3-2 5-4 7l-3 4-3-4c-2-2-4-4-4-7a7 7 0 017-7z',
    Link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
    Receipt: 'M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2z M16 8H8 M16 12H8 M16 16H8',
    PieChart: 'M21.21 15.89A10 10 0 118 2.83 M22 12A10 10 0 0012 2v10z',
    Bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
    UserCog: 'M8 21v-2a4 4 0 014-4h2 M12 3a4 4 0 100 8 4 4 0 000-8z M19 17a3 3 0 100-6 3 3 0 000 6z',
    ScrollText: 'M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 01-2 2zm0 0a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v10',
    Settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
    Stethoscope: 'M4.8 2.655A.5.5 0 005 2.5V2a.5.5 0 01.5-.5h1A.5.5 0 017 2v.5a.5.5 0 00.2.155l.8.5V8c0 2.21-1.79 4-4 4S0 10.21 0 8V3.155l.8-.5z',
    Menu: 'M3 12h18M3 6h18M3 18h18',
    X: 'M18 6L6 18M6 6l12 12',
    ChevronLeft: 'M15 18l-6-6 6-6',
    ChevronRight: 'M9 18l6-6-6-6',
    Search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    LogOut: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
    Plus: 'M12 5v14M5 12h14',
    Filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
    Download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    Eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
    Edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    Trash2: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2 M10 11v6 M14 11v6',
    RefreshCw: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
    Calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18',
    Clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
    CheckCircle: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
    XCircle: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M15 9l-6 6 M9 9l6 6',
    Info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01',
  }

  const pathData = icons[name]
  if (!pathData) {
    return <span style={{ width: size, height: size, display: 'inline-block' }} />
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="nav-icon"
    >
      {pathData.split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  )
}

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const userRole = ((session?.user as unknown as { role: string })?.role || 'EXPERT') as UserRole

  // Rol bazlı menü filtreleme — PAGE_PERMISSIONS kullanarak
  const filteredMenu = SIDEBAR_MENU.filter(item => canAccessPage(userRole, item.href))

  // Menü gruplarını erişilebilir öğelere göre oluştur
  const menuMap = new Map(filteredMenu.map(item => [item.href, item]))
  
  const sections = [
    { title: 'ANA', hrefs: ['/dashboard'] },
    { title: 'YÖNETİM', hrefs: ['/dashboard/firmalar', '/dashboard/sozlesmeler', '/dashboard/calisanlar'] },
    { title: 'OPERASYONLAR', hrefs: ['/dashboard/ziyaretler', '/dashboard/kazalar', '/dashboard/ramak-kala', '/dashboard/meslek-hastaliklari', '/dashboard/risk-degerlendirme', '/dashboard/egitimler', '/dashboard/belgeler', '/dashboard/kkd'] },
    { title: 'SAĞLIK & GÜVENLİK', hrefs: ['/dashboard/isg-kurulu', '/dashboard/olcumler', '/dashboard/saglik-muayene', '/dashboard/psikososyal', '/dashboard/isg-katip'] },
    { title: 'FİNANS & RAPORLAMA', hrefs: ['/dashboard/faturalar', '/dashboard/raporlar', '/dashboard/bildirimler'] },
    { title: 'SİSTEM', hrefs: ['/dashboard/kullanicilar', '/dashboard/denetim-izi', '/dashboard/ayarlar'] },
  ].map(section => ({
    title: section.title,
    items: section.hrefs.map(h => menuMap.get(h)).filter(Boolean) as typeof SIDEBAR_MENU,
  }))

  return (
    <>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">İSG</div>
          <div>
            <div className="logo-text">OSGB Platform</div>
            <div className="logo-subtitle">Yönetim Sistemi</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section, si) => (
            <div key={si}>
              {section.items.length > 0 && (
                <>
                  <div className="nav-section-title">{section.title}</div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon name={item.icon} size={18} />
                      <span className="nav-label">{item.title}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div
            className="nav-item"
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="LogOut" size={18} />
            <span className="nav-label">Çıkış Yap</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 55,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}

export { Icon }
export function useSidebarCollapsed() {
  return useState(false)
}
