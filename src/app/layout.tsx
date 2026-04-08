import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'OSGB Yönetim Sistemi — İSG Platformu',
  description: '6331 Sayılı İş Sağlığı ve Güvenliği Kanunu kapsamında OSGB firmalarının operasyonel süreçlerini yöneten dijital platform.',
  keywords: 'OSGB, İSG, İş Güvenliği, İş Sağlığı, 6331, İSG-KATİP, Risk Değerlendirmesi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
