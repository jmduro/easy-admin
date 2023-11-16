import * as vscode from "vscode";
import { GestorTareas } from "../modelo/gestor";
import { Tarea } from "../modelo/entidad";

export class CalendarioPanel {
	public static currentPanel: CalendarioPanel | undefined;

	public static readonly viewType = "swiper";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

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

		const tareas = obtenerTodasLasTareas();

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
                    // Obtener las tareas actualizadas después de agregar una tarea
                    const nuevasTareas = obtenerTodasLasTareas();
                    // Inicializar o actualizar el calendario después de agregar una tarea
                    initCalendar(nuevasTareas);
                    break;
                }
			}
		});
	}
	
	private obtenerTodasLasTareas(): Tarea[] {
        // Lógica para obtener todas las tareas, puedes adaptarla según tu implementación
        const gestorTareas = new GestorTareas();
        return gestorTareas.consultarTodos();
    }

    private initCalendar(tareas: Tarea[]) {
        // Lógica para inicializar o actualizar el calendario con las tareas proporcionadas
        // Puedes usar la lógica que prefieras para trabajar con el calendario
        // Asegúrate de tener la lógica específica de tu calendario aquí
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

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${stylesResetUri}" rel="stylesheet">
			<link href="${stylesMainUri}" rel="stylesheet">
            <link href="${stylesSkinUri}" rel="stylesheet">
            <link href="${stylesSkinUri}" rel="stylesheet">
		</head>
		<body>
			<!-- Agrega un contenedor para el calendario -->
			<div id="calendar"></div>

			<script>
				// Incluye la lógica de FullCalendar aquí
				${this.getFullCalendarScript()}
			</script>
		</body>
	</html>`;
	}

	// Función para obtener la lógica de FullCalendar
    private getFullCalendarScript() {
        return `
            // Importa las bibliotecas de FullCalendar
            import { Calendar } from '@fullcalendar/core';
            import dayGridPlugin from '@fullcalendar/daygrid';

            // Crea el calendario
            const calendarEl = document.getElementById('calendar');
            const calendar = new Calendar(calendarEl, {
                plugins: [dayGridPlugin],
                events: getCalendarEvents(${JSON.stringify(Tarea)}),
            });

            // Renderiza el calendario
            calendar.render();
        `;
    }

	// Función para convertir tareas en eventos del calendario
    private getCalendarEvents(tareas: Tarea[]) {
        return tareas.map((tarea) => ({
            title: tarea.nombre,
            start: tarea.fechaLimite.toISOString().split('T')[0], // Formato: 'YYYY-MM-DD'
            // Puedes agregar más propiedades según tus necesidades
        }));
    }
}
