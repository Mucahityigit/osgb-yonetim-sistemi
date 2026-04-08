'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ROLE_LABELS } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import { Icon } from './Sidebar'

interface HeaderProps {
  collapsed?: boolean
  onToggle?: () => void
}

export default function Header({ collapsed, onToggle }: HeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Ana Panel',
    '/dashboard/firmalar': 'Firma Yönetimi',
    '/dashboard/sozlesmeler': 'Sözleşme Yönetimi',
    '/dashboard/calisanlar': 'Çalışan Yönetimi',
    '/dashboard/ziyaretler': 'Saha Ziyaretleri',
    '/dashboard/kazalar': 'İş Kazaları',
    '/dashboard/ramak-kala': 'Ramak Kala Olayları',
    '/dashboard/meslek-hastaliklari': 'Meslek Hastalıkları',
    '/dashboard/risk-degerlendirme': 'Risk Değerlendirmesi',
    '/dashboard/egitimler': 'Eğitim Yönetimi',
    '/dashboard/belgeler': 'Belge Yönetimi',
    '/dashboard/kkd': 'KKD Takip',
    '/dashboard/isg-kurulu': 'İSG Kurulu Kayıtları',
    '/dashboard/olcumler': 'Periyodik Ölçümler',
    '/dashboard/saglik-muayene': 'Sağlık Muayene',
    '/dashboard/psikososyal': 'Psikososyal Risk',
    '/dashboard/isg-katip': 'İSG-KATİP Entegrasyonu',
    '/dashboard/faturalar': 'Faturalar',
    '/dashboard/raporlar': 'Raporlar & Analitik',
    '/dashboard/bildirimler': 'Bildirimler',
    '/dashboard/kullanicilar': 'Kullanıcı Yönetimi',
    '/dashboard/denetim-izi': 'Denetim İzi',
    '/dashboard/ayarlar': 'Sistem Ayarları',
  }

  const title = pageTitles[pathname] || 'OSGB Yönetim Sistemi'
  const userRole = (session?.user as unknown as { role: string })?.role || 'EXPERT'
  const userName = session?.user?.name || 'Kullanıcı'

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
      <div className="header-left">
        <button className="collapse-btn" onClick={onToggle}>
          <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
        </button>
        <div>
          <div className="page-title">{title}</div>
          <div className="page-breadcrumb">
            OSGB Platform → {title}
          </div>
        </div>
      </div>

      <div className="header-right">
        <Link href="/dashboard/bildirimler">
          <button className="header-icon-btn" title="Bildirimler">
            <Icon name="Bell" size={18} />
            <span className="badge">3</span>
          </button>
        </Link>

        <button className="header-icon-btn" title="Yenile" onClick={() => window.location.reload()}>
          <Icon name="RefreshCw" size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 4 }}>
          <div className="user-avatar" title={userName}>
            {getInitials(userName)}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{userName}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ROLE_LABELS[userRole]}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
