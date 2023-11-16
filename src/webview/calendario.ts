import * as vscode from "vscode";
import { GestorTareas } from "../modelo/gestor";
import { Tarea } from "../modelo/entidad";

export class CalendarioPanel {
	public static currentPanel: CalendarioPanel | undefined;

	public static readonly viewType = "swiper";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	private gestorTareas = GestorTareas.getInstance();

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (CalendarioPanel.currentPanel) {
			CalendarioPanel.currentPanel._panel.reveal(column);
			CalendarioPanel.currentPanel._update();
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			CalendarioPanel.viewType,
			"Calendario",
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(extensionUri, "src/media"),
					vscode.Uri.joinPath(extensionUri, "src/webview"),
					vscode.Uri.file(vscode.extensions.getExtension('easy-admin')?.extensionPath || ''),
				],
			}
		);

		CalendarioPanel.currentPanel = new CalendarioPanel(panel, extensionUri);
	}

	public static kill() {
		CalendarioPanel.currentPanel?.dispose();
		CalendarioPanel.currentPanel = undefined;
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		CalendarioPanel.currentPanel = new CalendarioPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		this._update();

		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
	}

	public dispose() {
		CalendarioPanel.currentPanel = undefined;
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

        const tareas = this.obtenerTodasLasTareas();

		this._panel.webview.html = this._getHtmlForWebview(webview, tareas);
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
				case "tareaAgregada": {
                    const nuevasTareas = this.obtenerTodasLasTareas();
                    this.initCalendar(nuevasTareas);
                    break;
                }
			}
		});
	}

	private obtenerTodasLasTareas(): Tarea[] {
		const gestorTareas = GestorTareas.getInstance();
		return gestorTareas.consultarTodos();
	}

	private initCalendar(tareas: Tarea[]) {
		console.log("Inicializando o actualizando el calendario con las tareas:", tareas);
	}
	

	private _getHtmlForWebview(webview: vscode.Webview, tareas: Tarea[]) {
		const stylesResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
		);
		const stylesMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
		);
		const stylesSkinUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "webview/calendario.css")
		);

		return `
		<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesResetUri}" rel="stylesheet">
            <link href="${stylesMainUri}" rel="stylesheet">
            <link href="${stylesSkinUri}" rel="stylesheet">
            <style>
                #calendar {
                    font-family: Arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }
                #calendar th, #calendar td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }
            </style>
        </head>
        <body>
            <table id="calendar">
                <thead>
                    <tr>
                        <th>Domingo</th>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                        <th>Sábado</th>
                    </tr>
                </thead>
                <tbody id="calendarBody"></tbody>
            </table>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const tareas = ${this.gestorTareas.consultarTodos()};
                    const calendarBody = document.getElementById('calendarBody');
                    ${this.initCalendarScript()}
                });
            </script>
		</body>
		</html>`;
		
	}

	private initCalendarScript() {
		return `
			const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
			const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
	
			let calendarHTML = '<tr>';
			let dayCount = 1;
	
			// Rellena los días de la semana
			for (let i = 0; i < 7; i++) {
				calendarHTML += '<th>' + new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(0, 0, i + 1)) + '</th>';
			}
			calendarHTML += '</tr>';
	
			// Rellena el calendario
			for (let i = 0; i < 6; i++) {
				calendarHTML += '<tr>';
				for (let j = 0; j < 7; j++) {
					if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
						calendarHTML += '<td></td>';
					} else {
						const isTaskDay = tareas.some(tarea => {
							const tareaDay = tarea.fechaLimite.getDate();
							return tareaDay === dayCount;
						});
	
						calendarHTML += '<td ' + (isTaskDay ? 'class="task-day"' : '') + '>' + dayCount + '</td>';
						dayCount++;
					}
				}
				calendarHTML += '</tr>';
			}
	
			calendarBody.innerHTML = calendarHTML;
		`;
	}
	
	
}
