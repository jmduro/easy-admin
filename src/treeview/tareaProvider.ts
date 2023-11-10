import * as vscode from 'vscode';
import { TareaService } from './tareaService';
import { Tarea } from './tarea';

export class TareaTreeProviderView implements vscode.TreeDataProvider<Tarea> {

    private _onDidChangeTreeData: vscode.EventEmitter<Tarea | undefined | null | void> = new vscode.EventEmitter<Tarea | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Tarea | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private tareaService: TareaService) { }

    getTreeItem(element: Tarea): vscode.TreeItem {
        return {
            label: element.nombre,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: {
                light: '/resources/light/task.svg',
                dark: '/resources/dark/task.svg'
            }
        };
    }

    // Si se le pasa un element (Tarea) devuelve sus hijos (propiedades)
    // Si no se le pasa un element, significa que es el root (Tarea)
    getChildren(element?: Tarea): Thenable<Tarea[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.tareaService.getTareas());
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
