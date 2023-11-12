import * as vscode from 'vscode';
import * as path from 'path';

export class Panel {
    private static _panel: vscode.WebviewPanel | undefined;

    public static createOrShow(context: vscode.ExtensionContext) {
        if (this._panel) {
            this._panel.reveal(vscode.ViewColumn.One);
        } else {
            this._panel = vscode.window.createWebviewPanel(
                'miExtension',
                'Mi Extensión',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(context.extensionPath)]
                }
            );

            this._panel.webview.html = this.getWebviewContent(context.extensionPath);
        }
    }

    private static getWebviewContent(extensionPath: string): string {
        const htmlPath = vscode.Uri.file(path.join(extensionPath, 'web', 'index.html'));
        return htmlPath.fsPath;
    }
}
