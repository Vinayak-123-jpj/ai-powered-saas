import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedFolder, { status: 200 });
  } catch (error) {
    console.error("Update folder error:", error);
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    await prisma.folder.delete({
      where: { id },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        action: "DELETE_FOLDER",
        details: `Deleted folder "${folder.name}"`,
      },
    });

    return NextResponse.json({ message: "Folder deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete folder error:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
