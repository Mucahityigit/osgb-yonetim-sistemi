import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const firm = await prisma.organization.findUnique({
      where: { id: params.id },
      include: {
        users: { select: { id: true, name: true, role: true } },
      }
    })
    
    if (!firm) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 })
    }
    
    return NextResponse.json(firm)
  } catch (error) {
    return NextResponse.json({ error: 'DB hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Yalnızca gönderilen alanları güncellemek üzere bir data objesi kuruyoruz
    const data = {
      name: body.name,
      taxNumber: body.taxNumber,
      sgkNo: body.sgkNo,
      naceCode: body.naceCode,
      riskClass: body.riskClass,
      address: body.address,
      city: body.city,
      district: body.district,
      employeeCount: parseInt(body.employeeCount) || 0,
      femaleEmployeeCount: parseInt(body.femaleEmployeeCount) || 0,
      youngEmployeeCount: parseInt(body.youngEmployeeCount) || 0,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
    }

    const updatedFirm = await prisma.organization.update({
      where: { id: params.id },
      data
    })
    
    return NextResponse.json(updatedFirm)
  } catch (error) {
    console.error('API PUT Error:', error)
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.organization.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 })
  }
}
