# Cahier des charges — Application Web de Pressing avec Collecte et Livraison

## 1. Présentation du projet

### 1.1 Nom du projet

**X-Pressing** 

### 1.2 Objectif

Développer une application web moderne de pressing permettant aux clients de consulter les services et les tarifs, de commander en ligne, de programmer la collecte de leurs vêtements à domicile, de suivre l'évolution de leur commande et de recevoir leurs vêtements par livraison.

L'application comportera également des espaces dédiés aux différents acteurs du système : **client, livreur et administrateur**.

### 1.3 Positionnement de l'application

L'application doit avoir une image :

- Chic
- Moderne
- Professionnelle
- Simple à utiliser
- Attractive
- Adaptée à une clientèle souhaitant commander rapidement un service de pressing à domicile

### 1.4 Identité visuelle

Les couleurs principales du site seront :

- **Orange** : couleur principale, utilisée notamment pour les boutons d'action, les éléments importants et les appels à l'action.
- **Blanc** : couleur dominante pour conserver une interface propre, élégante et lisible.

Des nuances neutres complémentaires peuvent être utilisées pour le texte, les bordures, les arrière-plans secondaires et les états d'interface.

---

# 2. Acteurs du système et gestion des rôles

L'application possède trois principaux types d'utilisateurs :

1. **Client**
2. **Livreur**
3. **Administrateur**

## 2.1 Identification du type d'utilisateur

Il ne faut pas demander à un utilisateur de sélectionner librement son rôle lors de l'inscription, notamment pour éviter qu'un utilisateur puisse se déclarer administrateur ou livreur.

### Client

Le client peut créer son compte directement depuis l'espace public du site.

Par exemple :

**Créer un compte → Compte client**

Après inscription, le système attribue automatiquement le rôle `client`.

### Livreur

Le livreur ne crée pas librement un compte avec le rôle livreur.

Le compte est créé ou activé par l'administrateur.

Le livreur reçoit ensuite ses identifiants ou utilise le processus de connexion prévu par l'application.

### Administrateur

Le compte administrateur est créé de manière sécurisée et n'est pas accessible par l'inscription publique.

### Connexion

La page de connexion peut être commune aux différents acteurs.

Après authentification, le backend Laravel vérifie le rôle associé au compte et redirige automatiquement l'utilisateur vers son espace :

- `client` → espace client
- `livreur` → espace livreur
- `admin` → tableau de bord administrateur

---

# 3. Site public et page d'accueil

La page d'accueil est accessible à **tout le monde sans connexion**.

Il s'agit de la vitrine principale de l'entreprise. Elle doit être particulièrement soignée, professionnelle et attractive.

## 3.1 Contenu de la page d'accueil

La page d'accueil devra notamment présenter :

### Hero section

Une présentation visuelle forte du service avec :

- Une accroche claire
- Une courte présentation
- Un bouton **Commander maintenant**
- Un bouton permettant de découvrir les services

Exemple d'accroche :

> **Votre linge propre, repassé et livré directement chez vous.**

### Présentation des services

Les principaux services sont présentés avec une description claire de chacun.

### Tarifs

Les tarifs principaux peuvent être consultés directement depuis le site public, sans connexion.

Le client doit pouvoir connaître les prix avant de décider de passer une commande.

### Comment ça marche ?

Présenter simplement les étapes :

1. Choisissez votre service
2. Programmez la collecte
3. Nous récupérons vos vêtements
4. Nous les nettoyons et les traitons
5. Nous vous les livrons

### Avantages

Présenter les principaux avantages :

- Collecte à domicile
- Livraison à domicile
- Commande en ligne
- Suivi de commande
- Paiement sécurisé
- Gain de temps

### Appel à l'action

Des boutons **Commander maintenant** doivent être visibles à plusieurs endroits stratégiques.

---

# 4. Parcours de commande

## Étape 1 : Consultation

Le visiteur consulte :

- Les services
- Les descriptions
- Les tarifs
- Les conditions de collecte et de livraison

Aucune connexion n'est nécessaire pour consulter ces informations.

## Étape 2 : Début de commande

Lorsque l'utilisateur clique sur **Commander maintenant**, le système vérifie s'il est authentifié.

### Utilisateur non connecté

Il est invité à :

- Se connecter
- Ou créer un compte client

### Utilisateur déjà connecté

Il accède directement au formulaire de commande.

---

# 5. Création de commande

## 5.1 Sélection du service

Le client sélectionne le type de service.

### Lavage — Lessive à la main

Service destiné aux vêtements nécessitant un lavage effectué manuellement.

La description devra préciser les caractéristiques du service, par exemple :

