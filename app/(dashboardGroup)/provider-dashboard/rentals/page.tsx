import { ProviderRentalView } from "@/fearture/provider/components/provider-order-view"
import { getRentalOrder } from "@/fearture/rental-order/actions/getRentalOrder.action"

export default async function RentalPage() {
  // Fetch orders directly on the server
  const ordersData = await getRentalOrder()

  // Ensure initialOrders is strictly an array
  const initialOrders = Array.isArray(ordersData) ? ordersData : []

  return (
    <div className="w-full">
      <ProviderRentalView initialOrders={initialOrders} />
    </div>
  )
}