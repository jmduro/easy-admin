import { GestorTareas } from "./gestor";

const gestorTareas = new GestorTareas();

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Agregar un listener al botón de actualización
    document.getElementById('updateProgressButton').addEventListener('click', () => {
        updateProgress();
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.command) {
            case 'tareaAgregada':
                appendTaskToTable(message.tarea);
                updateProgress();
                // Agrega aquí el llamado a la función que actualiza la WebView
                refreshWebView();
                break;
            // Otros comandos si es necesario
        }
    });
});

function appendTaskToTable(task) {
    const tableBody = document.getElementById('tasksTableBody');
    const row = tableBody.insertRow();

    const cell1 = row.insertCell();
    cell1.textContent = task.nombre;

    const cell2 = row.insertCell();
    cell2.textContent = task.fechaLimite;

    const cell3 = row.insertCell();
    cell3.textContent = task.descripcion;

    const cell4 = row.insertCell();
    cell4.textContent = task.encargado ? task.encargado.nombre : '';

    const cell5 = row.insertCell();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'completed';
    checkbox.checked = task.completado;
    cell5.appendChild(checkbox);
}

function updateProgress() {
    const totalTasks = gestorTareas.consultarTodos().length;
    const completedTasks = gestorTareas.consultarTodos().filter(task => task.completado).length;
    const progress = (completedTasks / totalTasks) * 100 || 0;

    document.getElementById('progressBar').value = progress;
    document.getElementById('progressLabel').textContent = `${progress.toFixed(2)}%`;
}

function loadTasks() {
    // No es necesario cargar tareas al inicio, ya que lo gestionamos con el gestor
}
