import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      select: { id: true, firmId: true, contractType: true, startDate: true, endDate: true, monthlyFee: true, paymentTerms: true, isActive: true, isgKatipRef: true, createdAt: true, firm: { select: { id: true, name: true } } },
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(contracts)
  } catch (error) {
    console.error('API GET Contracts Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.contractType || !body.startDate || !body.endDate || !body.monthlyFee) {
      return NextResponse.json({ error: 'Firma, tür, tarihler ve ücret zorunludur' }, { status: 400 })
    }
    const contract = await prisma.contract.create({
      data: {
        firmId: body.firmId, contractType: body.contractType,
        startDate: new Date(body.startDate), endDate: new Date(body.endDate),
        monthlyFee: parseFloat(body.monthlyFee) || 0,
        paymentTerms: body.paymentTerms || null, isgKatipRef: body.isgKatipRef || null,
      },
      select: { id: true, contractType: true }
    })
    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('API POST Contracts Error:', error)
    return NextResponse.json({ error: 'Sözleşme oluşturma hatası' }, { status: 500 })
  }
}
