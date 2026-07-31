import { getAllGear, type GearListQueryParams } from "../_actions/gear.action"
import { GearGridClient } from "./gear-grid-client"

interface GearGridProps {
  query?: GearListQueryParams
}

export async function GearGrid({ query = {} }: GearGridProps) {
  const gears = await getAllGear(query)

  console.log("GEARS:", gears)

  return <GearGridClient items={gears.data} />
}