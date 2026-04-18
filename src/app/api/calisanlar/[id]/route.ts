import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const emp = await prisma.employee.findUnique({ where: { id: params.id }, include: { firm: { select: { id: true, name: true } } } })
    if (!emp) return NextResponse.json({ error: 'Çalışan bulunamadı' }, { status: 404 })
    return NextResponse.json(emp)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const emp = await prisma.employee.update({
      where: { id: params.id },
      data: {
        firmId: body.firmId, tcNo: body.tcNo, name: body.name, gender: body.gender || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        department: body.department || null, jobTitle: body.jobTitle || null,
        startDate: new Date(body.startDate), employmentType: body.employmentType || 'FULL_TIME',
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json(emp)
  } catch (error) {
    console.error('API PUT Employee Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
