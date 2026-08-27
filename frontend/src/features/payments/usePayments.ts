import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Payment, PaymentMethod } from '@/types'

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => (await api.get<{ methods: PaymentMethod[] }>('/payments/methods')).data.methods,
    staleTime: 5 * 60_000,
  })
}

interface CheckoutResponse {
  payment_id: number
  checkout: {
    method: PaymentMethod
    mode: 'widget' | 'redirect'
    public_key?: string
    sandbox?: boolean
    amount?: number
    transaction_ref?: string
    payment_url?: string
  }
}

export function useCheckout(orderId: number) {
  return useMutation({
    mutationFn: async (payload: { method: PaymentMethod; amount: number }) =>
      (await api.post<CheckoutResponse>(`/orders/${orderId}/payments/checkout`, payload)).data,
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ paymentId, transactionId }: { paymentId: number; transactionId?: string }) =>
      (
        await api.post<{ payment: Payment }>(`/payments/${paymentId}/verify`, {
          transaction_id: transactionId,
        })
      ).data.payment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
