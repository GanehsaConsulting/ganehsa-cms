import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("P4ssw0rd", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@cms.com" },
    update: {},
    create: {
      name: "Rafly",
      email: "admin@cms.com",
      password: hashedPassword,
      role: "SUPER ADMIN",
    },
  })

  console.log("✅ Seeding selesai:", admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
