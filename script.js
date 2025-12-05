// Récupération des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Charger les tâches depuis localStorage au démarrage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Fonction pour sauvegarder les tâches dans localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour afficher toutes les tâches
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="task-text" onclick="toggleTask(${index})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">Supprimer</button>
        `;

        taskList.appendChild(li);
    });
}

// Fonction pour ajouter une tâche
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Veuillez entrer une tâche !');
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Fonction pour basculer l'état d'une tâche
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Fonction pour supprimer une tâche
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Événements
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Afficher les tâches au chargement
renderTasks();
