import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = [
    {
      name: "Admin",
      email: "admin@cms.com",
      password: await bcrypt.hash("P4ssw0rd", 10),
      role: Role.SUPER_ADMIN,
    },
    { 
      name: "Gevira",
      email: "gevira@cms.com",
      password: await bcrypt.hash("ganesha2025!", 10),
      role: Role.ADMIN
    },
    { 
      name: "Guntur",
      email: "guntur@cms.com",
      password: await bcrypt.hash("ganesha2025!", 10),
      role: Role.ADMIN
    },
  ]

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {}, // tidak update kalau sudah ada
      create: user, // buat kalau belum ada
    })
    console.log(`✅ User created or already exists: ${createdUser.email}`)
  }

  console.log("\n🎉 Seeding users selesai.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
