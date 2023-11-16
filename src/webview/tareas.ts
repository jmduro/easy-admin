import * as vscode from "vscode";

export class TareaPanel {
    public static currentPanel: TareaPanel | undefined;

    public static readonly viewType = "swiper";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

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
        const scriptTarea = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "webview/tareas.js")
        );
        const stylesResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/reset.css")
        );
        const stylesMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "media/vscode.css")
        );
        const stylesSkinUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "webview/tareas.css")
        );

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesResetUri}" rel="stylesheet">
            <link href="${stylesMainUri}" rel="stylesheet">
            <link rel="stylesheet" href="${stylesSkinUri}">
        </head>
        <body>
            <h1>Actividades</h1>
            <!-- Tabla de tareas -->
            <h2>Lista de Tareas</h2>
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
                <tbody id="tasksTableBody"></tbody>
            </table>

            <!-- Barra de progreso -->
            <div>
                <label for="progressBar">Progress:</label>
                <progress id="progressBar" value="0" max="100"></progress>
                <span id="progressLabel">0%</span>
                <!-- Agrega este botón al final de tu cuerpo HTML -->
                <button id="updateProgressButton">Actualizar Progreso</button>
            </div>

            <script src="${scriptTarea}"></script>
        </body>
        <script src="${scriptUri}" ></script>
        </html>`;
    }
}