- Lavage manuel
- Rinçage
- Séchage selon le traitement prévu
- Préparation pour restitution

### Lavage + Repassage

Service comprenant :

- Lavage
- Séchage
- Repassage
- Préparation des vêtements pour livraison

### Repassage uniquement

Le pressing ne réalise pas le lavage.

Le service comprend principalement :

- Réception des vêtements
- Repassage
- Pliage ou préparation
- Restitution au client

### Nettoyage à sec — Lavage en machine

Service destiné aux vêtements nécessitant un traitement en machine.

La description devra expliquer clairement le traitement proposé et les types de vêtements concernés.

> **Important :** les descriptions définitives des services et les prestations réellement incluses devront être validées par le pressing avant la mise en production.

---

# 6. Articles de la commande

Le client ajoute les vêtements à sa commande.

Exemples :

- Chemise
- Pantalon
- Robe
- Costume
- Jupe
- Veste
- Drap
- Autres articles

Pour chaque article :

- Type d'article
- Quantité
- Prix unitaire
- Sous-total

Le système calcule automatiquement le montant estimatif.

---

# 7. Adresse de collecte

Le client doit pouvoir renseigner l'adresse de collecte de plusieurs façons.

## 7.1 Utilisation de la localisation

L'application demande à l'utilisateur l'autorisation d'accéder à sa localisation.

Exemple :

> **Autoriser la localisation pour détecter votre position**

Si l'utilisateur accepte, l'application récupère ses coordonnées géographiques et peut proposer automatiquement une adresse correspondant à sa position.

## 7.2 Saisie manuelle

Le client peut également saisir son adresse manuellement.

Cette option est indispensable lorsque :

- La localisation est désactivée
- Le navigateur ne permet pas d'obtenir la position
- L'utilisateur préfère renseigner lui-même son adresse

## 7.3 Adresse différente du domicile

Le client peut commander alors qu'il n'est pas chez lui.

Il doit donc pouvoir renseigner une adresse de collecte différente de son adresse habituelle.

Exemple :

- Domicile
- Bureau
- Maison d'un proche
- Autre adresse

Le système doit permettre d'enregistrer plusieurs adresses et de choisir celle qui correspond à la commande.

---

# 8. Adresse de livraison

Le client renseigne l'adresse à laquelle il souhaite recevoir ses vêtements.

Par défaut, elle peut être identique à l'adresse de collecte.

Le client doit toutefois pouvoir sélectionner une adresse différente.

---

# 9. Programmation de la collecte

Le client sélectionne :

- Date de collecte
- Créneau horaire

Le système affiche uniquement les créneaux disponibles selon les règles définies par l'administrateur.

---

# 10. Calcul du prix

Le montant de la commande est calculé à partir de :

- Prix des articles
- Quantités
- Type de service
- Frais de collecte
- Frais de livraison
- Éventuels frais supplémentaires

Le client doit voir un récapitulatif avant le paiement.

### Exemple

```text
Service : Lavage + Repassage

Chemises : 4 × 1 000 FCFA = 4 000 FCFA
Pantalons : 2 × 1 500 FCFA = 3 000 FCFA

Sous-total : 7 000 FCFA
Collecte : 1 000 FCFA
Livraison : 1 000 FCFA

TOTAL : 9 000 FCFA
```

Les montants ci-dessus sont uniquement des exemples.

---

# 11. Paiement

Le système utilisera notamment les solutions de paiement :

- **FedaPay**
- **Kkiapay**

Le client pourra choisir le moyen de paiement disponible au moment du règlement.

## 11.1 Paiement total ou acompte

Le système pourra prévoir :

- Paiement intégral
- Paiement d'un acompte

La règle définitive concernant l'acompte devra être validée par le pressing.

## 11.2 Statuts de paiement

```text
Non payé
Paiement en attente
Acompte payé
Payé intégralement
Échec
Remboursé
```

---

# 12. Validation de la commande

Après validation du paiement, la commande est enregistrée.

Elle possède :

- Un numéro unique
- Un client
- Un ou plusieurs articles
- Un service
- Une adresse de collecte
- Une adresse de livraison
- Une date de collecte
- Un créneau
- Un montant
- Un statut de paiement
- Un statut de commande

---

# 13. Cycle de vie d'une commande

Les statuts possibles sont :

```text
Brouillon
En attente de paiement
Confirmée
Collecte planifiée
Collectée
En traitement
Prête
En attente du solde
Livraison planifiée
En livraison
Livrée
Terminée
Annulée
```

Le changement de statut dépend des opérations effectuées par les différents acteurs.

---

# 14. Fonctionnalités du client

## Compte

- Inscription
- Connexion
- Déconnexion
- Réinitialisation du mot de passe
- Modification du profil

