import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ACCIDENT_TYPE_LABELS, SEVERITY_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Icon } from '@/components/layout/Sidebar'

export default async function KazaDetayPage({ params }: { params: { id: string } }) {
  const accident = await prisma.workAccident.findUnique({
    where: { id: params.id },
    include: {
      firm: true
    }
  })

  if (!accident) {
    notFound()
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link href="/dashboard/kazalar" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              &larr; Kaza Kayıtlarına Dön
            </Link>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Kaza İnceleme Raporu
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Kazalı Personel: <strong style={{ color: 'var(--text-primary)' }}>{accident.injuredName}</strong> &middot; Firma: <strong>{accident.firm?.name || 'Bilinmiyor'}</strong>
          </p>
        </div>
        <div>
          <span className={`badge ${accident.status === 'CLOSED' ? 'badge-success' : accident.status === 'NOTIFIED' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: 13, padding: '6px 12px' }}>
            {accident.status === 'CLOSED' ? 'Kapalı' : 'SGK Bildirimi Bekliyor / Açık'}
          </span>
        </div>
      </div>

      <div className="card-grid">
        {/* Sol Kolon - Kaza Detayı */}
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Kaza Detayları ve Açıklama</h3>
          
          <div style={{ backgroundColor: 'var(--bg-glass)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: 24 }}>
            {accident.description || 'Kaza açıklaması girilmemiş.'}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Kök Neden Analizi (5N1K / Balık Kılçığı)</h3>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: 24 }}>
            {accident.rootCause || 'Analiz verisi bulunamadı.'}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Düzeltici ve Önleyici Faaliyetler (DÖF)</h3>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {accident.correctiveActions || 'DÖF kaydı bulunamadı.'}
          </div>
        </div>

        {/* Sağ Kolon - Metadata */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Kaza Bilgileri</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Kaza Türü</span>
               <div style={{ fontWeight: 500 }}><span className="badge badge-info">{ACCIDENT_TYPE_LABELS[accident.accidentType] || accident.accidentType}</span></div>
            </div>
            
            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Kazanın Meydana Geldiği Tarih / Saat</span>
               <div style={{ fontWeight: 500 }}>
                 {formatDate(accident.accidentDate)} — {accident.accidentTime}
               </div>
            </div>

            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Kaza Lokasyonu</span>
               <div style={{ fontWeight: 500 }}>{accident.location}</div>
            </div>

            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Yaralanma Şiddeti</span>
               <div style={{ fontWeight: 500 }}>
                 <span className={`badge ${accident.severity === 'DEATH' || accident.severity === 'PERMANENT_DISABILITY' ? 'badge-danger' : 'badge-warning'}`}>
                    {SEVERITY_LABELS[accident.severity] || accident.severity}
                 </span>
               </div>
            </div>

            <div style={{ paddingBottom: 16 }}>
               <span style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Yaralanan Vücut Bölgesi</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                 <Icon name="User" size={16} />
                 {accident.bodyPart || 'Belirtilmedi'}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
