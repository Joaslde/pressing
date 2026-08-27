import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/features/auth/useAuth'
import { Button } from '@/components/ui/Button'

export interface DashboardNavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

interface DashboardLayoutProps {
  navItems: DashboardNavItem[]
  spaceLabel: string
}

export function DashboardLayout({ navItems, spaceLabel }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout.mutateAsync()
    navigate('/')
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label={`Navigation ${spaceLabel}`}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white md:flex">
        <Link to="/" className="flex items-center gap-2 px-5 py-5 text-lg font-bold text-neutral-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            X
          </span>
          X-Pressing
        </Link>
        <div className="px-5 pb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
          {spaceLabel}
        </div>
        {nav}
        <div className="border-t border-neutral-100 p-3">
          <div className="mb-2 px-3 text-sm">
            <p className="font-medium text-neutral-900">{user?.full_name}</p>
            <p className="text-neutral-500">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout} isLoading={logout.isPending}>
            Déconnexion
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-neutral-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white">
            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-lg font-bold text-neutral-900">X-Pressing</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {nav}
            <div className="border-t border-neutral-100 p-3">
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu" className="p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-neutral-900">{spaceLabel}</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
