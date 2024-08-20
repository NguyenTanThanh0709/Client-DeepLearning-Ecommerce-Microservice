import { Product } from './product.type'

export type PurchaseStatus = '-1' | 'waitForConfirmation' | 'waitForGetting' | 'inProgress' | 'delivered' | 'cancelled' | 'refund' | 'indelevered'

export type PurchaseListStatus = PurchaseStatus

export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: PurchaseStatus
  user: string
  createdAt: string
  updatedAt: string
  id_size_quantity_color: number
  
  product: Product
}

export interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}
