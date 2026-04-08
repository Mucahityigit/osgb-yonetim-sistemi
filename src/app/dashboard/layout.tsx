'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid var(--border-primary)',
            borderTopColor: 'var(--primary-500)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}
