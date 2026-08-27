import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/features/auth/useAuth'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/services', label: 'Nos services' },
  { to: '/tarifs', label: 'Nos tarifs' },
  { to: '/comment-ca-marche', label: 'Comment ça marche ?' },
  { to: '/contact', label: 'Contact' },
]

const spaceByRole = { client: '/client', livreur: '/livreur', admin: '/admin' } as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout.mutateAsync()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            X
          </span>
          X-Pressing
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to={spaceByRole[user.role]}
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
              >
                {user.first_name}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={logout.isPending}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Link to="/connexion" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
              Se connecter
            </Link>
          )}
          <Button size="sm" onClick={() => navigate('/commander')}>
            Commander
          </Button>
        </div>

        <button
          className="p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Navigation mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-neutral-700"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-neutral-100 pt-3">
              {user ? (
                <>
                  <Link to={spaceByRole[user.role]} onClick={() => setOpen(false)} className="text-sm font-medium">
                    Mon espace
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link to="/connexion" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Se connecter
                </Link>
              )}
              <Button size="sm" onClick={() => { setOpen(false); navigate('/commander') }}>
                Commander
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
