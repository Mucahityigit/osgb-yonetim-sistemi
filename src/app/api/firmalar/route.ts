import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const firms = await prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(firms || [])
  } catch (error) {
    console.error('API GET Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name || !body.taxNumber) {
      return NextResponse.json({ error: 'Firma adı ve VKN zorunludur' }, { status: 400 })
    }

    const firm = await prisma.organization.create({
      data: {
        name: body.name,
        taxNumber: body.taxNumber,
        sgkNo: body.sgkNo || '',
        naceCode: body.naceCode || '',
        riskClass: body.riskClass || 'B',
        address: body.address || '',
        city: body.city || '',
        district: body.district || '',
        employeeCount: parseInt(body.employeeCount) || 0,
        contactName: body.contactName || '',
        contactPhone: body.contactPhone || '',
        contactEmail: body.contactEmail || '',
      },
    })
    return NextResponse.json(firm, { status: 201 })
  } catch (error) {
    console.error('API POST Error:', error)
    return NextResponse.json({ error: 'İstek işlenirken hata oluştu' }, { status: 500 })
  }
}
