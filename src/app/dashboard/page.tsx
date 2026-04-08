'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { Icon } from '@/components/layout/Sidebar'
import { RISK_CLASS_LABELS } from '@/lib/constants'
import { formatDuration } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

Chart.register(...registerables)

// Mock data for demonstration
const mockStats = {
  totalFirms: 47,
  activeContracts: 42,
  monthlyVisits: 156,
  openAccidents: 3,
  pendingNotifications: 8,
  expiringContracts: 5,
  totalEmployees: 2340,
  riskAssessmentsDue: 7,
}

const mockFirmVisitCompletion = [
  { firmId: '1', name: 'ABC İnşaat A.Ş.', riskClass: 'C', completion: 95, required: 4800, actual: 4560 },
  { firmId: '2', name: 'XYZ Metal San.', riskClass: 'C', completion: 78, required: 3200, actual: 2496 },
  { firmId: '3', name: 'Mega Tekstil', riskClass: 'B', completion: 65, required: 1600, actual: 1040 },
  { firmId: '4', name: 'Ofis Park A.Ş.', riskClass: 'A', completion: 92, required: 500, actual: 460 },
  { firmId: '5', name: 'Star Kimya', riskClass: 'C', completion: 45, required: 6000, actual: 2700 },
  { firmId: '6', name: 'Delta Lojistik', riskClass: 'B', completion: 88, required: 2000, actual: 1760 },
]

const mockAlerts = [
  { id: '1', firmId: '1', type: 'CRITICAL', title: 'SGK Bildirim Gecikme Riski', message: 'ABC İnşaat - İş kazası SGK bildirimi için son 1 iş günü kaldı', time: '2 saat önce' },
  { id: '2', firmId: '2', type: 'CRITICAL', title: 'İSG-KATİP Onay Bekliyor', message: 'XYZ Metal - İşveren onayı 4. iş günü, son gün yarın!', time: '3 saat önce' },
  { id: '3', firmId: '3', type: 'HIGH', title: 'Sözleşme Bitiyor', message: 'Mega Tekstil sözleşmesi 12 gün sonra doluyor', time: '5 saat önce' },
  { id: '4', firmId: '5', type: 'HIGH', title: 'Ziyaret Süresi Eksik', message: 'Star Kimya firmasının ziyaret süre doluluk oranı %45, hedefin altında!', time: '6 saat önce' },
  { id: '5', firmId: '6', type: 'MEDIUM', title: 'Risk Değerlendirmesi Vadesi', message: 'Delta Lojistik - RD yenileme tarihi 28 gün sonra', time: '1 gün önce' },
  { id: '6', firmId: '1', type: 'MEDIUM', title: 'Eğitim Tazeleme', message: '15 çalışanın periyodik eğitim tazeleme zamanı geldi', time: '1 gün önce' },
]

const mockRecentVisits = [
  { firmId: '1', firm: 'ABC İnşaat', expert: 'Ahmet Yılmaz', date: '04.04.2025', duration: 180, type: 'Periyodik Kontrol' },
  { firmId: '2', firm: 'XYZ Metal', expert: 'Mehmet Kaya', date: '03.04.2025', duration: 240, type: 'Risk Değerlendirmesi' },
  { firmId: '4', firm: 'Ofis Park', expert: 'Ahmet Yılmaz', date: '03.04.2025', duration: 90, type: 'Eğitim' },
  { firmId: '6', firm: 'Delta Lojistik', expert: 'Ayşe Demir', date: '02.04.2025', duration: 150, type: 'Kaza İnceleme' },
  { firmId: '5', firm: 'Star Kimya', expert: 'Mehmet Kaya', date: '01.04.2025', duration: 300, type: 'Periyodik Kontrol' },
]

const mockAccidentTrend = [
  { month: 'Oca', count: 2, lost: 12 },
  { month: 'Şub', count: 1, lost: 5 },
  { month: 'Mar', count: 3, lost: 18 },
  { month: 'Nis', count: 0, lost: 0 },
  { month: 'May', count: 2, lost: 8 },
  { month: 'Haz', count: 1, lost: 3 },
  { month: 'Tem', count: 4, lost: 25 },
  { month: 'Ağu', count: 2, lost: 10 },
  { month: 'Eyl', count: 1, lost: 4 },
  { month: 'Eki', count: 3, lost: 15 },
  { month: 'Kas', count: 2, lost: 9 },
  { month: 'Ara', count: 1, lost: 6 },
]

function getRAGColor(completion: number) {
  if (completion < 60) return 'var(--risk-critical)'
  if (completion < 90) return 'var(--risk-medium)'
  return 'var(--risk-low)'
}