## Profil

- Nom
- Prénom
- Téléphone
- Email
- Adresses
- Historique des commandes

## Commandes

Le client peut :

- Créer une commande
- Consulter ses commandes
- Consulter le détail d'une commande
- Suivre le statut
- Consulter les paiements
- Consulter son historique

---

# 15. Fonctionnalités du livreur

Le livreur possède un espace sécurisé.

## Tableau de bord

Il peut voir :

- Collectes prévues
- Livraisons prévues
- Commandes qui lui sont affectées

## Collecte

Le livreur peut :

- Voir les informations nécessaires à la collecte
- Consulter l'adresse
- Consulter les informations de contact du client
- Confirmer la collecte

## Livraison

Le livreur peut :

- Consulter les livraisons assignées
- Voir l'adresse de livraison
- Consulter les informations nécessaires
- Confirmer la livraison

---

# 16. Fonctionnalités de l'administrateur

## Gestion des commandes

- Consulter toutes les commandes
- Consulter les détails
- Modifier les statuts
- Affecter un livreur
- Suivre les paiements
- Gérer les collectes
- Gérer les livraisons

## Gestion des clients

- Consulter les clients
- Consulter leur historique
- Activer/désactiver un compte si nécessaire

## Gestion des livreurs

- Ajouter un livreur
- Modifier un livreur
- Activer/désactiver un compte
- Affecter des commandes

## Gestion des services

L'administrateur peut :

- Ajouter un service
- Modifier un service
- Désactiver un service
- Définir sa description
- Définir ses tarifs

## Gestion des articles

- Ajouter un type d'article
- Modifier son prix
- Désactiver un article

## Gestion des frais

- Frais de collecte
- Frais de livraison
- Autres frais éventuels

---

# 17. Tableau de bord administrateur

Le tableau de bord présente notamment :

## Indicateurs du jour

- Nombre de commandes
- Commandes en attente
- Collectes prévues
- Livraisons prévues
- Paiements reçus
- Chiffre d'affaires

## Statistiques

- Commandes par période
- Chiffre d'affaires
- Services les plus commandés
- Articles les plus commandés
- Clients actifs
- Performances des livreurs

---

# 18. Notifications

Le système pourra envoyer des notifications lors des événements importants :

- Création de commande
- Confirmation du paiement
- Confirmation de la collecte
- Début du traitement
- Commande prête
- Livraison planifiée
- Commande en livraison
- Livraison effectuée

Les canaux de notification pourront inclure :

- Notification dans l'application
- Email
- SMS ou WhatsApp selon les services retenus

---

# 19. Modèle de données principal

## Client

```text
id
nom
prenom
telephone
email
mot_de_passe
role
date_creation
```

## Adresse

```text
id
client_id
libelle
adresse_complete
latitude
longitude
ville
quartier
instructions
```

## Service

```text
id
nom
description
type_traitement
actif
date_creation
```

## Article

```text
id
nom
description
prix
actif
```

## Commande

```text
id
numero
client_id
service_id
adresse_collecte_id
adresse_livraison_id
date_collecte
creneau_collecte
montant_estime
montant_final
statut
date_creation
```

## Ligne de commande

```text
id
commande_id
article_id
quantite
prix_unitaire
sous_total
```

## Paiement

```text
id
commande_id
montant
methode
reference_transaction
statut
date_paiement
```

## Livreur

Le livreur est un utilisateur possédant le rôle `livreur`.

```text
id
user_id
statut
```

## Affectation

```text
id
commande_id
livreur_id
type_mission
date_affectation
statut
```

---

# 20. Architecture technique

## Backend

**Laravel**

Responsabilités :

- API REST
- Authentification
- Autorisation
- Gestion des rôles
- Gestion des commandes
- Gestion des utilisateurs
- Gestion des services et tarifs
- Gestion des paiements
- Gestion des livreurs
- Gestion des notifications
- Gestion des adresses et coordonnées GPS

## Frontend

**React**

Responsabilités :

- Interface publique
- Page d'accueil
- Catalogue des services
- Affichage des tarifs
- Formulaire de commande
- Espace client
- Espace livreur
- Interface administrateur
- Suivi des commandes

## Base de données

**MySQL**, selon le choix définitif de l'équipe.

## Paiement

- FedaPay
- Kkiapay

## Géolocalisation

Utilisation de l'API de géolocalisation du navigateur pour récupérer la position du client avec son consentement.

---

# 21. Architecture des rôles et sécurité

L'API Laravel doit appliquer un système de contrôle d'accès basé sur les rôles.

Exemple :

```text
ROLE_CLIENT
ROLE_LIVREUR
ROLE_ADMIN
```

