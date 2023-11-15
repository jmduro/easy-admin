import * as vscode from 'vscode';
import { GestorColaboradores } from '../modelo/gestor';
import { ColaboradorQuickPickAdapter } from '../modelo/adapter';

export class TareaInputHandler {

    static async getNombreFromUsuario() {
        return await vscode.window.showInputBox({ prompt: 'Nombre de la tarea' });
    }

    static async getColaboradorFromUsuario() {
        const gestor = new GestorColaboradores();
        const opcionesColaborador = gestor.consultarTodos().map(colaborador => new ColaboradorQuickPickAdapter(colaborador));
        opcionesColaborador.unshift(new ColaboradorQuickPickAdapter());  // Opción vacía
        const colaboradorQuickPickItem = await vscode.window.showQuickPick(opcionesColaborador, { placeHolder: 'Elige un colaborador (Deja en blanco para no seleccionar ninguno.)' });
        if (colaboradorQuickPickItem) {
            return colaboradorQuickPickItem.colaborador;
        }
        return undefined;
    }

    static async getDescripcionFromUsuario(value?: string) {
        const descripcion = await vscode.window.showInputBox({ prompt: 'Descripción de la tarea', value: value });
        return descripcion ? descripcion : '';
    }

    static async getRespuestaEliminarTareaFromUsuario() {
        const respuesta = await vscode.window.showQuickPick(['Sí', 'No'], { placeHolder: '¿Está seguro de querer eliminar esta tarea?' });
        if (respuesta && respuesta === 'Sí') { return true; }
        return false;
    }
}

export class ColaboradorInputHandler {

    static async getNombreFromUsuario(value?: string) {
        return await vscode.window.showInputBox({ prompt: 'Nombre del colaborador', value: value });
    }

    static async getPuestoFromUsuario(value?: string) {
        const puesto = await vscode.window.showInputBox({ prompt: 'Puesto del colaborador', value: value });
        return puesto ? puesto : '';
    }

    static async getCorreoFromUsuario(value?: string) {
        const correo = await vscode.window.showInputBox({ prompt: 'Correo del colaborador', value: value });
        return correo ? correo : '';
    }

    static async getRespuestaEliminarColaboradorFromUsuario() {
        const respuesta = await vscode.window.showQuickPick(['Sí', 'No'], { placeHolder: '¿Está seguro de querer eliminar este colaborador?' });
        if (respuesta && respuesta === 'Sí') { return true; }
        return false;
    }
}