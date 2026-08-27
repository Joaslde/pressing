import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function useToast() {
  const push = useToastStore((s) => s.push)
  return {
    success: (title: string, description?: string) => push({ title, description, tone: 'success' }),
    error: (title: string, description?: string) => push({ title, description, tone: 'error' }),
    info: (title: string, description?: string) => push({ title, description, tone: 'info' }),
  }
}
