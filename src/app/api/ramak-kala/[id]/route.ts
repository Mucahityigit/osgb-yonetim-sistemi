import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const i = await prisma.nearMissIncident.findUnique({ where: { id: params.id }, include: { firm: { select: { name: true } } } })
    if (!i) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json(i)
  } catch { return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const i = await prisma.nearMissIncident.update({ where: { id: params.id }, data: {
      incidentDate: new Date(body.incidentDate), incidentTime: body.incidentTime || null,
      location: body.location || null, description: body.description, hazardType: body.hazardType,
      potentialSeverity: body.potentialSeverity || null, immediateActions: body.immediateActions || null,
      rootCause: body.rootCause || null, correctiveActions: body.correctiveActions || null,
      correctiveStatus: body.correctiveStatus || 'OPEN',
    }})
    return NextResponse.json(i)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.nearMissIncident.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
