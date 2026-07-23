import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userIds }: { userIds: string[] } = await request.json();

  if (!Array.isArray(userIds)) {
    return Response.json({ error: "userIds must be an array" }, { status: 400 });
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({
    userId: userIds,
    organizationId: [orgId],
  });

  const usersById = new Map(users.map((u) => [u.id, u]));

  const resolved = userIds.map((id) => {
    const user = usersById.get(id);
    if (!user) {
      return null;
    }
    return {
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Anonymous",
      avatar: user.imageUrl,
    };
  });

  return Response.json(resolved);
}
