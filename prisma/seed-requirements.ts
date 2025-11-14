// -------------------------------------------------------------------------
// SEEDS REQUIREMENTS
// -------------------------------------------------------------------------

import prisma from "@/lib/prisma";

async function updateRequirements() {
  console.log("\n🔄 Updating requirements for existing packages...\n");

  let updated = 0;
  let notFound = 0;
  let errors = 0;

//   for (const pkg of AccountantPackagesData) {
//     try {
//       // Find existing package
//       const existingPackage = await prisma.package.findFirst({
//         where: {
//           serviceId: pkg.serviceId,
//           type: pkg.type,
//         },
//         include: {
//           requirements: true,
//         },
//       });

//       if (!existingPackage) {
//         console.log(`⏭️  Not found: ${pkg.type}`);
//         notFound++;
//         continue;
//       }

//       console.log(`\n📝 Processing: ${pkg.type}`);
//       console.log(`   Package ID: ${existingPackage.id}`);
//       console.log(`   Current requirements: ${existingPackage.requirements.length}`);
//       console.log(`   New requirements: ${pkg.requirements?.length || 0}`);

//       if (!pkg.requirements || pkg.requirements.length === 0) {
//         console.log(`⏭️  No requirements to add`);
//         continue;
//       }

//       // Step 1: Delete existing requirements
//       console.log(`   🗑️  Deleting old requirements...`);
//       const deleted = await prisma.packageRequirement.deleteMany({
//         where: {
//           packageId: existingPackage.id,
//         },
//       });
//       console.log(`   ✅ Deleted ${deleted.count} old requirements`);

//       // Step 2: Create requirements one by one with delay
//       console.log(`   ➕ Adding new requirements...`);
//       let addedCount = 0;

//       for (const reqName of pkg.requirements) {
//         try {
//           // Ensure the requirement exists
//           const requirement = await prisma.requirement.upsert({
//             where: { name: reqName },
//             update: {},
//             create: { name: reqName },
//           });

//           // Create the relation
//           await prisma.packageRequirement.create({
//             data: {
//               packageId: existingPackage.id,
//               requirementId: requirement.id,
//             },
//           });

//           addedCount++;
//           console.log(`      ✓ ${reqName}`);

//           // Add small delay to prevent overwhelming the engine
//           await new Promise(resolve => setTimeout(resolve, 50));

//         } catch (reqError) {
//           console.log(`      ✗ Failed: ${reqName}`);
//           console.error(`      Error:`, reqError);
//         }
//       }

//       console.log(`   ✅ Added ${addedCount}/${pkg.requirements.length} requirements`);
//       updated++;

//       // Add delay between packages
//       await new Promise(resolve => setTimeout(resolve, 100));

//     } catch (error) {
//       console.log(`\n❌ Error processing: ${pkg.type}`);
//       console.error(error);
//       errors++;

//       // Try to reconnect Prisma if engine crashed
//       try {
//         await prisma.$disconnect();
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         await prisma.$connect();
//       } catch (reconnectError) {
//         console.error("Failed to reconnect:", reconnectError);
//       }
//     }
//   }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Not found: ${notFound}`);
  console.log(`   ❌ Errors: ${errors}`);
}

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    await updateRequirements();

    await prisma.$disconnect();
    console.log("\n🎉 Update completed!");
  } catch (e) {
    console.error("\n❌ Update failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
