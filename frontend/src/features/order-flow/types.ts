export interface OrderFlowState {
  serviceId: number | null
  items: Record<number, number> // article_id -> quantity
  pickupAddressId: number | null
  deliveryAddressId: number | null
  pickupDate: string | null
  timeSlotId: number | null
  notes: string
}

export const initialOrderFlowState: OrderFlowState = {
  serviceId: null,
  items: {},
  pickupAddressId: null,
  deliveryAddressId: null,
  pickupDate: null,
  timeSlotId: null,
  notes: '',
}
