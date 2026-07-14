import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { syncUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

// GET folders
export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await syncUser();

    let folders = await prisma.folder.findMany({
      orderBy: { name: "asc" },
      include: { videos: true },
    });

    if (folders.length === 0) {
      // Create a default folder
      await prisma.folder.create({
        data: { name: "Main Vault" },
      });
      // Query again
      folders = await prisma.folder.findMany({
        orderBy: { name: "asc" },
        include: { videos: true },
      });
    }

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Fetch folders error:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

// POST create folder
export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const folder = await prisma.folder.create({
      data: { name: name.trim() },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        action: "CREATE_FOLDER",
        details: `Created folder "${name}"`,
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
