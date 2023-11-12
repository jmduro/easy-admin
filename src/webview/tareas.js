// Función para agregar tareas
function addTask() {
    // Obtener el nombre de la tarea del input
    var taskName = document.getElementById('taskName').value;

    // Validar que el nombre de la tarea no esté vacío
    if (taskName.trim() === '') {
        alert('Por favor, ingrese un nombre para la tarea.');
        return;
    }

    // Crear una nueva fila para la tabla
    var newRow = document.createElement('tr');

    // Añadir celdas con los datos de la tarea
    var cell1 = document.createElement('td');
    cell1.appendChild(document.createTextNode(taskName));
    newRow.appendChild(cell1);

    // Puedes agregar más celdas según tus necesidades

    // Añadir la fila a la tabla
    document.getElementById('taskList').appendChild(newRow);

    // Limpiar el input
    document.getElementById('taskName').value = '';

    // Actualizar la barra de progreso
    updateProgressBar();
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    var totalTasks = document.getElementById('taskList').getElementsByTagName('tr').length - 1; // Restamos 1 para excluir la fila de encabezado
    var completedTasks = document.getElementById('taskList').querySelectorAll('input[type="checkbox"]:checked').length;

    var progressPercentage = (completedTasks / totalTasks) * 100;

    // Actualizar la barra de progreso
    document.getElementById('progress').style.width = progressPercentage + '%';

    // Actualizar el texto del porcentaje
    document.getElementById('progressText').innerText = progressPercentage.toFixed(2) + '%';
}
