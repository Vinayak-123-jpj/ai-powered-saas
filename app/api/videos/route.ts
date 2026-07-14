import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { syncUser } from "@/lib/syncUser"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest){
    try {
        await syncUser();

        const videos = await prisma.video.findMany({
            orderBy: {createdAt: "desc"},
            include: { folder: true }
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({error: "Error fetching videos"}, {status: 500})
    }
}
