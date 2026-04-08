'use client'
import { Icon } from '@/components/layout/Sidebar'

export default function AyarlarPage() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: 20 }}>
        {/* OSGB Bilgileri */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>🏢 OSGB Firma Bilgileri</h3>
          <div className="form-group"><label className="form-label">OSGB Adı</label><input className="form-input" defaultValue="Güvenli İş OSGB Ltd. Şti." /></div>
          <div className="form-group"><label className="form-label">Vergi No</label><input className="form-input" defaultValue="1234567890" /></div>
          <div className="form-group"><label className="form-label">Adres</label><textarea className="form-textarea" rows={2} defaultValue="İstanbul, Türkiye" /></div>
          <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" defaultValue="0212 555 0000" /></div>
          <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" defaultValue="info@guvenliis-osgb.com" /></div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}><Icon name="CheckCircle" size={16} /> Kaydet</button>
        </div>

        {/* Güvenlik Ayarları */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>🔒 Güvenlik Ayarları</h3>
          <div className="form-group"><label className="form-label">MFA (Çok Faktörlü Doğrulama)</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>Admin ve uzman rolleri için zorunlu</span></div></div>
          <div className="form-group"><label className="form-label">Oturum Süresi (dakika)</label><input className="form-input" type="number" defaultValue={60} /><span className="form-hint">JWT token geçerlilik süresi</span></div>
          <div className="form-group"><label className="form-label">Hesap Kilitleme Eşiği</label><input className="form-input" type="number" defaultValue={5} /><span className="form-hint">Başarısız giriş sonrası kilitleme</span></div>
          <div className="form-group"><label className="form-label">Kilitleme Süresi (dakika)</label><input className="form-input" type="number" defaultValue={15} /></div>
          <div className="form-group"><label className="form-label">Şifre Değişim Hatırlatma (gün)</label><input className="form-input" type="number" defaultValue={90} /></div>
          <div className="form-group"><label className="form-label">Minimum Şifre Uzunluğu</label><input className="form-input" type="number" defaultValue={12} /></div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}><Icon name="CheckCircle" size={16} /> Güncelle</button>
        </div>

        {/* Bildirim Ayarları */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>🔔 Bildirim Ayarları</h3>
          <div className="form-group"><label className="form-label">E-posta Bildirimleri</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>Aktif</span></div></div>
          <div className="form-group"><label className="form-label">SMS Bildirimleri (Yalnızca Kritik)</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>Aktif</span></div></div>
          <div className="form-group"><label className="form-label">Sözleşme Bitiş Uyarısı (gün önce)</label><input className="form-input" type="number" defaultValue={30} /></div>
          <div className="form-group"><label className="form-label">RD Vadesi Uyarısı (gün önce)</label><input className="form-input" type="number" defaultValue={60} /></div>
          <div className="form-group"><label className="form-label">Eğitim Tazeleme Uyarısı (gün önce)</label><input className="form-input" type="number" defaultValue={60} /></div>
          <div className="form-group"><label className="form-label">Muayene Hatırlatma (gün önce)</label><input className="form-input" type="number" defaultValue={30} /></div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}><Icon name="CheckCircle" size={16} /> Kaydet</button>
        </div>

        {/* KVKK */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>📋 KVKK Uyumluluk</h3>
          <div className="alert alert-warning" style={{ marginBottom: 16 }}><Icon name="AlertTriangle" size={16} /><div>6698 Sayılı Kanun kapsamında kişisel verilerin korunması gereksinimlerini karşılamalısınız.</div></div>
          <div className="form-group"><label className="form-label">Açık Rıza Onayı</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>Sağlık verileri için zorunlu rıza</span></div></div>
          <div className="form-group"><label className="form-label">Veri Şifreleme</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>AES-256 ile depolama şifreleme</span></div></div>
          <div className="form-group"><label className="form-label">İhlal Bildirimi</label><div className="form-checkbox"><input type="checkbox" defaultChecked /><span>72 saat içinde bildirim mekanizması</span></div></div>
          <div className="form-group"><label className="form-label">Audit Log Saklama (yıl)</label><input className="form-input" type="number" defaultValue={2} /></div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}><Icon name="CheckCircle" size={16} /> Kaydet</button>
        </div>

        {/* Dil ve Tema */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>🎨 Görünüm ve Dil</h3>
          <div className="form-group"><label className="form-label">Dil</label><select className="form-select"><option>Türkçe (TR)</option><option>English (EN)</option></select></div>
          <div className="form-group"><label className="form-label">Tema</label><select className="form-select"><option>Koyu (Dark)</option><option>Açık (Light)</option><option>Sistem Tercihi</option></select></div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}><Icon name="CheckCircle" size={16} /> Kaydet</button>
        </div>

        {/* Entegrasyonlar */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>🔗 Entegrasyonlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'İSG-KATİP', status: 'Asistif Entegrasyon', connected: true },
              { name: 'SGK e-Bildirge', status: 'XML Çıktı Desteği', connected: true },
              { name: 'Medula (e-Reçete)', status: 'Yapılandırılmadı', connected: false },
              { name: 'SendGrid (E-posta)', status: 'Aktif', connected: true },
              { name: 'Netgsm (SMS)', status: 'Yapılandırılmadı', connected: false },
            ].map((int, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{int.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{int.status}</div></div>
                <span className={`badge ${int.connected ? 'badge-success' : 'badge-default'}`}>{int.connected ? 'Bağlı' : 'Bağlı Değil'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
