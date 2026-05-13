# SIR_Esaie_Yan_2026_Front

Frontend Angular d'une application de gestion (clients, groupes/catégories, messages) avec authentification et tableau de bord.

## 1) Prérequis
Avant de lancer le projet, vérifiez :
- **Node.js** (version LTS recommandée)
- **npm** (installé avec Node.js)
- **Angular CLI** (optionnel en global, sinon via `npx`)

Vérification rapide :
```bash
node -v
npm -v
npx ng version
```

## 2) Installation après clonage
1. Cloner le dépôt :
```bash
git clone <URL_DU_REPO>
cd SIR_Esaie_Yan_2026_Front
```

2. Installer les dépendances :
```bash
npm install
```

3. (Optionnel) Vérifier l'URL de l'API backend dans :
- `src/environment/environment.ts`

## 3) Lancer l'application en local
Démarrer le serveur de développement :
```bash
npm run start
```
> équivalent à `ng serve`

Puis ouvrir :
- `http://localhost:4200/`

## 4) Scripts utiles
- Lancer le front :
```bash
npm run start
```
- Build production :
```bash
npm run build
```
- Tests unitaires :
```bash
npm run test
```

## 5) Parcours fonctionnels et boutons disponibles

### 5.1 Authentification
- **/login**
  - Bouton **Connexion**
  - Bouton **Connexion aléatoire (auto-démo)**
- **/register**
  - Choix de profil (physique / entreprise)
  - Bouton **Inscription**
  - Bouton **Inscription aléatoire**

### 5.2 Dashboard
- Bouton **Générer des données de test** (données aléatoires)
- Boutons de navigation rapide :
  - **Voir mes messages**
  - **Voir mes groupes**
  - **Voir mes clients**
  - **Envoyer un nouveau message**

### 5.3 Clients
- **/clients**
  - Bouton **+ Créer un nouveau client**
  - Actions par ligne : **Modifier**, **Supprimer**
- **/clients-create**
  - Bouton **Créer mon client**
  - Bouton de génération aléatoire (démo)
- **/clients/edit/:id**
  - Bouton **Modifier le client**

### 5.4 Groupes / Catégories
- **/category**
  - Bouton **+ Créer un groupe**
  - Actions : **Gérer**, **Supprimer**
- **/category/:id/manage**
  - Mise à jour du groupe
  - Retrait d'un membre
  - Ajout de membres (bouton **Ajouter**)

### 5.5 Messages
- **/messages**
  - Bouton **+ Créer un nouveau message**
  - Actions : **Modifier**, **Supprimer**
- **/messages-create**
  - Boutons **Annuler** et **Envoyer**
  - Bouton de remplissage/génération aléatoire (démo)
- **/messages/edit/:id**
  - Bouton **Modifier**

## 6) Données aléatoires / mode démo
Le projet inclut plusieurs actions "aléatoires" pratiques pour les démonstrations :
- Connexion aléatoire
- Inscription aléatoire
- Génération de données de dashboard
- Génération/remplissage auto dans certains formulaires

Ces boutons permettent de tester rapidement les écrans sans saisie manuelle complète à chaque fois.

## 7) Guide utilisateur et rapport projet

Un **guide utilisateur complet avec captures d'écran** est disponible dans :
- [`RAPPORT_PROJET_FRONT.md`](RAPPORT_PROJET_FRONT.md)

Il contient :
- l'architecture du projet,
- le **guide utilisateur illustré** (captures d'écran de chaque écran),
- les axes d'amélioration.

> Les captures d'écran sont dans le dossier `docs/`.
