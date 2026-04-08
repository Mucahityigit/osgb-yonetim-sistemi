import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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

  console.log('Seed tamamlandı!')
}

main()
  .catch((e) => {
    console.error('SEED ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
