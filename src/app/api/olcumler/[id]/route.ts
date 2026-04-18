import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const m = await prisma.periodicMeasurement.update({ where: { id: params.id }, data: {
      measurementType: body.measurementType,
      measurementDate: new Date(body.measurementDate),
      performedBy: body.performedBy || '',
      accreditationNo: body.accreditationNo || null,
      results: body.results ? { value: body.results } : Prisma.JsonNull,
      limitValues: body.limitValues ? { value: body.limitValues } : Prisma.JsonNull,
      exceededLimits: body.exceededLimits ?? false,
      nextMeasurementDate: body.nextMeasurementDate ? new Date(body.nextMeasurementDate) : null,
    }})
    return NextResponse.json(m)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.periodicMeasurement.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
