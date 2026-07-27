import { getAllGear } from "../_actions/gear.action"
import { GearGridClient } from "./gear-grid-client"

export async function GearGrid() {
  const gears = await getAllGear()

  console.log("GEARS:", gears)

  return <GearGridClient items={gears.data} />
}