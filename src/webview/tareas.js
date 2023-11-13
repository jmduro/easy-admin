import { Tarea, Encargado } from "./entidad";
import { GestorTareas } from "./gestor";

// Crea una instancia del gestor
const gestorTareas = new GestorTareas();

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
    const completed = document.getElementById('completed').checked;

    const task = new Tarea();
    task.nombre = activity;
    task.fechaLimite = date;
    task.descripcion = details;
    // Aquí puedes agregar lógica para asignar un encargado si es necesario
    task.encargado = new Encargado(assignee);
    task.completado = completed;

    // Agregar tarea al gestor
    gestorTareas.agregar(task);

    // Limpiar el formulario
    document.getElementById('taskForm').reset();

    // Actualizar la tabla y el progreso
    updateTableAndProgress();
}

function updateTableAndProgress() {
    // Limpiar la tabla antes de cargar las tareas
    clearTable();

    // Agregar tareas guardadas a la tabla
    gestorTareas.consultarTodos().forEach((task) => appendTaskToTable(task));

    // Actualizar el progreso
    updateProgress();
}

function appendTaskToTable(task) {
    const tableBody = document.getElementById('tasksTableBody');
    const row = tableBody.insertRow();

    // Por ejemplo:
    const cell1 = row.insertCell();
    cell1.textContent = task.nombre;

    const cell2 = row.insertCell();
    cell2.textContent = task.fechaLimite;

    const cell3 = row.insertCell();
    cell3.textContent = task.descripcion;

    const cell4 = row.insertCell();
    cell4.textContent = task.Encargado;

    const cell5 = row.insertCell();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'completed';
    checkbox.checked = task.completado;
    cell5.appendChild(checkbox);
}

function clearTable() {
    const tableBody = document.getElementById('tasksTableBody');
    tableBody.innerHTML = '';
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
