import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const incidents = await prisma.nearMissIncident.findMany({
      select: { id: true, firmId: true, incidentDate: true, incidentTime: true, location: true, description: true, hazardType: true, potentialSeverity: true, immediateActions: true, rootCause: true, correctiveActions: true, correctiveStatus: true, createdAt: true, firm: { select: { id: true, name: true } }, expert: { select: { name: true } } },
      orderBy: { incidentDate: 'desc' },
    })
    return NextResponse.json(incidents)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.description || !body.hazardType) {
      return NextResponse.json({ error: 'Firma, açıklama ve tehlike türü zorunludur' }, { status: 400 })
    }
    const incident = await prisma.nearMissIncident.create({
      data: {
        firmId: body.firmId, expertId: body.expertId || null,
        incidentDate: new Date(body.incidentDate || Date.now()),
        incidentTime: body.incidentTime || null, location: body.location || null,
        description: body.description, hazardType: body.hazardType,
        potentialSeverity: body.potentialSeverity || null,
        immediateActions: body.immediateActions || null,
        rootCause: body.rootCause || null, rootCauseMethod: body.rootCauseMethod || null,
        correctiveActions: body.correctiveActions || null,
      },
      select: { id: true }
    })
    return NextResponse.json(incident, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
