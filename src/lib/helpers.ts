import { PackageFeature } from "@/app/api/packages/[id]/route";
import prisma from "./prisma";

export const combineDateAndTime = (
  selectedDate: Date,
  selectedTime: string
) => {
  if (!selectedDate) return undefined;

  const [hours, minutes, seconds] = selectedTime.split(":").map(Number);
  const combinedDate = new Date(selectedDate);
  combinedDate.setHours(hours, minutes, seconds || 0, 0);

  return combinedDate.toISOString();
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const calculateOriginalPrice = (
  discountedPrice: number,
  discountPercentage: number
) => {
  if (discountPercentage === 0 || discountedPrice === 0) return 0;

  const originalPrice = discountedPrice / (1 - discountPercentage / 100);

  return Math.round(originalPrice / 1000) * 1000;
};

// **OPTIMIZED FUNCTIONS UNTUK MENGHINDARI TIMEOUT**

/**
 * Process features dengan batch operations dan transaction terpisah
 */
export async function processFeatures(packageId: number, features: PackageFeature[]) {
  console.log("🔄 Processing features:", features.length);

  // Filter valid features
  const validFeatures = features.filter((f) => f.feature?.trim());
  console.log(`📝 Valid features to process: ${validFeatures.length}`);

  if (validFeatures.length === 0) {
    // Jika tidak ada features valid, hapus semua existing features
    await prisma.packageFeature.deleteMany({
      where: { packageId },
    });
    console.log("✅ All existing features deleted (no new valid features)");
    return;
  }

  // Gunakan transaction kecil hanya untuk features
  await prisma.$transaction(
    async (tx) => {
      // 1. Delete existing features
      await tx.packageFeature.deleteMany({
        where: { packageId },
      });
      console.log("✅ Existing features deleted");

      // 2. Process features in batches untuk menghindari timeout
      const batchSize = 10;
      for (let i = 0; i < validFeatures.length; i += batchSize) {
        const batch = validFeatures.slice(i, i + batchSize);
        console.log(`🔄 Processing features batch ${i / batchSize + 1}`);

        await Promise.all(
          batch.map(async (f) => {
            const featureName = f.feature.trim();

            // Upsert feature
            const feature = await tx.feature.upsert({
              where: { name: featureName },
              create: { name: featureName },
              update: {},
            });

            // Create package-feature relationship
            await tx.packageFeature.create({
              data: {
                packageId,
                featureId: feature.id,
                status: f.status !== undefined ? f.status : true,
              },
            });
          })
        );

        console.log(`✅ Batch ${i / batchSize + 1} completed`);
      }
    },
    {
      // Set timeout lebih pendek untuk transaction kecil
      timeout: 10000,
    }
  );

  console.log("✅ All features processed successfully");
}

/**
 * Process requirements dengan batch operations dan transaction terpisah
 */
export async function processRequirements(packageId: number, requirements: string[]) {
  console.log("🔄 Processing requirements:", requirements.length);

  // Filter valid requirements
  const validRequirements = requirements.filter((r) => r?.trim());
  console.log(`📝 Valid requirements to process: ${validRequirements.length}`);

  if (validRequirements.length === 0) {
    // Jika tidak ada requirements valid, hapus semua existing requirements
    await prisma.packageRequirement.deleteMany({
      where: { packageId },
    });
    console.log(
      "✅ All existing requirements deleted (no new valid requirements)"
    );
    return;
  }

  // Gunakan transaction kecil hanya untuk requirements
  await prisma.$transaction(
    async (tx) => {
      // 1. Delete existing requirements
      await tx.packageRequirement.deleteMany({
        where: { packageId },
      });
      console.log("✅ Existing requirements deleted");

      // 2. Process requirements in batches
      const batchSize = 10;
      for (let i = 0; i < validRequirements.length; i += batchSize) {
        const batch = validRequirements.slice(i, i + batchSize);
        console.log(`🔄 Processing requirements batch ${i / batchSize + 1}`);

        await Promise.all(
          batch.map(async (r) => {
            const requirementName = r.trim();

            // Upsert requirement
            const requirement = await tx.requirement.upsert({
              where: { name: requirementName },
              create: { name: requirementName },
              update: {},
            });

            // Create package-requirement relationship
            await tx.packageRequirement.create({
              data: {
                packageId,
                requirementId: requirement.id,
              },
            });
          })
        );

        console.log(`✅ Batch ${i / batchSize + 1} completed`);
      }
    },
    {
      timeout: 10000,
    }
  );

  console.log("✅ All requirements processed successfully");
}
