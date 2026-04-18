import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true, firmId: true, tcNo: true, name: true, gender: true,
        department: true, jobTitle: true, startDate: true, endDate: true,
        isActive: true, employmentType: true, createdAt: true,
        firm: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error('API GET Employees Error:', error)
    return NextResponse.json({ error: 'DB bağlantı hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.tcNo || !body.name || !body.startDate) {
      return NextResponse.json({ error: 'Firma, TC No, Ad ve İşe Giriş Tarihi zorunludur' }, { status: 400 })
    }
    const employee = await prisma.employee.create({
      data: {
        firmId: body.firmId,
        tcNo: body.tcNo,
        name: body.name,
        gender: body.gender || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        department: body.department || null,
        jobTitle: body.jobTitle || null,
        startDate: new Date(body.startDate),
        employmentType: body.employmentType || 'FULL_TIME',
      },
      select: { id: true, name: true }
    })
    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('API POST Employees Error:', error)
    return NextResponse.json({ error: 'Çalışan oluşturma hatası' }, { status: 500 })
  }
}
