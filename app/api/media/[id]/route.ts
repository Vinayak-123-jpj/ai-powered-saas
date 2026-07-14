import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const body = await request.json();
    const { 
      title, 
      description, 
      isFavorite, 
      folderId, 
      summary, 
      tags, 
      category, 
      publicShare, 
      shareExpiresAt 
    } = body;

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (folderId !== undefined) updateData.folderId = folderId; // can be null
    if (summary !== undefined) updateData.summary = summary;
    if (tags !== undefined) updateData.tags = tags;
    if (category !== undefined) updateData.category = category;
    if (publicShare !== undefined) updateData.publicShare = publicShare;
    if (shareExpiresAt !== undefined) updateData.shareExpiresAt = shareExpiresAt ? new Date(shareExpiresAt) : null;

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: updateData,
      include: { folder: true },
    });

    // Create activity logs for significant edits
    if (isFavorite !== undefined) {
      await prisma.activity.create({
        data: {
          action: isFavorite ? "FAVORITE" : "UNFAVORITE",
          details: `${isFavorite ? "Starred" : "Unstarred"} asset "${updatedVideo.title}"`,
        },
      });
    }

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    console.error("Update asset error:", error);
    return NextResponse.json(
      { error: "Failed to update media asset" },
      { status: 500 }
    );
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
    // Find video in Prisma
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        video.publicId,
        { resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Delete from Prisma
    await prisma.video.delete({
      where: { id },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        action: "DELETE",
        details: `Deleted asset "${video.title}"`,
      },
    });

    return NextResponse.json({ message: "Asset deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete asset error:", error);
    return NextResponse.json(
      { error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
