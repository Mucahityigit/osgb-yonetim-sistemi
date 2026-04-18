import { prisma } from '@/lib/prisma'
import IsgKuruluClient from './IsgKuruluClient'
export const dynamic = 'force-dynamic'
export default async function IsgKuruluPage() {
  const [meetings, firms] = await Promise.all([
    prisma.isgCommitteeMeeting.findMany({ select: { id: true, firmId: true, meetingDate: true, location: true, durationMinutes: true, agenda: true, decisions: true, nextMeetingDate: true, attendance: true, firm: { select: { id: true, name: true } } }, orderBy: { meetingDate: 'desc' } }),
    prisma.organization.findMany({ select: { id: true, name: true }, where: { isActive: true } })
  ])
  return <IsgKuruluClient initialMeetings={JSON.parse(JSON.stringify(meetings))} initialFirms={JSON.parse(JSON.stringify(firms))} />
}
