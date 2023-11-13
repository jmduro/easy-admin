document.addEventListener("DOMContentLoaded", () => {
    // Cargar tareas guardadas al abrir la webview
    loadTasks();

    // Agregar tarea al hacer clic en el botón
    document.getElementById("taskForm").addEventListener("submit", (event) => {
        event.preventDefault();
        addTask();
    });

    // Agregar un listener al botón de actualización
    document.getElementById('updateProgressButton').addEventListener('click', () => {
        updateProgress();
    });
});

function addTask() {
    const activity = document.getElementById("activity").value;
    const date = document.getElementById("date").value;
    const details = document.getElementById("details").value;
    const assignee = document.getElementById("assignee").value;

    // Crear un nuevo checkbox y obtener su estado
    const completed = document.getElementById("completed").checked;

    const task = { activity, date, details, assignee, completed };

    // Agregar tarea a la tabla
    appendTaskToTable(task);

    // Calcular y actualizar el progreso
    updateProgress();

    // Limpiar el formulario
    document.getElementById("taskForm").reset();

    // Guardar tareas localmente
    saveTasks();
}

function appendTaskToTable(task) {
    const tableBody = document.getElementById('tasksTableBody');
    const row = tableBody.insertRow();

    for (const key in task) {
        if (task.hasOwnProperty(key)) {
            const cell = row.insertCell();
            if (key === 'completed') {
                // Crear un nuevo checkbox y establecer su estado
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'completed';
                checkbox.checked = task[key];
                cell.appendChild(checkbox);
            } else {
                // Para otras claves, simplemente agregar el contenido de la tarea
                cell.textContent = task[key];
            }
        }
    }
}

function updateProgress() {
    console.log('updateProgress function called');

    const totalTasks = document.getElementById('tasksTableBody').rows.length;
    const completedTasks = document.querySelectorAll('#tasksTableBody [name="completed"]:checked').length;
    const progress = (completedTasks / totalTasks) * 100 || 0;

    document.getElementById('progressBar').value = progress;
    document.getElementById('progressLabel').textContent = `${progress.toFixed(2)}%`;

    // Guardar tareas localmente después de la actualización del progreso
    saveTasks();
}

function saveTasks() {
    const tasks = Array.from(document.getElementById("tasksTableBody").rows).map(
        (row) => {
            const task = {};
            Array.from(row.cells).forEach((cell, index) => {
                task[Object.keys(task)[index]] = cell.textContent;
            });
            return task;
        }
    );

    // Guardar tareas en almacenamiento local
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tareas guardadas correctamente.');
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        try {
            const tasks = JSON.parse(storedTasks);

            // Agregar tareas guardadas a la tabla
            tasks.forEach((task) => appendTaskToTable(task));

            // Actualizar el progreso
            updateProgress();
        } catch (error) {
            console.error('Error al parsear tareas desde el almacenamiento local:', error);
        }
    }
}
