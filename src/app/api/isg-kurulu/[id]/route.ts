import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const m = await prisma.isgCommitteeMeeting.update({ where: { id: params.id }, data: { meetingDate: new Date(body.meetingDate), location: body.location || null, durationMinutes: parseInt(body.durationMinutes) || null, agenda: body.agenda, decisions: body.decisions || null, nextMeetingDate: body.nextMeetingDate ? new Date(body.nextMeetingDate) : null } })
    return NextResponse.json(m)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.isgCommitteeMeeting.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
