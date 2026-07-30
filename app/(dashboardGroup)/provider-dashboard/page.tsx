import React from 'react'
import { ProviderGearView } from '@/fearture/provider/components/provider-gear-view'
import {
  getAllGearbyProvider,
  getCategoriesAction,
} from '@/fearture/provider/actions/gear.action'
import { cookies } from 'next/dist/server/request/cookies'
import getme from '@/app/(authGroup)/_actions/getCurrentUser'


const ProviderPage = async () => {
  // Fetch categories and provider gear items concurrently on the server
  const provider = await getme();
  const id = provider?.data?.id  
  const [categoriesResult, gearsResult] = await Promise.all([
    getCategoriesAction(),
    getAllGearbyProvider(id),
  ])

  const initialCategories = categoriesResult.success ? categoriesResult.data : []
  const initialGears = gearsResult.success ? gearsResult.data : []

  return (
    <div>
      <ProviderGearView
        initialGears={initialGears}
        initialCategories={initialCategories}
      />
    </div>
  )
}

export default ProviderPage