import * as vscode from 'vscode';
import { ColaboradorTreeViewAdapter, TareaTreeViewAdapter } from '../modelo/adapter';
import { GestorColaboradores, GestorTareas } from '../modelo/gestor';

export class TareaProvider implements vscode.TreeDataProvider<TareaTreeViewAdapter> {

    constructor(
        private gestor: GestorTareas
    ) { }

    getTareas(): TareaTreeViewAdapter[] {
        const arr: vscode.TreeItem[] = this.gestor.consultarTodos().map(tarea => {
            let item: TareaTreeViewAdapter = new TareaTreeViewAdapter(tarea);
            item.label = tarea.nombre;
            item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            item.iconPath = tarea.completado ? new vscode.ThemeIcon('circle-filled') : new vscode.ThemeIcon('circle-outline');;
            item.tooltip = item.label;
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
        item.tooltip = item.description;
        item.contextValue = 'fechaLimiteTarea';
        items.push(item);
        // Encargado
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Encargado';
        item.description = item.tarea?.encargado;
        item.tooltip = item.description;
        item.contextValue = 'encargadoTarea';
        items.push(item);
        // Descripción
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Descripción';
        item.description = item.tarea?.descripcion;
        item.tooltip = item.description;
        item.contextValue = 'descripcionTarea';
        items.push(item);
        // Completado
        item = new TareaTreeViewAdapter(element.tarea);
        item.label = 'Completado';
        item.description = item.tarea?.completado ? 'Sí' : 'No';
        item.tooltip = item.description;
        items.push(item);

        return items;
    }

    getTreeItem(element: TareaTreeViewAdapter): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TareaTreeViewAdapter): Thenable<TareaTreeViewAdapter[]> {
        if (element) {
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

export class ColaboradorProvider implements vscode.TreeDataProvider<ColaboradorTreeViewAdapter> {

    constructor(
        private gestor: GestorColaboradores
    ) { }

    getColaboradores(): ColaboradorTreeViewAdapter[] {
        const arr: vscode.TreeItem[] = this.gestor.consultarTodos().map(colaborador => {
            let item: ColaboradorTreeViewAdapter = new ColaboradorTreeViewAdapter(colaborador);
            item.label = colaborador.nombre;
            item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            item.description = colaborador.puesto;
            item.tooltip = item.label;
            item.iconPath = new vscode.ThemeIcon('account');
            item.contextValue = 'colaborador';
            return item;
        });
        return arr;
    }

    getAtributos(element: ColaboradorTreeViewAdapter): ColaboradorTreeViewAdapter[] {
        const items: ColaboradorTreeViewAdapter[] = [];
        let item: ColaboradorTreeViewAdapter;

        // Nombre
        item = new ColaboradorTreeViewAdapter(element.colaborador);
        item.label = 'Nombre';
        item.description = item.colaborador?.nombre;
        item.tooltip = item.description;
        item.contextValue = 'nombreColaborador';
        items.push(item);
        // Puesto
        item = new ColaboradorTreeViewAdapter(element.colaborador);
        item.label = 'Puesto';
        item.description = item.colaborador?.puesto;
        item.tooltip = item.description;
        item.contextValue = 'puestoColaborador';
        items.push(item);
        // Correo
        item = new ColaboradorTreeViewAdapter(element.colaborador);
        item.label = 'Correo';
        item.description = item.colaborador?.correo;
        item.tooltip = item.description;
        item.contextValue = 'correoColaborador';
        items.push(item);

        return items;
    }

    getTreeItem(element: ColaboradorTreeViewAdapter): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ColaboradorTreeViewAdapter): vscode.ProviderResult<ColaboradorTreeViewAdapter[]> {
        if (element) {
            return Promise.resolve(this.getAtributos(element));
        } else {
            return Promise.resolve(this.getColaboradores());
        }
    }

    /* Actualización en tiempo real */
    private _onDidChangeTreeData: vscode.EventEmitter<ColaboradorTreeViewAdapter | undefined | null | void> = new vscode.EventEmitter<ColaboradorTreeViewAdapter | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ColaboradorTreeViewAdapter | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}