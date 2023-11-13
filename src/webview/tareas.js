document.addEventListener('DOMContentLoaded', () => {
    // Cargar tareas guardadas al abrir la webview
    loadTasks();

    // Agregar tarea al hacer clic en el botón
    document.getElementById('taskForm').addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });

    // Agregar un listener al botón de actualización
    document.getElementById('updateProgressButton').addEventListener('click', () => {
        updateProgress();
    });
});

function addTask() {
    const activity = document.getElementById('activity').value;
    const date = document.getElementById('date').value;
    const details = document.getElementById('details').value;
    const assignee = document.getElementById('assignee').value;

    // Crear un nuevo checkbox y obtener su estado
    const completed = document.getElementById('completed').checked;

    const tarea = new Tarea();
    tarea.nombre = activity;
    tarea.fechaLimite = date;
    tarea.descripcion = details;
    tarea.encargado = new Encargado(assignee);
    tarea.completado = completed;

    // Agregar tarea a la tabla
    appendTaskToTable(tarea);

    // Calcular y actualizar el progreso
    updateProgress();

    // Limpiar el formulario
    document.getElementById('taskForm').reset();

    // Guardar tarea localmente
    saveTask(tarea);
}

function appendTaskToTable(tarea) {
    const tableBody = document.getElementById('tasksTableBody');
    const row = tableBody.insertRow();

    for (const key in tarea) {
        if (tarea.hasOwnProperty(key)) {
            const cell = row.insertCell();
            if (key === 'completado') {
                // Crear un nuevo checkbox y establecer su estado
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'completed';
                checkbox.checked = tarea[key];
                cell.appendChild(checkbox);
            } else {
                // Para otras claves, simplemente agregar el contenido de la tarea
                cell.textContent = tarea[key];
            }
        }
    }
}

function updateProgress() {
    console.log('updateProgress function called'); // Agrega esta línea

    const totalTasks = document.getElementById('tasksTableBody').rows.length;
    const completedTasks = document.querySelectorAll('#tasksTableBody [name="completed"]:checked').length;
    const progress = (completedTasks / totalTasks) * 100 || 0;

    document.getElementById('progressBar').value = progress;
    document.getElementById('progressLabel').textContent = `${progress.toFixed(2)}%`;
}

function saveTask(tarea) {
    // Guardar la tarea en el gestor
    gestorTareas.agregar(tarea);
}

function loadTasks() {
    const storedTasks = gestorTareas.consultarTodos();

    // Agregar tareas guardadas a la tabla
    storedTasks.forEach((tarea) => appendTaskToTable(tarea));

    // Actualizar el progreso
    updateProgress();
}
