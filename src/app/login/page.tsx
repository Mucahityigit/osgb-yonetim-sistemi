'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: string) => {
    const demos: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@osgb.com', password: 'Admin123!@#$%' },
      expert: { email: 'uzman@osgb.com', password: 'Uzman123!@#$%' },
      doctor: { email: 'hekim@osgb.com', password: 'Hekim123!@#$%' },
      client: { email: 'firma@osgb.com', password: 'Firma123!@#$%' },
    }
    const demo = demos[role]
    if (demo) {
      setEmail(demo.email)
      setPassword(demo.password)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card animate-slide-up">
        <div className="login-logo">
          <div className="logo-mark">İSG</div>
          <h1>OSGB Yönetim Sistemi</h1>
          <p>İş Sağlığı ve Güvenliği Platformu</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              E-posta Adresi <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="ornek@osgb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Şifre <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>🔑 Demo Hesaplar</h4>
          <p style={{ cursor: 'pointer' }} onClick={() => fillDemo('admin')}>
            <strong>Yönetici:</strong> admin@osgb.com
          </p>
          <p style={{ cursor: 'pointer' }} onClick={() => fillDemo('expert')}>
            <strong>İGU Uzman:</strong> uzman@osgb.com
          </p>
          <p style={{ cursor: 'pointer' }} onClick={() => fillDemo('doctor')}>
            <strong>İşyeri Hekimi:</strong> hekim@osgb.com
          </p>
          <p style={{ cursor: 'pointer' }} onClick={() => fillDemo('client')}>
            <strong>Firma Yetkilisi:</strong> firma@osgb.com
          </p>
          <p style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            Hesaba tıklayarak bilgileri otomatik doldurun
          </p>
        </div>
      </div>
    </div>
  )
}
