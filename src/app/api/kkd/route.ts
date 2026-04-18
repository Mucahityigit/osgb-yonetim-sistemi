import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const distributions = await prisma.ppeDistribution.findMany({
      select: { id: true, firmId: true, employeeId: true, ppeType: true, ppeStandard: true, quantity: true, distributionDate: true, distributedBy: true, renewalDate: true, isReturned: true, createdAt: true, firm: { select: { id: true, name: true } }, employee: { select: { name: true } } },
      orderBy: { distributionDate: 'desc' },
    })
    return NextResponse.json(distributions)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.employeeId || !body.ppeType) {
      return NextResponse.json({ error: 'Firma, çalışan ve KKD türü zorunludur' }, { status: 400 })
    }
    const ppe = await prisma.ppeDistribution.create({
      data: { firmId: body.firmId, employeeId: body.employeeId, ppeType: body.ppeType, ppeStandard: body.ppeStandard || null, quantity: parseInt(body.quantity) || 1, distributionDate: new Date(body.distributionDate || Date.now()), distributedBy: body.distributedBy || '', renewalDate: body.renewalDate ? new Date(body.renewalDate) : null },
      select: { id: true }
    })
    return NextResponse.json(ppe, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
