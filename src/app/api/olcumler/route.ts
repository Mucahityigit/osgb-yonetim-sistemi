import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const measurements = await prisma.periodicMeasurement.findMany({
      select: { id: true, firmId: true, measurementType: true, measurementDate: true, performedBy: true, accreditationNo: true, results: true, limitValues: true, exceededLimits: true, nextMeasurementDate: true, createdAt: true, firm: { select: { id: true, name: true } } },
      orderBy: { measurementDate: 'desc' },
    })
    return NextResponse.json(measurements)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.measurementType || !body.measurementDate) {
      return NextResponse.json({ error: 'Firma, ölçüm türü ve tarih zorunludur' }, { status: 400 })
    }
    const m = await prisma.periodicMeasurement.create({
      data: { firmId: body.firmId, measurementType: body.measurementType, measurementDate: new Date(body.measurementDate), performedBy: body.performedBy || '', accreditationNo: body.accreditationNo || null, results: body.results ? { value: body.results } : Prisma.JsonNull, limitValues: body.limitValues ? { value: body.limitValues } : Prisma.JsonNull, exceededLimits: body.exceededLimits ?? false, nextMeasurementDate: body.nextMeasurementDate ? new Date(body.nextMeasurementDate) : null },
      select: { id: true }
    })
    return NextResponse.json(m, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
