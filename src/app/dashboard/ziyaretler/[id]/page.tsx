import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { VISIT_TYPE_LABELS } from '@/lib/constants'
import { formatDate, formatDuration } from '@/lib/utils'
import Link from 'next/link'

export default async function ZiyaretDetayPage({ params }: { params: { id: string } }) {
  const visit = await prisma.siteVisit.findUnique({
    where: { id: params.id },
    include: {
      firm: true,
      expert: true
    }
  })

  if (!visit) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link href="/dashboard/ziyaretler" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              &larr; Tüm Ziyaretlere Dön
            </Link>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Ziyaret Raporu Özeti
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Firma: <strong>{visit.firm?.name || 'Bilinmiyor'}</strong>
          </p>
        </div>
        <div>
          <span className="badge badge-info" style={{ fontSize: 13, padding: '6px 12px' }}>
            {VISIT_TYPE_LABELS[visit.visitType]}
          </span>
        </div>
      </div>

      <div className="card-grid">
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Saha Notları ve Bulgular</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
            <div>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Yapılan İş ve İşlemler</span>
              <div style={{ backgroundColor: 'var(--bg-glass)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {visit.description || '-'}
              </div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--risk-critical)', marginBottom: 8 }}>Tespit Edilen Eksiklikler / Uygunsuzluklar</span>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {visit.findings || 'Herhangi bir uygunsuzluk tespit edilmemiştir.'}
              </div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--accent-emerald)', marginBottom: 8 }}>Verilen Öneriler ve Düzeltici Faaliyetler</span>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {visit.actions || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Ziyaret Bilgileri */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Ziyaret Künyesi</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Ziyareti Gerçekleştiren Uzman</span>
               <div style={{ fontWeight: 500 }}>{visit.expert?.name || '-'}</div>
            </div>
            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Ziyaret Tarihi</span>
               <div style={{ fontWeight: 500 }}>{formatDate(visit.visitDate)}</div>
            </div>
            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Zaman Çizelgesi</span>
               <div style={{ fontWeight: 500 }}>
                 {visit.startTime ? (visit.startTime as Date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'} 
                 &nbsp;—&nbsp; 
                 {visit.endTime ? (visit.endTime as Date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
               </div>
            </div>
            <div>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Toplam Hesaplanan Süre</span>
               <div style={{ fontWeight: 600, color: 'var(--primary-500)', fontSize: 16 }}>{formatDuration(visit.durationMinutes)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
