

import { getGearDetailsById } from "@/fearture/gear/_actions/gearDetails.action"
import { getReviewById } from "@/fearture/gear/_actions/getReviewByid.action"
import { GearDetails } from "@/fearture/gear/components/gear/gear-details"



  

export default async function PagearIdPagege({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const gear = await getGearDetailsById(id)
  const reviews = await getReviewById(id)

  return (
    
    <div className='pt-30'>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <GearDetails
        gear={gear}
        reviews={reviews}
      />

    </div>

    </div>
  )
}