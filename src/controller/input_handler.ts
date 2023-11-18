import * as vscode from 'vscode';
import { ColaboradorQuickPickAdapter } from '../modelo/adapter';
import { GestorColaboradores } from '../modelo/gestor';

export class TareaInputHandler {

    static async getNombreFromUsuario(value?: string) {
        return await vscode.window.showInputBox({ prompt: 'Nombre de la tarea', value: value });
    }

    static async getFechaLimiteFromUsuario(value?: Date) {
        const opcion = await vscode.window.showQuickPick(['Hoy', 'Mañana', 'Pasado mañana', 'En tres días', 'Fecha específica'], { placeHolder: 'Elige una opción para la fecha límite' });
        const today = new Date();
        if (opcion) {
            const date = new Date(today);
            switch (opcion) {
                case 'Hoy':
                    return today;
                case 'Mañana':
                    date.setDate(today.getDate() + 1);
                    return date;
                case 'Pasado mañana':
                    date.setDate(today.getDate() + 2);
                    return date;
                case 'En tres días':
                    date.setDate(today.getDate() + 3);
                    return date;
                case 'Fecha específica':
                    const specificDate = await TareaInputHandler.getFechaPersonalizadaFromUsuario();
                    if (specificDate) { return specificDate; }
                    break;
                default:
                    return today;
            }
        }
        return value ? value : today;
    }

    private static async getFechaPersonalizadaFromUsuario() {
        const input = await vscode.window.showInputBox({ prompt: 'Ingresa la fecha límite para la tarea' });
        if (input) {
            return TareaInputHandler.parseDateString(input);
        }
        return new Date();
    }

    private static parseDateString(inputString: string) {
        const patterns = [
            /^(\d{1,2})[-/\s](\d{1,2})[-/\s](\d{4})$/, // dd mm yyyy o dd-mm-yyyy
            /^(\d{1,2})[-/\s](\d{1,2})$/, // dd mm o dd-mm
            /^(\d{1,2})$/ // dd
        ];

        for (const pattern of patterns) {
            const match = inputString.match(pattern);
            if (match) {
                const [, dayString, monthString, yearString] = match;
                const year = parseInt(yearString);
                const month = parseInt(monthString) - 1;
                const day = parseInt(dayString);
                if (yearString) { // dd mm yyyy o dd-mm-yyyy
                    return new Date(year, month, day);
                }
                if (monthString) { // dd mm o dd-mm
                    const currentYear = new Date().getFullYear();
                    return new Date(currentYear, month, day);
                }
                if (day > 0) {
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth();
                    const currentDay = new Date().getDate();

                    if (day <= currentDay) {
                        return new Date(currentYear, currentMonth, day);
                    } else {
                        const diff = day - currentDay;
                        const today = new Date();
                        const date = new Date(today);
                        date.setDate(today.getDate() + diff);
                        return date;
                    }
                }
            }
        }
    }

    static async getColaboradorFromUsuario(gestor: GestorColaboradores) {
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