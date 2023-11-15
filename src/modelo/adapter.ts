import { QuickPickItem, TreeItem } from 'vscode';
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

export class ColaboradorQuickPickAdapter implements QuickPickItem {

    colaborador?: Colaborador;
    label: string;

    constructor(colaborador?: Colaborador) {
        this.colaborador = colaborador;
        if (colaborador) {
            this.label = colaborador.nombre;
        } else {
            this.label = '';
        }
    }
}