import * as vscode from 'vscode';

class Tarea {
    constructor(
        public nombre: string,
        public fechaLimite: Date,
        public encargado: string,
        public descripcion: string,
        public completado: boolean
    ) {

    }

    getDate(): string {
        return this.fechaLimite.toDateString();
    }
}

class Item extends vscode.TreeItem {
    constructor(
        public readonly nombre: string,
        valor: any,
        public readonly padre?: Tarea
    ) {
        super(nombre);
        if (!padre) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }
        this.description = this.getValue(valor);
        this.tooltip = this.getValue(valor);
    }

    getValue(valor: any): string {
        if (typeof valor === 'boolean') {
            return valor ? 'Sí' : 'No';
        }
        return valor;
    }
}

export class TareaProvider implements vscode.TreeDataProvider<Item> {

    // TODO: Implementar array dinámicas
    private tareas: Tarea[] = [
        new Tarea('Tarea 1', new Date(), 'Alejo', 'Ejemplo', true),
        new Tarea('Tarea 2', new Date(), 'Alejo', 'Otro ejemplo', false)
    ];

    getTareas(): Item[] {
        return this.tareas.map(tarea => new Item(tarea.nombre, ''));
    }

    getAtributos(item: Item): Item[] {
        const items: Item[] = [];
        const tarea: Tarea = this.getTareaFromTareas(item);

        items.push(new Item('Fecha límite', tarea.getDate(), tarea));
        items.push(new Item('Encargado', tarea['encargado'], tarea));
        items.push(new Item('Descripción', tarea['descripcion'], tarea));
        items.push(new Item('Completado', tarea['completado'], tarea));

        return items;
    }

    getTareaFromTareas(item: Item): Tarea {
        let index: number = this.tareas.findIndex(tarea => tarea.nombre === item.label);
        return this.tareas[index];
    }

    getTreeItem(element: Item): vscode.TreeItem {
        if (!element.padre) {
            let tarea: Tarea = this.getTareaFromTareas(element);
            element.iconPath = tarea.completado ? new vscode.ThemeIcon('circle-filled') : new vscode.ThemeIcon('circle-outline');
        }
        return element;
    }

    getChildren(element?: Item): Thenable<Item[]> {
        if (element) { // TODO: Devolver un array con los atributos de la tarea
            return Promise.resolve(this.getAtributos(element));
        } else {
            return Promise.resolve(this.getTareas());
        }
    }

    /* Actualización en tiempo real */
    private _onDidChangeTreeData: vscode.EventEmitter<Item | undefined | null | void> = new vscode.EventEmitter<Item | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Item | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

}