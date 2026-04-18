import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        certificateType: true, isActive: true, lastLogin: true, createdAt: true,
        organizationId: true,
        _count: { select: { assignments: true } }
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('API GET Users Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, { status: 409 })
    }
    const passwordHash = await bcrypt.hash(body.password, 12)
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role || 'EXPERT',
        phone: body.phone || null,
        certificateType: body.certificateType || null,
      },
      select: { id: true, name: true, email: true, role: true }
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('API POST Users Error:', error)
    return NextResponse.json({ error: 'Kullanıcı oluşturma hatası' }, { status: 500 })
  }
}
