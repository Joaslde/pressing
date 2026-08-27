# X-Pressing — Backend (Laravel API)

API REST pour la plateforme de pressing avec collecte et livraison. Voir `../cahier_des_charges_x_pressing.md` pour les exigences fonctionnelles complètes.

## Stack

- Laravel 12, PHP 8.2+
- MySQL
- Laravel Sanctum (auth SPA par cookie/session)
- Pest pour les tests

## Démarrage local

```bash
composer install
cp .env.example .env   # puis renseigner DB_*, KKIAPAY_*, FEDAPAY_*
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Le seeder `DemoDataSeeder` crée un compte admin, deux livreurs, un client de démo, ainsi que les services/articles/frais/créneaux d'exemple. Mot de passe par défaut de tous les comptes de démo : `password`.

## Mapping des noms (cahier ↔ code)

Le cahier des charges utilise des noms de champs en français ; le code utilise l'anglais (convention Laravel standard). Les libellés affichés à l'utilisateur restent en français (voir les méthodes `label()` des enums dans `app/Enums/`).

| Cahier (FR)          | Code (EN)                          |
|-----------------------|-------------------------------------|
| Client / Livreur      | `users.role` = `client` / `livreur` / `admin` |
| Adresse                | `addresses`                        |
| Commande               | `orders`                           |
| Ligne de commande      | `order_items`                      |
| Paiement                | `payments`                         |
| Affectation             | `assignments`                      |
| Statut de commande (§13) | `App\Enums\OrderStatus`          |
| Statut de paiement (§11.2) | `App\Enums\PaymentStatus` (agrégat par commande) vs `PaymentTransactionStatus` (par transaction) |

## Points d'architecture

- **Paiement** : `App\Services\PaymentService` orchestre les gateways (`App\Services\Payment\{Kkiapay,Fedapay}Gateway`). Un paiement n'est **jamais** confirmé sur la seule foi du frontend — `PaymentService::verify()` réinterroge toujours l'API du fournisseur avant de mettre à jour la commande.
- **Statuts de commande** : toute transition passe par `App\Services\OrderStatusService`, qui applique le graphe défini dans `OrderStatus::allowedNextStatuses()`.
- **Prix** : `App\Services\OrderPricingService` centralise le calcul (fidèle à l'exemple du cahier §10).
- **Cache** : driver `database` en local, bascule vers `redis` en prod via `.env` seul (voir `CACHE_STORE`).
- **Rôles** : middleware `role:admin|livreur|client` (`App\Http\Middleware\EnsureUserHasRole`) + Policies (`app/Policies`) pour l'autorisation au niveau ressource.

## Tests

```bash
php artisan test
# ou
./vendor/bin/pest
```