Chaque rôle possède des permissions différentes.

### Client

Accès à :

```text
/public
/client/*
```

### Livreur

Accès à :

```text
/livreur/*
```

### Administrateur

Accès à :

```text
/admin/*
```

Les routes sensibles doivent être protégées côté backend Laravel. Le frontend React ne doit pas être considéré comme le mécanisme de sécurité principal.

---

# 22. Design UI/UX

## Couleurs principales

### Orange

Utilisation :

- Boutons principaux
- CTA
- Éléments actifs
- Icônes importantes
- Badges et éléments d'accent

### Blanc

Utilisation :

- Arrière-plan principal
- Cartes
- Zones de contenu
- Navigation

## Principes graphiques

L'interface doit être :

- Moderne
- Élégante
- Aérée
- Responsive
- Accessible
- Facile à comprendre
- Cohérente sur ordinateur, tablette et mobile

---

# 23. Navigation principale du site public

La navigation peut contenir :

```text
Accueil
Nos services
Nos tarifs
Comment ça marche ?
À propos
Contact
Se connecter
Commander
```

Le bouton **Commander** doit être particulièrement visible.

Une fois connecté, la navigation est adaptée au rôle de l'utilisateur.

---

# 24. MVP — Version 1

## Fonctionnalités obligatoires

### Site public

- Page d'accueil professionnelle
- Présentation des services
- Descriptions des services
- Affichage des tarifs
- Présentation du fonctionnement
- Contact
- Bouton de commande

### Client

- Inscription
- Connexion
- Profil
- Gestion des adresses
- Géolocalisation avec consentement
- Création de commande
- Sélection du service
- Sélection des articles
- Programmation de collecte
- Adresse de collecte
- Adresse de livraison
- Calcul du prix
- Paiement FedaPay/Kkiapay
- Suivi de commande
- Historique

### Livreur

- Connexion
- Tableau de bord
- Collectes
- Livraisons
- Confirmation des missions

### Administrateur

- Connexion sécurisée
- Tableau de bord
- Gestion des commandes
- Gestion des clients
- Gestion des livreurs
- Gestion des services
- Gestion des articles
- Gestion des tarifs
- Gestion des paiements

---

# 25. Fonctionnalités futures

Pour les versions ultérieures :

- Application mobile Android
- Application mobile iOS
- Suivi GPS du livreur en temps réel
- Programme de fidélité
- Coupons et promotions
- Parrainage
- Chat client-support
- Système de notation
- Gestion de plusieurs pressings
- Gestion avancée des zones de livraison
- Analyse avancée des performances
- Reconnaissance automatique des vêtements à partir de photos

---

# 26. Résumé du parcours complet

```text
VISITEUR
   │
   ▼
PAGE D'ACCUEIL
   │
   ├── Consulter les services
   ├── Consulter les descriptions
   ├── Consulter les tarifs
   └── Découvrir le fonctionnement
   │
   ▼
COMMANDER
   │
   ▼
CONNEXION / INSCRIPTION CLIENT
   │
   ▼
CHOIX DU SERVICE
   │
   ▼
CHOIX DES ARTICLES
   │
   ▼
ADRESSE DE COLLECTE
   │
   ├── Localisation automatique
   └── Saisie manuelle
   │
   ▼
ADRESSE DE LIVRAISON
   │
   ▼
DATE + CRÉNEAU DE COLLECTE
   │
   ▼
RÉCAPITULATIF
   │
   ▼
PAIEMENT
   │
   ├── FedaPay
   └── Kkiapay
   │
   ▼
COMMANDE CONFIRMÉE
   │
   ▼
AFFECTATION DU LIVREUR
   │
   ▼
COLLECTE
   │
   ▼
TRAITEMENT AU PRESSING
   │
   ▼
COMMANDE PRÊTE
   │
   ▼
LIVRAISON
   │
   ▼
COMMANDE LIVRÉE
   │
   ▼
COMMANDE TERMINÉE
```

---

# 27. Résultat attendu

L'application finale doit fournir une expérience complète allant de la **découverte du pressing sur la page d'accueil** jusqu'à la **livraison des vêtements au client**, tout en permettant au pressing de gérer efficacement ses opérations.

Le système doit séparer clairement :

- **L'espace public**, accessible sans compte
- **L'espace client**, accessible après authentification
- **L'espace livreur**, accessible aux comptes livreurs autorisés
- **L'espace administrateur**, réservé aux administrateurs

L'ensemble sera développé avec **React pour le frontend** et **Laravel pour le backend**, avec intégration de **FedaPay/Kkiapay pour les paiements** et de la **géolocalisation pour faciliter la saisie de l'adresse de collecte**.
