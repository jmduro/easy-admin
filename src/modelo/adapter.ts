import * as vscode from 'vscode';
import { Tarea } from './entidad';

export class TareaTreeViewAdapter extends vscode.TreeItem {

    public tarea?: Tarea;

    constructor(tarea?: Tarea) {
        super('');
        this.tarea = tarea;
    }
}