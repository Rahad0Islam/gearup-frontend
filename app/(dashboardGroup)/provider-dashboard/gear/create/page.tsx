import React from "react"
import { ProviderGearView } from "@/fearture/provider/components/provider-gear-view"
import {
  getCategoriesAction,
 getAllGearbyProvider,
} from "@/fearture/provider/actions/gear.action"
import getme from "@/app/(authGroup)/_actions/getCurrentUser";

export default async function CreateGearPage() {
    const provider = await getme();
  const id = provider?.data?.id  
  const [categoriesResult, gearsResult] = await Promise.all([
    getCategoriesAction(),
    getAllGearbyProvider(id),
  ])

  const initialCategories = categoriesResult.success ? categoriesResult.data : []
  const initialGears = gearsResult.success ? gearsResult.data : []

  return (
    <ProviderGearView
      initialGears={initialGears}
      initialCategories={initialCategories}
      defaultOpenCreate={true}
    />
  )
}