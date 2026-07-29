export type PaymentType = "RENTAL" | "LATE_FEE"
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "CANCELLED"

export interface PaymentRecord {
  id: string
  amount: number
  paymentDate: string
  paymentMethod: string
  status: PaymentStatus
  checkOutSessionId: string
  transactionId: string
  paymentType: PaymentType
  createdAt: string
  updatedAt: string
  rentalOrderId: string
  customerId: string
}

export interface PaymentMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface PaymentHistoryResponse {
  success: boolean
  statuscode: number
  message: string
  data: PaymentRecord[]
  meta: PaymentMeta
}

export interface PaymentQueryParams {
  paymentType?: string
  status?: string
  paymentMethod?: string
  page?: number
  limit?: number
  customerId?: string
}