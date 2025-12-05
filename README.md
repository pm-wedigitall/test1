# Todo List avec SQLite

Application de gestion de tâches (Todo List) avec backend Node.js et base de données SQLite.

## Fonctionnalités

- ✅ Ajouter des tâches
- ✅ Marquer les tâches comme complétées
- ✅ Supprimer des tâches
- ✅ Persistance des données avec SQLite
- ✅ API REST complète

## Technologies utilisées

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Base de données**: SQLite3
- **API**: REST API

## Installation

1. Installer les dépendances :
```bash
npm install
```

## Démarrage

Démarrer le serveur :
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## Mode développement

Pour un rechargement automatique lors des modifications :
```bash
npm run dev
```

## Structure de la base de données

La base de données `todos.db` sera créée automatiquement au premier démarrage.

**Table `tasks`** :
- `id` : INTEGER PRIMARY KEY AUTOINCREMENT
- `text` : TEXT NOT NULL
- `completed` : INTEGER (0 ou 1)
- `created_at` : DATETIME

## API Endpoints

- `GET /api/tasks` - Récupérer toutes les tâches
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

## Utilisation

1. Démarrer le serveur avec `npm start`
2. Ouvrir votre navigateur à `http://localhost:3000`
3. Commencer à ajouter vos tâches !

## Notes

- Les données sont persistées dans le fichier `todos.db`
- Le serveur doit être en cours d'exécution pour que l'application fonctionne
- L'application utilise CORS pour permettre les requêtes depuis le frontend
