import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { socialMediaPackagesData, websitePackagesData } from './seedData'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seeding...\n")

  // Seed Users
  console.log("👤 Seeding users...")
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
      update: {},
      create: user,
    })
    console.log(`✅ User created or already exists: ${createdUser.email}`)
  }

  // Seed Website Development Packages
  console.log("\n📦 Seeding Website Development packages...")
  
  for (const pkg of websitePackagesData) {
    // Calculate priceOriginal
    const priceOriginal = pkg.discount > 0 
      ? Math.round(pkg.price / (1 - pkg.discount / 100))
      : pkg.price

    try {
      const createdPackage = await prisma.package.create({
        data: {
          serviceId: pkg.serviceId,
          type: pkg.type,
          highlight: pkg.highlight,
          price: pkg.price,
          discount: pkg.discount,
          priceOriginal: priceOriginal,
          link: pkg.link,
          features: {
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature }
                }
              }
            }))
          }
        }
      })
      console.log(`✅ Package created: ${createdPackage.type}`)
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`)
      console.error(error)
    }
  }

  // Seed Social Media Packages
  console.log("\n📦 Seeding Socmed Management packages...")
  
  for (const pkg of socialMediaPackagesData) {
    // Calculate priceOriginal
    const priceOriginal = pkg.discount > 0 
      ? Math.round(pkg.price / (1 - pkg.discount / 100))
      : pkg.price

    try {
      const createdPackage = await prisma.package.create({
        data: {
          serviceId: pkg.serviceId,
          type: pkg.type,
          highlight: pkg.highlight,
          price: pkg.price,
          discount: pkg.discount,
          priceOriginal: priceOriginal,
          link: pkg.link,
          features: {
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature }
                }
              }
            }))
          }
        }
      })
      console.log(`✅ Package created: ${createdPackage.type}`)
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`)
      console.error(error)
    }
  }

  console.log("\n🎉 Seeding completed successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })