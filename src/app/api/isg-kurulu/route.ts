import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const meetings = await prisma.isgCommitteeMeeting.findMany({
      select: { id: true, firmId: true, meetingDate: true, location: true, durationMinutes: true, agenda: true, decisions: true, nextMeetingDate: true, attendance: true, createdAt: true, firm: { select: { id: true, name: true, employeeCount: true } } },
      orderBy: { meetingDate: 'desc' },
    })
    return NextResponse.json(meetings)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.meetingDate || !body.agenda) {
      return NextResponse.json({ error: 'Firma, tarih ve gündem zorunludur' }, { status: 400 })
    }
    const meeting = await prisma.isgCommitteeMeeting.create({
      data: { firmId: body.firmId, meetingDate: new Date(body.meetingDate), location: body.location || null, durationMinutes: parseInt(body.durationMinutes) || null, agenda: body.agenda, decisions: body.decisions || null, nextMeetingDate: body.nextMeetingDate ? new Date(body.nextMeetingDate) : null },
      select: { id: true }
    })
    return NextResponse.json(meeting, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
