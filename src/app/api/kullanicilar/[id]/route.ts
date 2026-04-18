import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, phone: true, certificateType: true, isActive: true, lastLogin: true, organizationId: true, createdAt: true }
    })
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    return NextResponse.json(user)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {
      name: body.name,
      email: body.email,
      role: body.role,
      phone: body.phone || null,
      certificateType: body.certificateType || null,
      isActive: body.isActive,
    }
    if (body.password) {
      data.passwordHash = await bcrypt.hash(body.password, 12)
    }
    const user = await prisma.user.update({ where: { id: params.id }, data, select: { id: true, name: true, email: true, role: true } })
    return NextResponse.json(user)
  } catch (error) {
    console.error('API PUT Users Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
