import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { ImmersiveHome } from "@/components/marketing/immersive-home"

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return <ImmersiveHome />
}
