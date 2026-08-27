import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { Spinner } from '@/components/ui/Spinner'
import type { UserRole } from '@/types'

interface RequireRoleProps {
  roles?: UserRole[]
}

/** Route guard - the API is always the real authority (cahier §21); this
 * only avoids flashing protected UI before the redirect happens. */
export function RequireRole({ roles }: RequireRoleProps) {
  const { isLoading } = useCurrentUser()
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={28} className="text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
