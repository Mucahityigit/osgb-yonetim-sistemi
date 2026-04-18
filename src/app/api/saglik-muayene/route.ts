import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const exams = await prisma.healthExamination.findMany({
      select: { id: true, employeeId: true, firmId: true, examDate: true, examType: true, doctorId: true, result: true, conditions: true, nextExamDate: true, createdAt: true, employee: { select: { name: true, tcNo: true } }, firm: { select: { id: true, name: true } }, doctor: { select: { name: true } } },
      orderBy: { examDate: 'desc' },
    })
    return NextResponse.json(exams)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.employeeId || !body.firmId || !body.examDate || !body.doctorId || !body.result) {
      return NextResponse.json({ error: 'Çalışan, firma, tarih, hekim ve sonuç zorunludur' }, { status: 400 })
    }
    const exam = await prisma.healthExamination.create({
      data: { employeeId: body.employeeId, firmId: body.firmId, examDate: new Date(body.examDate), examType: body.examType || 'PERIODIC', doctorId: body.doctorId, result: body.result, conditions: body.conditions || null, nextExamDate: body.nextExamDate ? new Date(body.nextExamDate) : null },
      select: { id: true }
    })
    return NextResponse.json(exam, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