function getAlertStyle(type: string) {
  switch (type) {
    case 'CRITICAL': return { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', dot: 'var(--risk-critical)' }
    case 'HIGH': return { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', dot: 'var(--risk-high)' }
    case 'MEDIUM': return { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.3)', dot: 'var(--risk-medium)' }
    default: return { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', dot: 'var(--primary-400)' }
  }
}

// ==========================================
// Chart.js Components
// ==========================================
function AccidentTrendChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mockAccidentTrend.map(d => d.month),
        datasets: [
          {
            label: 'Kaza Sayısı',
            data: mockAccidentTrend.map(d => d.count),
            backgroundColor: mockAccidentTrend.map(d =>
              d.count > 2 ? 'rgba(239, 68, 68, 0.7)' :
              d.count > 1 ? 'rgba(245, 158, 11, 0.7)' :
              'rgba(59, 130, 246, 0.7)'
            ),
            borderColor: mockAccidentTrend.map(d =>
              d.count > 2 ? '#ef4444' :
              d.count > 1 ? '#f59e0b' :
              '#3b82f6'
            ),
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
          },
          {
            label: 'Kayıp İş Günü',
            data: mockAccidentTrend.map(d => d.lost),
            type: 'line' as const,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#1f2937',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#9ca3af', font: { size: 11, family: 'Inter' }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            borderColor: 'rgba(75, 85, 99, 0.4)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { weight: 'bold' as const },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          y: {
            position: 'left',
            grid: { color: 'rgba(75, 85, 99, 0.15)' },
            ticks: { color: '#6b7280', font: { size: 11 }, stepSize: 1 },
            title: { display: true, text: 'Kaza Sayısı', color: '#9ca3af', font: { size: 11 } },
          },
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: { color: '#8b5cf6', font: { size: 11 } },
            title: { display: true, text: 'Kayıp İş Günü', color: '#8b5cf6', font: { size: 11 } },
          },
        },
      },
    })

    return () => { chartInstance.current?.destroy() }
  }, [])

  return <canvas ref={chartRef} />
}

function RiskDistributionChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Çok Tehlikeli (C)', 'Tehlikeli (B)', 'Az Tehlikeli (A)'],
        datasets: [{
          data: [4, 2, 1],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderColor: [
            '#ef4444',
            '#f59e0b',
            '#22c55e',
          ],
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#9ca3af', font: { size: 11, family: 'Inter' }, padding: 12, usePointStyle: true, pointStyleWidth: 8 },
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            borderColor: 'rgba(75, 85, 99, 0.4)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed} firma`,
            },
          },
        },
      },
    })

    return () => { chartInstance.current?.destroy() }
  }, [])

  return <canvas ref={chartRef} />
}

function KFOChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['KFO (Kaza Frekans Oranı)', 'KAO (Kaza Ağırlık Oranı)'],
        datasets: [
          {
            label: 'Firmalarımız',
            data: [12.8, 0.34],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.5,
          },
          {
            label: 'Sektör Ortalaması',
            data: [15.2, 0.45],
            backgroundColor: 'rgba(107, 114, 128, 0.4)',
            borderColor: '#6b7280',
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#9ca3af', font: { size: 11, family: 'Inter' }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            borderColor: 'rgba(75, 85, 99, 0.4)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(75, 85, 99, 0.15)' },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 } },
          },
        },
      },
    })

    return () => { chartInstance.current?.destroy() }
  }, [])

  return <canvas ref={chartRef} />
}

