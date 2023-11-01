import * as vscode from 'vscode';
import { Tarea } from './tarea';

export class TareaService {
    private tareas: Tarea[] = [];

    getTareas(): Tarea[] {
        return this.tareas;
    }

    agregarTarea(nombre: string) {
        this.tareas.push(new Tarea(
            nombre,
            false,
            vscode.TreeItemCollapsibleState.None
        ));
    }

    eliminarTarea(index: number) {
        if (index >= 0 && index < this.tareas.length) {
            this.tareas.splice(index, 1);
        }
    }

    alternarEstado(index: number) {
        if (index >= 0 && index < this.tareas.length) {
            this.tareas[index].completado = !this.tareas[index].completado;
        }
    }
}