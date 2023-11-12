import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import * as tareas from "./tareas.js";


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
		const scriptTarea = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "webview/tareas.js")
		);
		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
		);
		const stylesMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
		);
		const stylesSkinUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "webview/tareas.css")
		);
		const cssUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/main.css")
		);

		const nameProject = "Proyecto";
		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();


		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${stylesResetUri}" rel="stylesheet">
			<link href="${stylesMainUri}" rel="stylesheet">
            <link rel="stylesheet" href="tareas.css">
        <script nonce="${nonce}"></script>
		</head>
    <body>
	<script src="${scriptTarea}"></script>
	<div id="app" class=""></div>
		<h1>${nameProject}</h1>

        <button type="button" onClick="initializeApp()">Iniciar</button>

		<!-- Formulario para agregar/modificar tareas -->
		<h2>Agregar Nueva Tarea</h2>
		<form id="taskForm">
			<label for="activity">Actividad:</label>
			<input type="text" id="activity" name="activity" required>

			<label for="date">Fecha:</label>
			<input type="date" id="date" name="date" required>

			<label for="details">Detalles:</label>
			<textarea id="details" name="details" required></textarea>

			<label for="assignee">Encargado:</label>
			<input type="text" id="assignee" name="assignee" required>

			<label for="completed">Completado:</label>
			<input type="checkbox" id="completed" name="completed">

			<button type="button" onclick="addTask()">Agregar Tarea</button>
		</form>
		
		
		<!--<form class="task-form" id="taskForm">
			<label for="taskName">Nombre de la actividad</label>
			<input type="text" id="taskName" name="taskName" required>

			<label for="taskDate">Fecha:</label>
			<input type="date" id="taskDate" name="taskDate">

			<label for="taskDescription">Detalles:</label>
			<textarea id="taskDescription" name="taskDescription"></textarea>

			<label for="taskPriority">Encargado:</label>
			<select id="taskPriority" name="taskPriority">
				<option value="alta">Jorge</option>
				<option value="media">Olsend</option>
				<option value="baja">Alejo</option>
				<option value="baja">Mel</option>
			</select>
	
			<input type="checkbox" id="taskCompleted" name="taskCompleted">
			<label for="taskCompleted">Completado</label>
	
			<button type="button" onclick="addOrUpdateTask()">Agregar/Modificar Tarea</button>
		</form>  -->

		<!-- Tabla de tareas -->
		<h2>Lista de Tareas</h2>
		<table>
			<thead>
				<tr>
					<th>Actividad</th>
					<th>Fecha</th>
					<th>Detalles</th>
					<th>Encargado</th>
					<th>Completado</th>
				</tr>
			</thead>
			<tbody id="tasksTableBody"></tbody>
		</table>
				<!-- <tbody id="taskList">Aquí se insertarán dinámicamente las filas de la tabla -->

		<!-- Barra de progreso -->

		<h2>Progreso</h2>
		<div id="progressBarContainer">
			<progress id="progressBar" max="100" value="0"></progress>
			<span id="progressLabel">0%</span>
		</div>

		<!-- <div class="progress-bar">
			<div class="progress" id="progress"></div>
			<div class="progress-text" id="progressText">0%</div>
		</div> -->
		<script src="tareas.js"></script>
	</body>
	<script src="${scriptUri}" nonce="${nonce}"></script>
	</html>`;
	}
}