document.addEventListener("DOMContentLoaded", () => {
    // Cargar tareas guardadas al abrir la webview
    loadTasks();

    // Agregar tarea al hacer clic en el botón
    document.getElementById("taskForm").addEventListener("submit", (event) => {
        event.preventDefault();
        addTask();
    });
});

function addTask() {
    const activity = document.getElementById("activity").value;
    const date = document.getElementById("date").value;
    const details = document.getElementById("details").value;
    const assignee = document.getElementById("assignee").value;
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
    const tableBody = document.getElementById("tasksTableBody");
    const row = tableBody.insertRow();

    for (const key in task) {
        if (task.hasOwnProperty(key)) {
            const cell = row.insertCell();
            cell.textContent = task[key];
        }
    }
}

function updateProgress() {
    const totalTasks = document.getElementById("tasksTableBody").rows.length;
    const completedTasks = document.querySelectorAll(
        '#tasksTableBody [name="completed"]:checked'
    ).length;
    const progress = (completedTasks / totalTasks) * 100 || 0;

    document.getElementById("progressBar").value = progress;
    document.getElementById("progressLabel").textContent = `${progress.toFixed(
        2
    )}%`;
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
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);

        // Agregar tareas guardadas a la tabla
        tasks.forEach((task) => appendTaskToTable(task));

        // Actualizar el progreso
        updateProgress();
    }
}
