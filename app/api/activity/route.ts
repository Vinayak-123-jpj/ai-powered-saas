import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { syncUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await syncUser();

    let activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // get last 20 activities
    });

    if (activities.length === 0) {
      await prisma.activity.create({
        data: {
          action: "SYSTEM",
          details: "MediaPilot AI System Initialized",
        },
      });
      // Query again
      activities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Fetch activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}
