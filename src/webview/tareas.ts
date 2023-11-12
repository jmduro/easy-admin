export function getWebviewContentTareas() {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Lista de Tareas</title>
	</head>
	<body>
		<h1>Lista de Tareas</h1>
	
		<!-- Formulario para agregar/modificar tareas -->
		<form class="task-form" id="taskForm">
			<label for="taskName">Nombre de la tarea:</label>
			<input type="text" id="taskName" name="taskName" required>
			
			<label for="taskDescription">Descripción:</label>
			<textarea id="taskDescription" name="taskDescription"></textarea>
	
			<label for="taskDate">Fecha:</label>
			<input type="date" id="taskDate" name="taskDate">
	
			<label for="taskPriority">Prioridad:</label>
			<select id="taskPriority" name="taskPriority">
				<option value="alta">Alta</option>
				<option value="media">Media</option>
				<option value="baja">Baja</option>
			</select>
	
			<input type="checkbox" id="taskCompleted" name="taskCompleted">
			<label for="taskCompleted">Completado</label>
	
			<button type="button" onclick="addOrUpdateTask()">Agregar/Modificar Tarea</button>
		</form>
	
		<!-- Tabla de tareas -->
		<table>
			<thead>
				<tr>
					<th>Tarea</th>
					<th>Descripción</th>
					<th>Fecha</th>
					<th>Prioridad</th>
					<th>Completado</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody id="taskList">
				<!-- Aquí se insertarán dinámicamente las filas de la tabla -->
			</tbody>
		</table>
	
		<!-- Barra de progreso -->
		<div class="progress-bar">
			<div class="progress" id="progress"></div>
			<div class="progress-text" id="progressText">0%</div>
		</div>
	
		<script>
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

		</script>
	</body>
	</html>
	`;
}

import * as vscode from "vscode";
import { getNonce } from "./getNonce";


export class Tarea {
    public static currentPanel: Tarea | undefined;

    public static readonly viewType = "swiper";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (Tarea.currentPanel) {
            Tarea.currentPanel._panel.reveal(column);
            Tarea.currentPanel._update();
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            Tarea.viewType,
            "Tareas",
            column || vscode.ViewColumn.One,
            {
                // Enable javascript in the webview
                enableScripts: true,

                // And restrict the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, "src/media"),
                    vscode.Uri.joinPath(extensionUri, "out/compiled/webview"),
                ],
            }
        );

        Tarea.currentPanel = new Tarea(panel, extensionUri);
    }

    public static kill() {
        Tarea.currentPanel?.dispose();
        Tarea.currentPanel = undefined;
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        Tarea.currentPanel = new Tarea(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }

    public dispose() {
        Tarea.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        const webview = this._panel.webview;

        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }

            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/main.js")
        );

        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
        );
        const stylesMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
            );
        const stylesSkinUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "webview/styles.css")
            );
        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/main.css")
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
			    <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
                
                <script nonce="${nonce}"></script>
			</head>
            <body>
                <h1>Hello World</h1>
                <p>Probando cositas</p>
                <input type="text" />
                <button>try</button>
			</body>
			<script src="${scriptUri}" nonce="${nonce}"></script>
			</html>`;
    }
}