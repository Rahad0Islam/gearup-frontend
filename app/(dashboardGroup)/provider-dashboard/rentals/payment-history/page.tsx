import { PaymentHistoryView } from "@/fearture/rental-order/components/payment-history-view"

export default function ProviderPaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <PaymentHistoryView
        title="Provider Payment History"
        description="Review rental and fee payments related to your provider activity."
      />
    </div>
  )
}