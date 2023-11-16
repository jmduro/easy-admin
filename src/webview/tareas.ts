import * as vscode from "vscode";
import { GestorTareas } from "../modelo/gestor";
import { Tarea } from "../modelo/entidad";

export class TareaPanel {
    public static currentPanel: TareaPanel | undefined;

    public static readonly viewType = "swiper";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private gestorTareas = GestorTareas.getInstance();

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (TareaPanel.currentPanel) {
            TareaPanel.currentPanel._panel.reveal(column);
            TareaPanel.currentPanel._update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            TareaPanel.viewType,
            "Tareas",
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, "src/media"),
                    vscode.Uri.joinPath(extensionUri, "src/webview"),
                ],
            }
        );

        TareaPanel.currentPanel = new TareaPanel(panel, extensionUri);
    }

    public static kill() {
        TareaPanel.currentPanel?.dispose();
        TareaPanel.currentPanel = undefined;
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        TareaPanel.currentPanel = new TareaPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        TareaPanel.currentPanel = undefined;
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
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview, tareas: Tarea[]) {
        const stylesResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
        );
        const stylesMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
        );
        const stylesSkinUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "webview/tareas.css")
        );

        const tasksTableBody = tareas.map(task => `
            <tr>
                <td>${task.nombre}</td>
                <td>${new Date(task.fechaLimite).toDateString()}</td>
                <td>${task.descripcion}</td>
                <td>${task.encargado ? task.encargado : ''}</td>
                <td>
                    <input type="checkbox" name="completed" ${task.completado ? 'checked' : ''}>
                </td>
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
                <link rel="stylesheet" href="${stylesSkinUri}">
            </head>
            <body>
                <!-- Tabla de tareas -->
                <h1>Lista de Tareas</h1>
                <table id="tasksTable">
                    <thead>
                        <tr>
                            <th>Actividad</th>
                            <th>Fecha</th>
                            <th>Detalles</th>
                            <th>Asignado</th>
                            <th>Completado</th>
                        </tr>
                    </thead>
                    <tbody id="tasksTableBody">${tasksTableBody}</tbody>
                </table>

                <!-- Barra de progreso -->
                <div>
                    <label for="progressBar">Progress:</label>
                    <progress id="progressBar" value="0" max="100"></progress>
                    <span id="progressLabel">0%</span>
                </div>
            </body>
            </html>`;
    }
    private obtenerTodasLasTareas(): Tarea[] {
        return this.gestorTareas.consultarTodos();
    }
}