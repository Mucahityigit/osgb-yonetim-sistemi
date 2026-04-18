import { prisma } from '@/lib/prisma'
import PsikososyalClient from './PsikososyalClient'
export const dynamic = 'force-dynamic'
export default async function PsikososyalPage() {
  const [surveys, firms] = await Promise.all([
    prisma.psychosocialSurvey.findMany({ select: { id: true, firmId: true, surveyDate: true, participantCount: true, stressScore: true, burnoutScore: true, mobbingScore: true, overallRisk: true, actionPlan: true, createdAt: true }, orderBy: { surveyDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <PsikososyalClient initialSurveys={JSON.parse(JSON.stringify(surveys))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
