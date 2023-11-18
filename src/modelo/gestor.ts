import * as vscode from 'vscode';
import { Tarea, Colaborador, Entidad } from "./entidad";

export interface Gestor<T extends Entidad> {

    agregar(entidad: T): void;
    modificar(id: number, entidad: T): void; // TODO: Este método DEBE ser utilizado para modificar los objetos.
    eliminar(id: number): void;
    consultarUno(id: number): T | undefined;
    consultarTodos(): T[];
}

export abstract class GestorAbstracto<T extends Entidad> implements Gestor<T> {

    protected id: number = 1;
    protected entidades: T[] = [];

    agregar(entidad: T): void {
        if (entidad.equals(this.consultarUno(entidad.id))) { return; }
        entidad.id = this.id;
        this.id++;
        this.entidades.push(entidad);
        this.guardarCambios();
    }

    modificar(id: number, entidad: T): void {
        let e = this.consultarUno(id);
        if (e) { e = entidad; }
        this.guardarCambios();
    }

    eliminar(id: number): void {
        let e = this.consultarUno(id);
        if (e) { this.entidades.splice(this.entidades.indexOf(e), 1); }
        this.guardarCambios();
    }

    consultarUno(id: number): T | undefined {
        if (id <= 0) { return undefined; }
        return this.entidades.find(e => e.id === id);
    }

    consultarTodos(): T[] {
        return this.entidades;
    }

    protected abstract guardarCambios(): void;
}

export class GestorTareas extends GestorAbstracto<Tarea> {

    constructor(
        private context: vscode.ExtensionContext
    ) {
        super();
        this.entidades = this.context.globalState.get<Tarea[]>('tareas', []);
    }

    protected guardarCambios(): void {
        this.context.globalState.update('tareas', this.entidades);
    }
}

export class GestorColaboradores extends GestorAbstracto<Colaborador> {

    constructor(
        private context: vscode.ExtensionContext
    ) {
        super();
        this.entidades = this.context.globalState.get<Colaborador[]>('colaboradores', []);
    }

    protected guardarCambios(): void {
        this.context.globalState.update('colaboradores', this.entidades);
    }
}

export class GestorFactory {
    private static gestorTareas: GestorTareas;
    private static gestorColaboradores: GestorColaboradores;

    static getGestorTareas(context?: vscode.ExtensionContext): GestorTareas {
        if (context) { GestorFactory.gestorTareas = new GestorTareas(context); }
        return GestorFactory.gestorTareas;
    }

    static getGestorColaboradores(context?: vscode.ExtensionContext): GestorColaboradores {
        if (context) { GestorFactory.gestorColaboradores = new GestorColaboradores(context); }
        return GestorFactory.gestorColaboradores;
    }
}