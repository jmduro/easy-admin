import { TreeItem } from 'vscode';
import { Tarea } from './entidad';

export class TareaTreeViewAdapter extends TreeItem {

    public tarea?: Tarea;

    constructor(tarea?: Tarea) {
        super('');
        this.tarea = tarea;
    }
}