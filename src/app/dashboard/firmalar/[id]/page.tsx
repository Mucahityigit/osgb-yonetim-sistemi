import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { RISK_CLASS_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function FirmaDetayPage({ params }: { params: { id: string } }) {
  const firm = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      users: true, // Assignees vs
      siteVisits: { orderBy: { visitDate: 'desc' }, take: 5 },
      workAccidents: { orderBy: { accidentDate: 'desc' }, take: 5 }
    }
  })

  if (!firm) {
    notFound()
  }

  const riskLabel = RISK_CLASS_LABELS[firm.riskClass] || firm.riskClass

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link href="/dashboard/firmalar" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              &larr; Firmalara Dön
            </Link>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {firm.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            VKN: {firm.taxNumber} &middot; SGK: {firm.sgkNo} &middot; İl: {firm.city}
          </p>
        </div>
        <div>
          <span className={`badge badge-${firm.isActive ? 'success' : 'default'}`} style={{ fontSize: 13, padding: '6px 12px' }}>
            {firm.isActive ? 'Aktif Müşteri' : 'Pasif'}
          </span>
        </div>
      </div>

      <div className="card-grid">
        {/* Sol Kolon - Temel Bilgiler */}
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Genel Bilgiler</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Tehlike Sınıfı</span>
              <div style={{ fontWeight: 500 }}>
                 {firm.riskClass === 'C' ? <span className="badge badge-danger">Çok Tehlikeli</span> : 
                  firm.riskClass === 'B' ? <span className="badge badge-warning">Tehlikeli</span> : 
                  <span className="badge badge-success">Az Tehlikeli</span>}
              </div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>NACE Kodu</span>
              <div style={{ fontWeight: 500 }}>{firm.naceCode}</div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Çalışan Sayısı</span>
              <div style={{ fontWeight: 500 }}>{firm.employeeCount} Kişi</div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>İSG-KATİP Durumu</span>
              <div style={{ fontWeight: 500 }}>
                {firm.isgKatipStatus === 'SYNCED' ? <span className="badge badge-success">Senkronize</span> : <span className="badge badge-default">{firm.isgKatipStatus}</span>}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', margin: '24px 0' }} />

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Sözleşme & İletişim</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Yetkili Adı</span>
              <div style={{ fontWeight: 500 }}>{firm.contactName || '-'}</div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>İletişim / E-posta</span>
              <div style={{ fontWeight: 500 }}>{firm.contactPhone} <br/> <a href={`mailto:${firm.contactEmail}`} style={{ color: 'var(--primary-500)' }}>{firm.contactEmail}</a></div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Firma Adresi</span>
              <div style={{ fontWeight: 500 }}>{firm.address} - {firm.district}/{firm.city}</div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - İstatistik & Kısayollar */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Aktivite Özeti</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surface-sunken)', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)' }}>Son Ziyaretler</span>
                <strong style={{ fontSize: 20 }}>{firm.siteVisits.length}</strong>
              </div>
              <Link href={`/dashboard/ziyaretler?firm=${firm.id}`} className="btn btn-sm btn-secondary">Tümü</Link>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)' }}>Kayıtlı Kazalar</span>
                <strong style={{ fontSize: 20, color: firm.workAccidents.length > 0 ? 'var(--risk-critical)' : 'inherit' }}>{firm.workAccidents.length}</strong>
              </div>
              <Link href={`/dashboard/kazalar?firm=${firm.id}`} className="btn btn-sm btn-secondary">Tümü</Link>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)' }}>Atanan İSG Profesyonelleri</span>
                <strong style={{ fontSize: 20 }}>{firm.users?.length || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
