# X-Pressing — Frontend (React)

Interface web de la plateforme X-Pressing : site public, espace client, espace livreur, espace administrateur. Voir le [README racine](../README.md) pour le démarrage rapide complet, et [`../cahier_des_charges_x_pressing.md`](../cahier_des_charges_x_pressing.md) pour les exigences fonctionnelles.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (tokens de marque définis dans `src/index.css`)
- TanStack Query (état serveur) + Zustand (état d'authentification)
- react-hook-form + zod (formulaires et validation)
- react-router-dom (routage, gardes de rôle dans `src/components/RequireRole.tsx`)
- SDK `kkiapay` pour le paiement (widget côté client, vérification côté backend)

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173, proxifie /api et /sanctum vers le backend Laravel (:8000)
npm run build    # type-check (tsc -b) + build de production
```

## Structure

```
src/
  components/ui/       Bibliothèque de composants réutilisables (Button, Input, Modal, Toast, ...)
  components/layout/   Navbar, Footer, DashboardLayout (sidebar partagée client/livreur/admin)
  features/auth/       Connexion, inscription, mot de passe oublié
  features/public/     Site public (accueil, services, tarifs, comment ça marche, contact)
  features/order-flow/ Parcours de commande multi-étapes (service → paiement)
  features/client/     Espace client (commandes, adresses, profil)
  features/livreur/    Espace livreur (dashboard, missions)
  features/admin/      Espace admin (commandes, clients, livreurs, catalogue)
  lib/                 Client API (axios + CSRF Sanctum), géolocalisation, utilitaires
```

Chaque page de données gère explicitement ses états de chargement (skeletons), vide (`EmptyState`) et d'erreur (`ErrorState`) — voir `src/components/ui/` pour les primitives partagées.
