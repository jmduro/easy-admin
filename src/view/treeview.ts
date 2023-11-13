import * as vscode from 'vscode';
import { TareaTreeViewAdapter } from '../modelo/adapter';
import { GestorTareas } from '../modelo/gestor';

export class TareaProvider implements vscode.TreeDataProvider<TareaTreeViewAdapter> {

    constructor(
        private gestor: GestorTareas
    ) { }

    getTareas(): TareaTreeViewAdapter[] {
        const arr: vscode.TreeItem[] = this.gestor.consultarTodos().map(tarea => {
            let item: TareaTreeViewAdapter = new TareaTreeViewAdapter(tarea);
            item.label = tarea.nombre;
            item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            if (tarea.completado === 'Sí') {
                item.iconPath = new vscode.ThemeIcon('circle-filled');
            } else {
                item.iconPath = new vscode.ThemeIcon('circle-outline');
            }
            item.tooltip = tarea.nombre;
            item.contextValue = 'tarea';
            return item;
        });
        return arr;
    }

    getAtributos(element: TareaTreeViewAdapter): TareaTreeViewAdapter[] {
        const items: TareaTreeViewAdapter[] = [];
        let item: TareaTreeViewAdapter;

        // Fecha límite
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Fecha límite';
        item.description = item.tarea?.fechaLimite;
        item.tooltip = item.tarea?.fechaLimite;
        items.push(item);
        // Encargado
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Encargado';
        item.description = item.tarea?.encargado;
        item.tooltip = item.tarea?.encargado;
        items.push(item);
        // Descripción
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Descripción';
        item.description = item.tarea?.descripcion;
        item.tooltip = item.tarea?.descripcion;
        items.push(item);
        // Completado
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Completado';
        item.description = item.tarea?.completado;
        item.tooltip = item.tarea?.completado;
        items.push(item);

        return items;
    }

    getTreeItem(element: TareaTreeViewAdapter): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TareaTreeViewAdapter): Thenable<TareaTreeViewAdapter[]> {
        if (element) { // TODO: Devolver un array con los atributos de la tarea
            return Promise.resolve(this.getAtributos(element));
        } else {
            return Promise.resolve(this.getTareas());
        }
    }

    /* Actualización en tiempo real */
    private _onDidChangeTreeData: vscode.EventEmitter<TareaTreeViewAdapter | undefined | null | void> = new vscode.EventEmitter<TareaTreeViewAdapter | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TareaTreeViewAdapter | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

}