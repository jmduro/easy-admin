const fs = require('fs');
const path = require('path');

const dataFilePath = path.resolve(__dirname, 'tasks.json');

// Función para cargar las tareas almacenadas localmente
function loadTasks() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
        return [];
    }
}

// Función para guardar las tareas localmente
function saveTasks(tasks) {
    try {
        const data = JSON.stringify(tasks, null, 2);
        fs.writeFileSync(dataFilePath, data, 'utf-8');
    } catch (error) {
        console.error('Error al guardar las tareas:', error);
    }
}

// Función para inicializar la aplicación
function initializeApp() {
    // Cargar las tareas almacenadas localmente
    const storedTasks = loadTasks();

    // Llenar la tabla con las tareas cargadas
    for (const task of storedTasks) {
        addTaskToTable(task);
    }

    // Actualizar la barra de progreso
    updateProgressBar();
}

// Función para agregar/modificar tareas
function addOrUpdateTask() {
    // Obtener los datos del formulario
    // ...

    // Crear un objeto con los datos de la tarea
    const newTask = {
        name: taskName,
        description: taskDescription,
        date: taskDate,
        priority: taskPriority,
        completed: taskCompleted
    };

    // Obtener las tareas actuales
    const currentTasks = loadTasks();

    // Agregar la nueva tarea a la lista
    currentTasks.push(newTask);

    // Guardar las tareas actualizadas
    saveTasks(currentTasks);

    // Limpiar el formulario
    clearForm();

    // Limpiar la tabla
    clearTable();

    // Llenar la tabla con las tareas actualizadas
    for (const task of currentTasks) {
        addTaskToTable(task);
    }

    // Actualizar la barra de progreso
    updateProgressBar();
}
		// Función para agregar/modificar tareas
function addOrUpdateTask() {
    // Obtener los datos del formulario
    var taskName = document.getElementById('taskName').value;
    var taskDescription = document.getElementById('taskDescription').value;
    var taskDate = document.getElementById('taskDate').value;
    var taskPriority = document.getElementById('taskPriority').value;
    var taskCompleted = document.getElementById('taskCompleted').checked;

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

    var cell2 = document.createElement('td');
    cell2.appendChild(document.createTextNode(taskDescription));
    newRow.appendChild(cell2);

    var cell3 = document.createElement('td');
    cell3.appendChild(document.createTextNode(taskDate));
    newRow.appendChild(cell3);

    var cell4 = document.createElement('td');
    cell4.appendChild(document.createTextNode(taskPriority));
    newRow.appendChild(cell4);

    var cell5 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = taskCompleted;
    cell5.appendChild(checkbox);
    newRow.appendChild(cell5);

    var cell6 = document.createElement('td');
    var editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = function () {
        editTask(newRow);
    };
    cell6.appendChild(editButton);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = function () {
        deleteTask(newRow);
    };
    cell6.appendChild(deleteButton);

    newRow.appendChild(cell6);

    // Añadir la fila a la tabla
    document.getElementById('taskList').appendChild(newRow);

    // Limpiar el formulario después de agregar/modificar
    clearForm();

    // Actualizar la barra de progreso
    updateProgressBar();
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskPriority').value = 'alta';
    document.getElementById('taskCompleted').checked = false;
}

// Función para editar tarea
function editTask(row) {
    // Llenar el formulario con los datos de la tarea seleccionada
    document.getElementById('taskName').value = row.cells[0].textContent;
    document.getElementById('taskDescription').value = row.cells[1].textContent;
    document.getElementById('taskDate').value = row.cells[2].textContent;
    document.getElementById('taskPriority').value = row.cells[3].textContent;
    document.getElementById('taskCompleted').checked = row.cells[4].querySelector('input[type="checkbox"]').checked;

    // Eliminar la fila existente
    row.remove();

    // Actualizar la barra de progreso
    updateProgressBar();
}

// Función para eliminar tarea
function deleteTask(row) {
    // Eliminar la fila
    row.remove();

    // Actualizar la barra de progreso
    updateProgressBar();
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    var totalTasks = document.getElementById('taskList').getElementsByTagName('tr').length - 1; // Restamos 1 para excluir la fila de encabezado
    var completedTasks = document.getElementById('taskList').querySelectorAll('input[type="checkbox"]:checked').length;

    var progressPercentage = (completedTasks / totalTasks) * 100;

    document.getElementById('progress').style.width = progressPercentage + '%';
    document.getElementById('progressText').innerText = progressPercentage.toFixed(2) + '%';
}