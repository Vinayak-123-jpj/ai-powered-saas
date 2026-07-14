import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Fallback metadata generator matching content categories
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

  // Refined title
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
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, id } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const metadata = generateMockMetadata(title, description);

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Failed to generate AI metadata" }, { status: 500 });
  }
}
