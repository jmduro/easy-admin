import { TreeItem } from 'vscode';
import { Colaborador, Tarea } from './entidad';

export class TareaTreeViewAdapter extends TreeItem {

    public tarea?: Tarea;

    constructor(tarea?: Tarea) {
        super('');
        this.tarea = tarea;
    }
}

export class ColaboradorTreeViewAdapter extends TreeItem {

    public colaborador?: Colaborador;

    constructor(colaborador?: Colaborador) {
        super('');
        this.colaborador = colaborador;
    }
}