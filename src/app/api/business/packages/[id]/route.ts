import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

// Konfigurasi Prisma dengan timeout yang lebih panjang
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Increase timeouts untuk operasi besar
  transactionOptions: {
    maxWait: 45000, // 45 detik
    timeout: 90000, // 90 detik
  },
  // Logging hanya di development
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Helper untuk menghitung harga original
const calculateOriginalPrice = (price: number, discount: number): number => {
  if (discount <= 0 || discount >= 100) return price;
  return Math.round(price / (1 - discount / 100));
};

// Interface untuk update data
interface UpdatePackageData {
  serviceId?: number;
  type?: string;
  price?: number;
  discount?: number;
  link?: string;
  highlight?: boolean;
  features?: Array<{ feature: string; status: boolean }>;
  requirements?: string[];
}

// GET endpoint untuk mengambil data package
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    console.log(`🔍 GET package request for ID:`, (await params).id);

    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt) || packageIdInt <= 0) {
      console.warn(`❌ Invalid package ID: ${id}`);
      return NextResponse.json(
        { 
          success: false, 
          message: "ID package tidak valid",
          code: "INVALID_ID"
        },
        { status: 400 }
      );
    }

    // Ambil data package dengan timeout
    const pkg = await Promise.race([
      prisma.package.findUnique({
        where: { id: packageIdInt },
        include: {
          service: { 
            select: { 
              id: true, 
              name: true, 
              slug: true 
            } 
          },
          features: {
            include: { 
              feature: true 
            },
            orderBy: { 
              feature: { name: "asc" } 
            },
          },
          requirements: {
            include: { 
              requirement: true 
            },
            orderBy: { 
              requirement: { name: "asc" } 
            },
          },
        },
      }),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("Database timeout")), 15000)
      )
    ]) as any;

    if (!pkg) {
      console.log(`❌ Package not found: ${packageIdInt}`);
      return NextResponse.json(
        { 
          success: false, 
          message: "Package tidak ditemukan",
          code: "NOT_FOUND"
        },
        { status: 404 }
      );
    }

    // Format response
    const responseData = {
      id: pkg.id,
      serviceId: pkg.serviceId,
      type: pkg.type,
      price: pkg.price,
      discount: pkg.discount,
      priceOriginal: pkg.priceOriginal,
      link: pkg.link,
      highlight: pkg.highlight,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
      features: pkg.features.map((f: any) => ({
        feature: f.feature.name,
        status: f.status,
      })),
      requirements: pkg.requirements.map((r: any) => r.requirement.name),
      service: pkg.service,
    };

    const duration = Date.now() - startTime;
    console.log(`✅ GET package ${packageIdInt} success in ${duration}ms`);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package berhasil diambil",
      data: responseData,
      meta: {
        took: duration,
        featuresCount: responseData.features.length,
        requirementsCount: responseData.requirements.length,
      },
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ GET /api/packages/[id] error (${duration}ms):`, err);

    let status = 500;
    let message = "Server error";
    let code = "SERVER_ERROR";

    if (err.message.includes("timeout") || err.message.includes("Timeout")) {
      status = 504;
      message = "Database timeout. Silakan coba lagi.";
      code = "TIMEOUT";
    } else if (err.message.includes("Invalid") || err.message.includes("valid")) {
      status = 400;
      message = err.message;
      code = "VALIDATION_ERROR";
    }

    return NextResponse.json(
      {
        success: false,
        message,
        code,
        ...(process.env.NODE_ENV === "development" && { 
          error: err.message,
          stack: err.stack 
        }),
      },
      { status }
    );
  }
}

// PATCH endpoint untuk update package dengan optimasi
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let transaction: any = null;

  try {
    console.log("🔄 Starting PATCH operation for package");

    // Verify authentication
    const user = await verifyAuth(req);
    if (!user) {
      console.warn("❌ Unauthorized access attempt");
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized",
          code: "UNAUTHORIZED"
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const packageIdInt = Number(id);
    console.log(`📦 Updating package ID: ${packageIdInt}`);

    if (isNaN(packageIdInt) || packageIdInt <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "ID package tidak valid",
          code: "INVALID_ID"
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body: UpdatePackageData = await req.json();
    const {
      serviceId,
      type,
      highlight,
      price,
      discount,
      link,
      features = [],
      requirements = [],
    } = body;

    console.log("📨 Received update data:", {
      serviceId,
      type: type?.substring(0, 50) + (type && type.length > 50 ? '...' : ''),
      highlight,
      price,
      discount,
      link: link?.substring(0, 50) + (link && link.length > 50 ? '...' : ''),
      featuresCount: features.length,
      requirementsCount: requirements.length,
    });

    // VALIDASI DATA
    const validationErrors: string[] = [];

    // Validasi serviceId
    if (serviceId !== undefined) {
      if (typeof serviceId !== "number" || serviceId <= 0) {
        validationErrors.push("Service ID harus berupa angka positif");
      } else {
        // Cek apakah service exists (dilakukan dalam transaction)
      }
    }

    // Validasi price
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        validationErrors.push("Price harus berupa angka positif");
      }
    }

    // Validasi discount
    if (discount !== undefined) {
      if (typeof discount !== "number" || discount < 0 || discount > 100) {
        validationErrors.push("Discount harus antara 0 dan 100");
      }
    }

    // Validasi type
    if (type !== undefined && (!type.trim() || type.trim().length > 100)) {
      validationErrors.push("Type harus diisi dan maksimal 100 karakter");
    }

    // Validasi link
    if (link !== undefined && (!link.trim() || link.trim().length > 500)) {
      validationErrors.push("Link harus diisi dan maksimal 500 karakter");
    }

    // Validasi features
    if (features.length > 100) {
      validationErrors.push("Maksimal 100 features diperbolehkan");
    }

    // Validasi requirements
    if (requirements.length > 50) {
      validationErrors.push("Maksimal 50 requirements diperbolehkan");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: validationErrors,
          code: "VALIDATION_FAILED"
        },
        { status: 400 }
      );
    }

    // START TRANSACTION dengan timeout
    console.log("💾 Starting database transaction...");
    
    transaction = await prisma.$transaction(async (tx) => {
      // 1. Cek apakah package exists
      const existingPackage = await tx.package.findUnique({
        where: { id: packageIdInt },
        select: { id: true, serviceId: true, price: true, discount: true }
      });

      if (!existingPackage) {
        throw new Error("Package tidak ditemukan");
      }

      // 2. Cek service jika serviceId diupdate
      if (serviceId !== undefined && serviceId !== existingPackage.serviceId) {
        const serviceExists = await tx.service.findUnique({
          where: { id: serviceId },
          select: { id: true }
        });
        
        if (!serviceExists) {
          throw new Error("Service tidak ditemukan");
        }
      }

      // 3. Prepare update data untuk package
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (serviceId !== undefined) updateData.serviceId = serviceId;
      if (type !== undefined) updateData.type = type.trim();
      if (highlight !== undefined) updateData.highlight = highlight;
      if (link !== undefined) updateData.link = link.trim();
      if (price !== undefined) updateData.price = price;
      if (discount !== undefined) updateData.discount = discount;

      // Calculate priceOriginal jika price atau discount berubah
      const finalPrice = price !== undefined ? price : existingPackage.price;
      const finalDiscount = discount !== undefined ? discount : existingPackage.discount;
      updateData.priceOriginal = calculateOriginalPrice(finalPrice, finalDiscount);

      // 4. Update package data
      console.log("🔄 Updating package basic info...");
      await tx.package.update({
        where: { id: packageIdInt },
        data: updateData,
      });

      // 5. Handle features dengan batch processing
      if (Array.isArray(features)) {
        console.log(`🔄 Processing ${features.length} features...`);
        
        // Hapus semua features lama
        await tx.packageFeature.deleteMany({
          where: { packageId: packageIdInt },
        });

        // Filter features yang valid
        const validFeatures = features.filter(f => 
          f && typeof f === 'object' && 
          f.feature && f.feature.trim() !== ''
        );

        if (validFeatures.length > 0) {
          // Process dalam batch untuk menghindari timeout
          const batchSize = 50;
          const batches = Math.ceil(validFeatures.length / batchSize);

          for (let i = 0; i < batches; i++) {
            const batchStart = i * batchSize;
            const batchEnd = batchStart + batchSize;
            const batch = validFeatures.slice(batchStart, batchEnd);

            // Gunakan Promise.all untuk parallel processing dalam batch
            const featureOperations = batch.map(async (feature) => {
              try {
                // Upsert feature (create if not exists)
                const featureRecord = await tx.feature.upsert({
                  where: { name: feature.feature.trim() },
                  update: {},
                  create: { name: feature.feature.trim() },
                });

                // Connect feature to package
                return tx.packageFeature.create({
                  data: {
                    packageId: packageIdInt,
                    featureId: featureRecord.id,
                    status: feature.status !== undefined ? feature.status : true,
                  },
                });
              } catch (error) {
                console.error(`Error processing feature: ${feature.feature}`, error);
                throw error;
              }
            });

            // Eksekusi batch
            await Promise.all(featureOperations);
            
            console.log(`✅ Processed features batch ${i + 1}/${batches}`);
          }
        }
      }

      // 6. Handle requirements dengan batch processing
      if (Array.isArray(requirements)) {
        console.log(`🔄 Processing ${requirements.length} requirements...`);
        
        // Hapus semua requirements lama
        await tx.packageRequirement.deleteMany({
          where: { packageId: packageIdInt },
        });

        // Filter requirements yang valid
        const validRequirements = requirements.filter(r => 
          r && typeof r === 'string' && r.trim() !== ''
        );

        if (validRequirements.length > 0) {
          // Process dalam batch untuk menghindari timeout
          const batchSize = 50;
          const batches = Math.ceil(validRequirements.length / batchSize);

          for (let i = 0; i < batches; i++) {
            const batchStart = i * batchSize;
            const batchEnd = batchStart + batchSize;
            const batch = validRequirements.slice(batchStart, batchEnd);

            // Gunakan Promise.all untuk parallel processing dalam batch
            const requirementOperations = batch.map(async (requirement) => {
              try {
                // Upsert requirement (create if not exists)
                const requirementRecord = await tx.requirement.upsert({
                  where: { name: requirement.trim() },
                  update: {},
                  create: { name: requirement.trim() },
                });

                // Connect requirement to package
                return tx.packageRequirement.create({
                  data: {
                    packageId: packageIdInt,
                    requirementId: requirementRecord.id,
                  },
                });
              } catch (error) {
                console.error(`Error processing requirement: ${requirement}`, error);
                throw error;
              }
            });

            // Eksekusi batch
            await Promise.all(requirementOperations);
            
            console.log(`✅ Processed requirements batch ${i + 1}/${batches}`);
          }
        }
      }

      // 7. Fetch updated package untuk response
      console.log("🔍 Fetching updated package data...");
      const updatedPackage = await tx.package.findUnique({
        where: { id: packageIdInt },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
            orderBy: {
              feature: {
                name: "asc",
              },
            },
          },
          requirements: {
            include: {
              requirement: true,
            },
            orderBy: {
              requirement: {
                name: "asc",
              },
            },
          },
        },
      });

      if (!updatedPackage) {
        throw new Error("Failed to retrieve updated package");
      }

      // Format response
      return {
        ...updatedPackage,
        features: updatedPackage.features.map((f) => ({
          feature: f.feature.name,
          status: f.status,
        })),
        requirements: updatedPackage.requirements.map((r) => r.requirement.name),
      };
    }, {
      maxWait: 45000,
      timeout: 90000,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Package ${packageIdInt} updated successfully in ${duration}ms`);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package berhasil diupdate",
      data: transaction,
      meta: {
        took: duration,
        updatedAt: new Date().toISOString(),
        featuresCount: transaction.features.length,
        requirementsCount: transaction.requirements.length,
      },
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ PATCH /api/packages/[id] error (${duration}ms):`, err);

    // Rollback transaction jika ada
    if (transaction) {
      try {
        await prisma.$executeRaw`ROLLBACK`;
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    let status = 500;
    let message = "Server error";
    let code = "SERVER_ERROR";

    // Handle specific errors
    if (err.message.includes("Package tidak ditemukan")) {
      status = 404;
      message = "Package tidak ditemukan";
      code = "NOT_FOUND";
    } else if (err.message.includes("Service tidak ditemukan")) {
      status = 404;
      message = "Service tidak ditemukan";
      code = "SERVICE_NOT_FOUND";
    } else if (err.message.includes("timeout") || err.message.includes("Timeout")) {
      status = 504;
      message = "Database operation timed out. Coba lagi dengan data yang lebih sedikit.";
      code = "TIMEOUT";
    } else if (err.message.includes("Unique constraint")) {
      status = 409;
      message = "Data dengan informasi yang sama sudah ada";
      code = "DUPLICATE_DATA";
    } else if (err.message.includes("Foreign key constraint")) {
      status = 400;
      message = "Data referensi tidak valid";
      code = "FOREIGN_KEY_ERROR";
    } else if (err.message.includes("Database") || err.message.includes("Prisma")) {
      message = "Database error. Silakan coba lagi.";
      code = "DATABASE_ERROR";
    }

    return NextResponse.json(
      {
        success: false,
        message,
        code,
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
        meta: {
          took: duration,
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }
}
// ===================== DELETE =====================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    await prisma.package.delete({ where: { id: packageIdInt } });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package deleted successfully",
      data: { id },
    });
  } catch (err) {
    console.error("DELETE /api/packages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
