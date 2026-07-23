import { Liveblocks } from "@liveblocks/node";
import { auth, clerkClient } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const groupIds = orgId ? [orgId] : [];

  const { status, body } = await liveblocks.identifyUser(
    {
      userId,
      groupIds,
      organizationId: orgId,
    },
    {
      userInfo: {
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress ?? "",
        avatar: user.imageUrl ?? "",
      },
    }
  );

  return new Response(body, { status });
}
