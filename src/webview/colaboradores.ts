import * as vscode from "vscode";
import { GestorColaboradores, GestorTareas } from "../modelo/gestor";
import { Colaborador } from "../modelo/entidad";

export class ColaboradorPanel {
	public static currentPanel: ColaboradorPanel | undefined;

	public static readonly viewType = "swiper";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	private gestorColaboradores = GestorColaboradores.getInstance();

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (ColaboradorPanel.currentPanel) {
			ColaboradorPanel.currentPanel._panel.reveal(column);
			ColaboradorPanel.currentPanel._update();
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			ColaboradorPanel.viewType,
			"Colaboradores",
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(extensionUri, "src/media"),
					vscode.Uri.joinPath(extensionUri, "src/webview"),
				],
			}
		);

		ColaboradorPanel.currentPanel = new ColaboradorPanel(panel, extensionUri);
	}

	public static kill() {
		ColaboradorPanel.currentPanel?.dispose();
		ColaboradorPanel.currentPanel = undefined;
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		ColaboradorPanel.currentPanel = new ColaboradorPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		this._update();

		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
	}

	public dispose() {
		ColaboradorPanel.currentPanel = undefined;
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

		const colaboradores = this.obtenerTodosLosColaboradores();

		this._panel.webview.html = this._getHtmlForWebview(webview, colaboradores);
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

	private _getHtmlForWebview(webview: vscode.Webview, colaboradores: Colaborador[]) {
		const stylesResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
		);
		const stylesMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
		);
		const stylesSkinUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "webview/colaboradores.css")
		);
		const colaboradoresTableBody = colaboradores.map(colab => `
			<tr>
				<td>${colab.nombre}</td>
				<td>${colab.correo}</td>
				<td>${colab.puesto}</td>
			</tr>
		`).join('');

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<link href="${stylesSkinUri}" rel="stylesheet">
			</head>
			<body>
				<!-- Tabla de tareas -->
				<h1>Lista de Colaboradores</h1>
				<table id="colabTable">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Correo</th>
							<th>Puesto</th>
						</tr>
					</thead>
					<tbody id="colaboradoresTableBody">${colaboradoresTableBody}</tbody>
				</table>
			</body>
			</html>`;
	}

	private obtenerTodosLosColaboradores(): Colaborador[] {
		return this.gestorColaboradores.consultarTodos();
	}
}
