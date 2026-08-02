import { redirect } from "next/navigation"

import getme from "@/app/(authGroup)/_actions/getCurrentUser"
import { ProfileView } from "@/fearture/profile/components/profile-view"
import type { ProfileData } from "@/fearture/profile/actions/profile.action"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const me = await getme()

  if (!me?.success || !me?.data) {
    redirect("/login")
  }

  const user = me.data as ProfileData

  return <ProfileView initialUser={user} />
}