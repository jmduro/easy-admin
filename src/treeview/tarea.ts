import * as vscode from 'vscode';

export class Tarea extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public completado: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}