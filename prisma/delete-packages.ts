import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deletePackagesByServiceId(serviceId: number) {
  try {
    console.log(`🗑️  Starting deletion of packages for serviceId: ${serviceId}...`);

    // Ambil semua package yang akan dihapus
    const packagesToDelete = await prisma.package.findMany({
      where: { serviceId },
      select: { id: true, type: true }
    });

    if (packagesToDelete.length === 0) {
      console.log(`✅ No packages found for serviceId: ${serviceId}`);
      return;
    }

    console.log(`📦 Found ${packagesToDelete.length} packages to delete:`);
    packagesToDelete.forEach(pkg => {
      console.log(`   - Package ID: ${pkg.id}, Type: ${pkg.type}`);
    });

    // Hapus semua package beserta relasinya
    // Karena sudah ada onDelete: Cascade di schema, Prisma akan otomatis menghapus:
    // - PackageFeature
    // - PackageRequirement
    // - PackageProject
    const deletedPackages = await prisma.package.deleteMany({
      where: { serviceId }
    });

    console.log(`✅ Successfully deleted ${deletedPackages.count} packages and all related data`);
    console.log(`   Related data deleted automatically:`);
    console.log(`   - PackageFeature (junction table)`);
    console.log(`   - PackageRequirement (junction table)`);
    console.log(`   - PackageProject (junction table)`);

  } catch (error) {
    console.error('❌ Error deleting packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan function
deletePackagesByServiceId(8)
  .then(() => {
    console.log('🎉 Deletion completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Deletion failed:', error);
    process.exit(1);
  });