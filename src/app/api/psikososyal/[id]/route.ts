import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const s = await prisma.psychosocialSurvey.update({ where: { id: params.id }, data: { surveyDate: new Date(body.surveyDate), participantCount: parseInt(body.participantCount), stressScore: parseFloat(body.stressScore) || null, burnoutScore: parseFloat(body.burnoutScore) || null, mobbingScore: parseFloat(body.mobbingScore) || null, overallRisk: body.overallRisk || null, actionPlan: body.actionPlan || null } })
    return NextResponse.json(s)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await prisma.psychosocialSurvey.delete({ where: { id: params.id } }); return NextResponse.json({ success: true }) }
  catch { return NextResponse.json({ error: 'Silme hatası' }, { status: 500 }) }
}
