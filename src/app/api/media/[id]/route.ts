import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const mediaID = await Number(params.id)

    const deletedMedia = await prisma.media.delete({
      where: {
        id: mediaID
      }
    })

    if(!deletedMedia){
      return NextResponse.json({
        status:500,
        success: false,
        message: `failed while deleting media with id ${mediaID}`
      })
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: `delete media with id ${mediaID} successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}
