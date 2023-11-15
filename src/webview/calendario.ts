import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { GestorTareas } from "../modelo//gestor";

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
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/main.js")
		);
		const stylesResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
		);
		const stylesMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
		);
		const stylesSkinUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "webview/calendario.css")
		);

		const nonce = getNonce();

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
    <div id="calendario"></div>

		<script>
		// Carga dinámica de eventos aquí
                    const calendarEl = document.getElementById("calendario");

                    // Obtén la información de tareas desde tu extensión
                    const vscode = acquireVsCodeApi();
                    const tareas = vscode.getState().tareas || [];

                    tareas.forEach(tarea => {
                        // Agrega un evento por cada tarea
                        const event = document.createElement('div');
                        event.className = 'event';
                        event.innerText = tarea.nombre;
                        calendarEl.appendChild(event);
                    });
		</script>
	</body>
	<script src="${scriptUri}" ></script>
	</html>`;
	}
}
