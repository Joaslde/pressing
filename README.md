# X-Pressing

Application web de pressing avec collecte et livraison à domicile. Voir [`cahier_des_charges_x_pressing.md`](cahier_des_charges_x_pressing.md) pour les exigences complètes.

## Structure du dépôt

- [`backend/`](backend/README.md) — API Laravel 12 (auth par rôles, commandes, paiements Kkiapay/FedaPay, notifications). Voir son README pour le détail de l'architecture.
- [`frontend/`](frontend/) — Application React 18 + TypeScript + Vite + Tailwind (site public, espace client, espace livreur, espace admin).

## Démarrage rapide (développement local)

```bash
# 1. Backend
cd backend
composer install
cp .env.example .env   # renseigner DB_*, KKIAPAY_*, FEDAPAY_*
php artisan key:generate
php artisan migrate --seed
php artisan serve                    # http://localhost:8000

# 2. Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev                          # http://localhost:5173
```

Le serveur Vite proxifie `/api` et `/sanctum` vers `http://localhost:8000` (voir `frontend/vite.config.ts`) — travailler exclusivement via `http://localhost:5173` pendant le développement.

## Comptes de démonstration

Créés par `DemoDataSeeder` (mot de passe : `password` pour tous) :

| Rôle | Email |
|---|---|
| Administrateur | admin@x-pressing.example |
| Livreur | ali.koffi@x-pressing.example |
| Livreur | fatima.sanni@x-pressing.example |
| Client | client@x-pressing.example |

## Paiements

Les clés Kkiapay fournies sont des clés de test/sandbox, à conserver uniquement dans `backend/.env` (jamais commité). FedaPay est intégré mais désactivé côté UI tant que ses clés ne sont pas renseignées.
