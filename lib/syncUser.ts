import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Check if user already exists in Prisma DB
    let dbUser = await prisma.user.findUnique({
      where: { id: clerkUser.id },
    });

    // If not, create automatically
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || `user-${clerkUser.id}@mediapilot.ai`,
        },
      });

      // Log onboarding activity
      await prisma.activity.create({
        data: {
          action: "ONBOARDING",
          details: `New pilot user registered: ${dbUser.email}`,
        },
      });
    }

    return dbUser;
  } catch (error) {
    console.error("Error in syncUser helper:", error);
    return null;
  }
}
