import * as vscode from 'vscode';

export class Tarea /*extends vscode.TreeItem*/ {
    /*
    constructor(
        public readonly label: string,
        public completado: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    iconPath = {
        light: '/resources/light/task.svg',
        dark: '/resources/dark/task.svg'
    };
    */

    constructor(
        public nombre: string,
        public fecha?: string,
        public detalles?: string,
        public encargado?: string,
        public completado?: boolean
    ) { }
}