# Rapport du projet Frontend

## 1) Présentation générale
Ce projet est une application **Angular (standalone)** orientée gestion de la relation client, avec les modules principaux suivants :
- Authentification (connexion / inscription)
- Tableau de bord utilisateur
- Gestion des clients
- Gestion des groupes (catégories)
- Gestion des messages

L’application consomme une API backend via `HttpClient` et s’appuie sur une architecture basée sur des composants Angular + services dédiés à chaque domaine métier.

---

## 2) Architecture de l’application

### 2.1 Stack et structure technique
- **Framework** : Angular CLI 19
- **Architecture** : composants standalone, routage Angular, services injectables
- **Communication API** : `HttpClient`
- **Configuration globale** : `app.config.ts` (router + http client)
- **Environnement** : URL d’API centralisée dans `environment.ts`

### 2.2 Organisation des dossiers
- `src/app/auth-login`, `src/app/auth-register` : écrans d’authentification
- `src/app/dashboard` : statistiques et synthèse utilisateur
- `src/app/mes-clients*` : listing, création, édition des clients
- `src/app/category*` : listing et administration des groupes
- `src/app/message*` : listing, création, édition des messages
- `src/app/services` : couche d’accès aux données (API)
- `src/app/models` : modèles de données TypeScript

### 2.3 Routage (navigation)
Le fichier `app.routes.ts` définit deux espaces :
1. **Espace connecté** via `ConnectLayoutComponent` avec les routes :
   - `/dashboard`
   - `/category`
   - `/category/:id/manage`
   - `/messages`
   - `/messages-create`
   - `/messages/edit/:id`
   - `/clients`
   - `/clients-create`
   - `/clients/edit/:id`
2. **Espace public** :
   - `/login`
   - `/register`

Cette séparation améliore la lisibilité du parcours utilisateur et prépare le projet à l’ajout de guards de sécurité si besoin.

### 2.4 Couche services et réutilisation
Le projet adopte un **service de base générique** `BaseService<T>` qui centralise les opérations CRUD communes :
- `getAll`
- `getById`
- `create`
- `update`
- `delete`

Ensuite, des services métiers héritent de cette base :
- `CategoryService`
- `CustomerService`
- `MessageService`
- `DashboardService`

Avantage : réduction de la duplication de code et standardisation des appels API.

### 2.5 Authentification et session
`AuthService` gère :
- la connexion (`/accounts/login`)
- l’inscription (`/accounts`)
- la persistance locale (token + utilisateur dans `localStorage`)
- les utilitaires de session (`isLoggedIn`, `getToken`, `getUser`)

Cette approche permet de conserver l’état utilisateur côté navigateur entre les rechargements de page.

---

## 3) Fonctionnement de l’application (avec emplacements captures)

> Remarque : les blocs ci-dessous contiennent des zones réservées pour vos captures d’écran.

### 3.1 Écran de connexion
Objectif : permettre à un utilisateur existant d’accéder à son espace.

Flux :
1. L’utilisateur saisit ses identifiants.
2. Le front envoie la requête de login via `AuthService`.
3. Si succès, le token et les infos utilisateur sont enregistrés dans `localStorage`.
4. L’utilisateur est redirigé vers le dashboard.

**[Capture écran à insérer : Page de connexion + retour succès]**

---

### 3.2 Écran d’inscription
Objectif : créer un compte (profil personne physique ou entreprise selon votre logique métier).

Flux :
1. Saisie des informations dans le formulaire.
2. Envoi des données au backend via `AuthService.register`.
3. Traitement de la réponse et orientation vers la connexion (ou connexion directe selon votre choix UX).

**[Capture écran à insérer : Formulaire d’inscription]**

---

### 3.3 Tableau de bord
Objectif : afficher une vue synthétique de l’activité utilisateur.

Flux :
1. Récupération de l’`userId` depuis la session locale.
2. Appel du service `DashboardService.getMyDashboard(userId)`.
3. Affichage des statistiques et indicateurs reçus.

**[Capture écran à insérer : Dashboard avec les statistiques]**

---

### 3.4 Gestion des clients
Objectif : administrer les clients liés à l’utilisateur connecté.

Fonctionnalités :
- Liste des clients (`/clients`)
- Création d’un client (`/clients-create`)
- Édition d’un client (`/clients/edit/:id`)

Flux général :
1. Chargement de la liste via `CustomerService`.
2. Création/édition via formulaires dédiés.
3. Rafraîchissement de la vue après opération.

**[Capture écran à insérer : Liste des clients]**

**[Capture écran à insérer : Formulaire de création/édition d’un client]**

---

### 3.5 Gestion des groupes (catégories)
Objectif : organiser les clients par groupes.

Fonctionnalités :
- Liste des groupes utilisateur (`/category`)
- Gestion détaillée d’un groupe (`/category/:id/manage`)
- Ajout/retrait de clients dans un groupe
- Visualisation des clients dans et hors groupe

Le service `CategoryService` expose des méthodes dédiées :
- récupération des groupes utilisateur
- récupération des clients d’un groupe
- récupération des clients hors groupe
- ajout/retrait d’un client dans un groupe

**[Capture écran à insérer : Liste des groupes]**

**[Capture écran à insérer : Gestion d’un groupe (clients dans/hors groupe)]**

---

### 3.6 Gestion des messages
Objectif : permettre la préparation et le suivi des messages.

Fonctionnalités :
- Liste des messages (`/messages`)
- Création (`/messages-create`)
- Édition (`/messages/edit/:id`)

Flux :
1. Chargement des messages liés à l’utilisateur via `MessageService.getUserMessages(userId)`.
2. Création/édition depuis les formulaires.
3. Mise à jour de l’affichage après action.

**[Capture écran à insérer : Liste des messages]**

**[Capture écran à insérer : Formulaire de création/édition d’un message]**

---

## 4) Points forts de l’architecture
- **Modularité** : composants séparés par domaine fonctionnel.
- **Réutilisabilité** : `BaseService<T>` limite la duplication du CRUD.
- **Scalabilité** : ajout de nouveaux modules facilité (nouveau composant + service + route).
- **Lisibilité** : séparation claire entre UI, routes, modèles et accès API.

---

## 5) Axes d'amélioration recommandés
1. Ajouter un **HttpInterceptor** pour injecter automatiquement le token dans les headers.
2. Mettre en place une gestion uniforme des erreurs API (toasts/messages utilisateurs).
3. Renforcer les validations de formulaires (sync + async).
4. Compléter la couverture de tests unitaires et tests d'intégration.
---

## 6) Conclusion
Ce frontend présente une base solide pour une application métier orientée gestion clients/messages/groupes. L’architecture actuelle favorise la maintenance et l’évolution, tout en restant suffisamment simple pour une prise en main rapide. Avec les améliorations proposées (sécurité, expérience utilisateur, robustesse), le projet peut monter en qualité et en fiabilité pour un usage en production.
