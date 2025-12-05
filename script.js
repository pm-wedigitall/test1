// Récupération des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const API_URL = 'http://localhost:3000/api/tasks';

// Variable pour stocker les tâches
let tasks = [];

// Fonction pour récupérer toutes les tâches depuis l'API
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur lors de la récupération des tâches');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger les tâches. Assurez-vous que le serveur est démarré.');
    }
}

// Fonction pour afficher toutes les tâches
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Supprimer</button>
        `;

        taskList.appendChild(li);
    });
}

// Fonction pour ajouter une tâche
async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Veuillez entrer une tâche !');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        });

        if (!response.ok) throw new Error('Erreur lors de l\'ajout de la tâche');

        taskInput.value = '';
        await fetchTasks();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible d\'ajouter la tâche.');
    }
}

// Fonction pour basculer l'état d'une tâche
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la tâche');

        await fetchTasks();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de mettre à jour la tâche.');
    }
}

// Fonction pour supprimer une tâche
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression de la tâche');

        await fetchTasks();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de supprimer la tâche.');
    }
}

// Événements
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Charger les tâches au démarrage
fetchTasks();
