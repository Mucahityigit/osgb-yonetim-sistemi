import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const surveys = await prisma.psychosocialSurvey.findMany({
      select: { id: true, firmId: true, surveyDate: true, participantCount: true, stressScore: true, burnoutScore: true, mobbingScore: true, overallRisk: true, actionPlan: true, createdAt: true },
      orderBy: { surveyDate: 'desc' },
    })
    return NextResponse.json(surveys)
  } catch (error) { console.error(error); return NextResponse.json({ error: 'DB hatası' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.firmId || !body.surveyDate || !body.participantCount) {
      return NextResponse.json({ error: 'Firma, tarih ve katılımcı sayısı zorunludur' }, { status: 400 })
    }
    const s = await prisma.psychosocialSurvey.create({
      data: { firmId: body.firmId, surveyDate: new Date(body.surveyDate), participantCount: parseInt(body.participantCount), stressScore: parseFloat(body.stressScore) || null, burnoutScore: parseFloat(body.burnoutScore) || null, mobbingScore: parseFloat(body.mobbingScore) || null, overallRisk: body.overallRisk || null, actionPlan: body.actionPlan || null },
      select: { id: true }
    })
    return NextResponse.json(s, { status: 201 })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 }) }
}
