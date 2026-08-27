import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { RequireRole } from '@/components/RequireRole'
import {
  IconClipboard,
  IconHome,
  IconMapPin,
  IconSettings,
  IconTag,
  IconTruck,
  IconUser,
  IconUsers,
} from '@/components/ui/icons'

import { HomePage } from '@/features/public/HomePage'
import { ServicesPage } from '@/features/public/ServicesPage'
import { TarifsPage } from '@/features/public/TarifsPage'
import { HowItWorksPage } from '@/features/public/HowItWorksPage'
import { ContactPage } from '@/features/public/ContactPage'
import { NotFoundPage } from '@/features/public/NotFoundPage'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'

import { OrderFlowPage } from '@/features/order-flow/OrderFlowPage'

import { ClientHomePage } from '@/features/client/ClientHomePage'
import { OrdersListPage } from '@/features/client/OrdersListPage'
import { OrderDetailPage } from '@/features/client/OrderDetailPage'
import { AddressesPage } from '@/features/client/AddressesPage'
import { ProfilePage } from '@/features/client/ProfilePage'

import { LivreurDashboardPage } from '@/features/livreur/DashboardPage'
import { MissionsPage } from '@/features/livreur/MissionsPage'

import { AdminDashboardPage } from '@/features/admin/DashboardPage'
import { AdminOrdersPage } from '@/features/admin/OrdersPage'
import { AdminOrderDetailPage } from '@/features/admin/OrderDetailPage'
import { AdminClientsPage } from '@/features/admin/ClientsPage'
import { AdminClientDetailPage } from '@/features/admin/ClientDetailPage'
import { AdminLivreursPage } from '@/features/admin/LivreursPage'
import { AdminServicesPage } from '@/features/admin/ServicesPage'
import { AdminArticlesPage } from '@/features/admin/ArticlesPage'
import { AdminFeesPage } from '@/features/admin/FeesPage'
import { AdminTimeSlotsPage } from '@/features/admin/TimeSlotsPage'

const clientNav = [
  { to: '/client', label: 'Tableau de bord', icon: <IconHome width={18} height={18} />, end: true },
  { to: '/client/commandes', label: 'Mes commandes', icon: <IconClipboard width={18} height={18} /> },
  { to: '/client/adresses', label: 'Mes adresses', icon: <IconMapPin width={18} height={18} /> },
  { to: '/client/profil', label: 'Mon profil', icon: <IconUser width={18} height={18} /> },
]

const livreurNav = [
  { to: '/livreur', label: 'Tableau de bord', icon: <IconHome width={18} height={18} />, end: true },
  { to: '/livreur/missions', label: 'Mes missions', icon: <IconTruck width={18} height={18} /> },
]

const adminNav = [
  { to: '/admin', label: 'Tableau de bord', icon: <IconHome width={18} height={18} />, end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: <IconClipboard width={18} height={18} /> },
  { to: '/admin/clients', label: 'Clients', icon: <IconUsers width={18} height={18} /> },
  { to: '/admin/livreurs', label: 'Livreurs', icon: <IconTruck width={18} height={18} /> },
  { to: '/admin/services', label: 'Services', icon: <IconSettings width={18} height={18} /> },
  { to: '/admin/articles', label: 'Articles', icon: <IconTag width={18} height={18} /> },
  { to: '/admin/frais', label: 'Frais', icon: <IconTag width={18} height={18} /> },
  { to: '/admin/creneaux', label: 'Créneaux', icon: <IconSettings width={18} height={18} /> },
]

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/tarifs" element={<TarifsPage />} />
        <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
      </Route>

      {/* Order flow - client only */}
      <Route element={<RequireRole roles={['client']} />}>
        <Route path="/commander" element={<OrderFlowPage />} />
      </Route>

      {/* Client space */}
      <Route element={<RequireRole roles={['client']} />}>
        <Route element={<DashboardLayout navItems={clientNav} spaceLabel="Espace client" />}>
          <Route path="/client" element={<ClientHomePage />} />
          <Route path="/client/commandes" element={<OrdersListPage />} />
          <Route path="/client/commandes/:id" element={<OrderDetailPage />} />
          <Route path="/client/adresses" element={<AddressesPage />} />
          <Route path="/client/profil" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Livreur space */}
      <Route element={<RequireRole roles={['livreur']} />}>
        <Route element={<DashboardLayout navItems={livreurNav} spaceLabel="Espace livreur" />}>
          <Route path="/livreur" element={<LivreurDashboardPage />} />
          <Route path="/livreur/missions" element={<MissionsPage />} />
        </Route>
      </Route>

      {/* Admin space */}
      <Route element={<RequireRole roles={['admin']} />}>
        <Route element={<DashboardLayout navItems={adminNav} spaceLabel="Administration" />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/commandes" element={<AdminOrdersPage />} />
          <Route path="/admin/commandes/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/clients" element={<AdminClientsPage />} />
          <Route path="/admin/clients/:id" element={<AdminClientDetailPage />} />
          <Route path="/admin/livreurs" element={<AdminLivreursPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/frais" element={<AdminFeesPage />} />
          <Route path="/admin/creneaux" element={<AdminTimeSlotsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
