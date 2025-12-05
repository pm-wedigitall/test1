const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Créer/ouvrir la base de données SQLite
const db = new sqlite3.Database('./todos.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        initDatabase();
    }
});

// Initialiser la table des tâches
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table:', err.message);
        } else {
            console.log('Table tasks créée ou déjà existante.');
        }
    });
}

// Routes API

// GET - Récupérer toutes les tâches
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Convertir completed de 0/1 à boolean
        const tasks = rows.map(row => ({
            ...row,
            completed: row.completed === 1
        }));
        res.json(tasks);
    });
});

// POST - Ajouter une nouvelle tâche
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        res.status(400).json({ error: 'Le texte de la tâche est requis' });
        return;
    }

    db.run('INSERT INTO tasks (text) VALUES (?)', [text], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            text: text,
            completed: false
        });
    });
});

// PUT - Mettre à jour une tâche (toggle completed)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    db.run(
        'UPDATE tasks SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Tâche non trouvée' });
                return;
            }
            res.json({ id: parseInt(id), completed });
        }
    );
});

// DELETE - Supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Tâche non trouvée' });
            return;
        }
        res.json({ message: 'Tâche supprimée', id: parseInt(id) });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Fermer la base de données proprement à l'arrêt du serveur
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Base de données fermée.');
        process.exit(0);
    });
});
