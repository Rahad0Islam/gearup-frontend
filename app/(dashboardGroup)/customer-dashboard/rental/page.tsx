import { getRentalOrder } from "@/fearture/rental-order/actions/getRentalOrder.action"
import { RentalList } from "@/fearture/rental-order/components/rental-list"


// export const metadata = {
//   title: "My Rentals | GearUp",
//   description: "View and manage your gear rental orders.",
// }

export default async function CustomerRentalsPage() {
   const response = await getRentalOrder()
   const orders =  response || []
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <RentalList initialOrders={orders} />
    </div>
  )
}

// import { getRentalOrder } from "../actions/getRentalOrder.action"
// import { RentalList } from "./rental-list"

// export default async function Page() {
//   const response = await getRentalOrder()
  
//   // Extract data if wrapped inside { success, data }
//   const orders = response?.data || response || []

//   return <RentalList initialOrders={orders} />
// }