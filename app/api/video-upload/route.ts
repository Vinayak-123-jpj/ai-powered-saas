import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: any
}
function generateMockMetadata(title: string, description: string | null) {
  const normalizedTitle = title.toLowerCase();
  let category = "General";
  let tags = ["media", "upload"];
  let summary = `This media asset is titled "${title}" and was processed and optimized on MediaPilot AI.`;

  if (normalizedTitle.includes("demo") || normalizedTitle.includes("product") || normalizedTitle.includes("saas")) {
    category = "Product";
    tags = ["product", "demo", "software", "showcase", "saas"];
    summary = `Product demonstration file for "${title}". Explores the primary features and interface design of the software platform.`;
  } else if (normalizedTitle.includes("tutorial") || normalizedTitle.includes("how") || normalizedTitle.includes("guide")) {
    category = "Education";
    tags = ["tutorial", "education", "guide", "walkthrough", "learning"];
    summary = `An instructional educational guide detailing the step-by-step procedure described in "${title}".`;
  } else if (normalizedTitle.includes("marketing") || normalizedTitle.includes("ad") || normalizedTitle.includes("promo")) {
    category = "Marketing";
    tags = ["marketing", "promotional", "ad", "growth", "campaign"];
    summary = `A promotional creative asset compiled for marketing campaigns associated with "${title}".`;
  } else if (normalizedTitle.includes("vacation") || normalizedTitle.includes("trip") || normalizedTitle.includes("travel")) {
    category = "Travel";
    tags = ["travel", "vacation", "explore", "vlog", "lifestyle"];
    summary = `Scenic capture documenting key locations and activities during a travel excursion or vacation trip.`;
  }

  if (description) {
    summary += ` Additional details: ${description}`;
  }

  const cleanTitle = title.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return {
    title: cleanTitle + " (AI Opt)",
    description: description || `Optimized media asset uploaded to MediaPilot AI.`,
    summary,
    category,
    tags
  };
}

export async function POST(request: NextRequest) {
    const {userId} = auth()

    if (!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {

    if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ){
        return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
    }


        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation: [
                            {quality: "auto", fetch_format: "mp4"},
                        ]
                    },
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )
        const metadata = generateMockMetadata(title, description);

        const video = await prisma.video.create({
            data: {
                title: metadata.title,
                description: metadata.description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
                summary: metadata.summary,
                category: metadata.category,
                tags: metadata.tags,
            }
        })

        await prisma.activity.create({
            data: {
                action: "UPLOAD",
                details: `Uploaded and optimized video "${metadata.title}"`,
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("UPload video failed", error)
        return NextResponse.json({error: "UPload video failed"}, {status: 500})
    }
}
