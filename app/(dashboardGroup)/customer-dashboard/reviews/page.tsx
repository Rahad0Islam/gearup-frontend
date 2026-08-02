import { getRentalOrder } from "@/fearture/rental-order/actions/getRentalOrder.action"
import { ReviewsView } from "@/fearture/review/components/reviews-view"

export default async function CustomerReviewsPage() {
  const response = await getRentalOrder()
  // Only RETURNED rentals can be reviewed
  const orders = (Array.isArray(response) ? response : []).filter(
    (o: any) => o?.status === "RETURNED"
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ReviewsView initialOrders={orders} />
    </div>
  )
}