// ==========================================
// Main Dashboard Page
// ==========================================
export default function DashboardPage() {
  useSession() // verify session is active
  const { filterByAccess } = useAuth()
  const alerts = filterByAccess(mockAlerts, 'firmId')
  const firmVisits = filterByAccess(mockFirmVisitCompletion, 'firmId')
  const recentVisits = filterByAccess(mockRecentVisits, 'firmId')

  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--primary-500)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <Icon name="Building2" size={20} />
            </div>
          </div>
          <div className="kpi-value">{firmVisits.length > 0 ? firmVisits.length : mockStats.totalFirms}</div>
          <div className="kpi-label">Aktif Firma</div>
          <div className="kpi-trend up">+3 bu ay</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-emerald)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--accent-emerald)' }}>
              <Icon name="MapPin" size={20} />
            </div>
          </div>
          <div className="kpi-value">{mockStats.monthlyVisits}</div>
          <div className="kpi-label">Bu Ay Ziyaret</div>
          <div className="kpi-trend up">+12 geçen aya göre</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-rose)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--accent-rose)' }}>
              <Icon name="AlertTriangle" size={20} />
            </div>
          </div>
          <div className="kpi-value">{mockStats.openAccidents}</div>
          <div className="kpi-label">Açık İş Kazası</div>
          <div className="kpi-trend down">SGK bildirimi bekleyen</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-amber)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-amber)' }}>
              <Icon name="FileText" size={20} />
            </div>
          </div>
          <div className="kpi-value">{mockStats.expiringContracts}</div>
          <div className="kpi-label">Biten Sözleşme (30 gün)</div>
          <div className="kpi-trend down">Yenileme gerekli</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-violet)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--accent-violet)' }}>
              <Icon name="Users" size={20} />
            </div>
          </div>
          <div className="kpi-value">{mockStats.totalEmployees.toLocaleString('tr-TR')}</div>
          <div className="kpi-label">Toplam Çalışan</div>
          <div className="kpi-trend up">47 firmada</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--accent-cyan)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent-cyan)' }}>
              <Icon name="BarChart3" size={20} />
            </div>
          </div>
          <div className="kpi-value">{mockStats.riskAssessmentsDue}</div>
          <div className="kpi-label">RD Vadesi Yaklaşan</div>
          <div className="kpi-trend down">60 gün içinde</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Critical Alerts */}
        <div className="col-8">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">🚨 Kritik Uyarılar ve Bildirimler</h2>
                <p className="card-subtitle">Acil müdahale gerektiren konular</p>
              </div>
              <Link href="/dashboard/bildirimler" className="btn btn-sm btn-ghost">
                Tümünü Gör →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.map((alert) => {
                const style = getAlertStyle(alert.type)
                return (
                  <div key={alert.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div className="status-dot" style={{ background: style.dot, boxShadow: `0 0 6px ${style.dot}`, marginTop: 5 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{alert.message}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{alert.time}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ISG-KATIP Status */}
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">🔗 İSG-KATİP Durumu</h2>
                <p className="card-subtitle">Atama ve onay takibi</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Senkronize</span>
                <span className="badge badge-success">38 firma</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Onay Bekliyor</span>
                <span className="badge badge-warning">4 atama</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Bloke</span>
                <span className="badge badge-danger">1 firma</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Bağlı Değil</span>
                <span className="badge badge-default">4 firma</span>
              </div>
              <Link href="/dashboard/isg-katip" className="btn btn-sm btn-secondary w-full" style={{ marginTop: 8 }}>
                İSG-KATİP Yönetimi →
              </Link>
            </div>
          </div>
        </div>

        {/* ==========================================
            Chart.js GRAPHS
           ========================================== */}

        {/* Accident Trend Chart - Chart.js */}
        <div className="col-8">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">📈 İş Kazası Trend Analizi</h2>
                <p className="card-subtitle">Aylık kaza sayısı ve kayıp iş günü (Son 12 Ay)</p>
              </div>
              <Link href="/dashboard/kazalar" className="btn btn-sm btn-ghost">
                Detaylar →
              </Link>
            </div>
            <div style={{ height: 280, position: 'relative' }}>
              <AccidentTrendChart />
            </div>
          </div>
        </div>

        {/* Risk Distribution Doughnut + KFO/KAO */}
        <div className="col-4">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">🎯 Tehlike Sınıfı Dağılımı</h2>
                <p className="card-subtitle">Firma bazlı risk profili</p>
              </div>
            </div>
            <div style={{ height: 220, position: 'relative' }}>
              <RiskDistributionChart />
            </div>
          </div>
        </div>

        {/* KFO/KAO comparison */}
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">📊 KFO / KAO Karşılaştırma</h2>
                <p className="card-subtitle">Firmalarımız vs Sektör ortalaması</p>
              </div>
            </div>
            <div style={{ height: 200, position: 'relative' }}>
              <KFOChart />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#4ade80' }}>%15.8</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>KFO Sektörden Düşük</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#4ade80' }}>%24.4</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>KAO Sektörden Düşük</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Completion RAG */}
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">🏢 Firma Ziyaret Dolum Oranları</h2>
                <p className="card-subtitle">RAG renk kodlu aylık hedef takibi</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {firmVisits.map((firm, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{firm.name}</span>
                      <span className={`badge ${firm.riskClass === 'C' ? 'badge-danger' : firm.riskClass === 'B' ? 'badge-warning' : 'badge-success'}`}>
                        {RISK_CLASS_LABELS[firm.riskClass]}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getRAGColor(firm.completion) }}>
                      %{firm.completion}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${firm.completion}%`,
                        background: getRAGColor(firm.completion),
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {formatDuration(firm.actual)} / {formatDuration(firm.required)} hedef
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">🗓️ Son Ziyaretler</h2>
                <p className="card-subtitle">Son tamamlanan saha ziyaretleri</p>
              </div>
              <Link href="/dashboard/ziyaretler" className="btn btn-sm btn-ghost">
                Tümünü Gör →
              </Link>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Firma</th>
                    <th>Uzman</th>
                    <th>Tarih</th>
                    <th>Süre</th>
                    <th>Tür</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisits.map((visit, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{visit.firm}</td>
                      <td>{visit.expert}</td>
                      <td>{visit.date}</td>
                      <td>{formatDuration(visit.duration)}</td>
                      <td><span className="badge badge-info">{visit.type}</span></td>
                      <td>
                        <button className="btn btn-sm btn-ghost">
                          <Icon name="Eye" size={14} /> Detay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
