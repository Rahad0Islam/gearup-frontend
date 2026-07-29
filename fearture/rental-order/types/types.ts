// types/rental.ts (or inside your rental-card.tsx)

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "LATE_RETURN"
  | "CANCELLED"

// Wrapper for your API responses
export interface ApiResponse<T> {
  success: boolean
  statuscode: number
  message: string
  data: T
}

export interface GearItem {
  id: string
  name: string
  description?: string
  brand: string
  image: string
  rentPricePerDay: number
  discountPrice?: number
  availableStock?: number
}

export interface RentalOrderItem {
  id: string
  quantity: number
  rentalPricePerDay: number
  discount: number
  daysRented: number
  subtotal: number
  gearItem: GearItem
}

export interface RentalOrder {
  id: string
  pickupDate: string
  returnDate: string
  actualPickupDate?: string | null
  actualReturnDate?: string | null
  status: RentalStatus
  actualRentalPrice: number
  lateFee?: number | null
  lateDays?: number | null // Handled dynamically if missing
  totalDiscount: number
  totalAmount: number
  createdAt: string
  updatedAt: string
  rentalOrderItems: RentalOrderItem[]
  customer?: {
    id: string
    name: string
    email: string
  }
}