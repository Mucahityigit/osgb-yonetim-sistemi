const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.fucbctbywephfokuonmv:Mucahit.Yigit.4416@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres" // fallback
    }
  }
})

async function main() {
  console.log('Seeding demo verileri...')

  // Clean up
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // 1. Create Organizations
  const org1 = await prisma.organization.create({
    data: {
      id: 'org-1',
      name: 'ABC İnşaat A.Ş.',
      taxNumber: '1234567890',
      sgkNo: 'SGK-001',
      naceCode: '41.20',
      riskClass: 'C',
      address: 'Ataşehir, İstanbul',
      city: 'İstanbul',
      district: 'Ataşehir',
      employeeCount: 120,
      contactName: 'Ali Demir',
      contactPhone: '0212 555 0001',
      contactEmail: 'ali@abcinsaat.com',
      isActive: true,
      isgKatipStatus: 'SYNCED',
    }
  })

  const org2 = await prisma.organization.create({
    data: {
      id: 'org-2',
      name: 'XYZ Metal Sanayi',
      taxNumber: '0987654321',
      sgkNo: 'SGK-002',
      naceCode: '24.10',
      riskClass: 'C',
      address: 'Gebze, Kocaeli',
      city: 'Kocaeli',
      district: 'Gebze',
      employeeCount: 80,
      contactName: 'Veli Şahin',
      contactPhone: '0262 555 0002',
      contactEmail: 'veli@xyzmetal.com',
      isActive: true,
      isgKatipStatus: 'PENDING',
    }
  })

  // 2. Create Users
  const passwordHashAdmin = await bcrypt.hash('Admin123!@#$%', 10)
  await prisma.user.create({
    data: {
      id: 'demo-admin',
      email: 'admin@osgb.com',
      name: 'Yönetici Admin',
      passwordHash: passwordHashAdmin,
      role: 'ADMIN',
    }
  })

  const passwordHashExpert = await bcrypt.hash('Uzman123!@#$%', 10)
  const expert = await prisma.user.create({
    data: {
      id: 'demo-expert',
      email: 'uzman@osgb.com',
      name: 'Ahmet Yılmaz',
      passwordHash: passwordHashExpert,
      role: 'EXPERT',
      organizationId: org1.id
    }
  })

  const passwordHashDoctor = await bcrypt.hash('Hekim123!@#$%', 10)
  await prisma.user.create({
    data: {
      id: 'demo-doctor',
      email: 'hekim@osgb.com',
      name: 'Dr. Zeynep Acar',
      passwordHash: passwordHashDoctor,
      role: 'DOCTOR',
      organizationId: org1.id
    }
  })

  const passwordHashClient = await bcrypt.hash('Firma123!@#$%', 10)
  await prisma.user.create({
    data: {
      id: 'demo-client',
      email: 'firma@osgb.com',
      name: 'Kemal Şen',
      passwordHash: passwordHashClient,
      role: 'CLIENT',
      organizationId: org2.id
    }
  })

  // 3. Create Sample Visits
  await prisma.siteVisit.create({
    data: {
      firmId: org1.id,
      expertId: expert.id,
      visitDate: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours
      durationMinutes: 120,
      visitType: 'PERIODIC_CONTROL',
      description: 'Aylık periyodik kontrol yapıldı.',
    }
  })

  // 4. Create Sample Employee
  const employee = await prisma.employee.create({
    data: {
      firmId: org1.id,
      tcNo: '11111111111',
      name: 'Hasan Yılmaz',
      startDate: new Date(),
      employmentType: 'FULL_TIME',
    }
  })

  // 5. Create Accident
  await prisma.workAccident.create({
    data: {
      firmId: org1.id,
      expertId: expert.id,
      accidentDate: new Date(),
      accidentTime: '14:30',
      location: 'Şantiye Saha A',
      injuredEmployeeId: employee.id,
      injuredName: 'Hasan Yılmaz',
      accidentType: 'FALL',
      description: 'Yüksekten düşme vakası.',
      severity: 'OUTPATIENT',
      sgkDeadline: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      status: 'OPEN',
    }
  })

  console.log('Seed tamamlandı!')
}

main()
  .catch((e) => {
    require('fs').writeFileSync('seed_error.json', JSON.stringify({m: e.message, s: e.stack}, null, 2))
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
