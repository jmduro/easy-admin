import { Tarea, Colaborador } from "./entidad";

interface Gestor<T> {
    agregar(entidad: T): void;
    modificar(entidadActual: T, entidadNueva: T): void;
    eliminar(entidad: T): void;
    buscar(entidad: T): T | undefined;
    consultarTodos(): Array<T>;
}

export class GestorTareas implements Gestor<Tarea> {
    private static tareas: Tarea[] = [];

    constructor(tareas?: Tarea[]) {
        if (tareas) { 
            GestorTareas.tareas = tareas;
        }
    }

    agregar(entidad: Tarea): void {
        let tarea = this.buscar(entidad);
        if (!tarea) {
            GestorTareas.tareas.push(entidad);
        }
    }

    modificar(entidadActual: Tarea, entidadNueva: Tarea): void {
        throw new Error("Method not implemented.");
    }

    eliminar(entidad: Tarea): void {
        throw new Error("Method not implemented.");
    }

    buscar(entidad: Tarea): Tarea | undefined {
        return GestorTareas.tareas.find(tarea => tarea.equals(entidad));
    }

    consultarTodos(): Tarea[] {
        return GestorTareas.tareas;
    }

    static obtenerTareas(): Tarea[] {
        return this.tareas;
    }
}

export class GestorEncargados implements Gestor<Colaborador> {
    private static encargados: Tarea[] = [];

    agregar(entidad: Colaborador): void {
        throw new Error("Method not implemented.");
    }
    modificar(entidadActual: Colaborador, entidadNueva: Colaborador): void {
        throw new Error("Method not implemented.");
    }
    eliminar(entidad: Colaborador): void {
        throw new Error("Method not implemented.");
    }
    buscar(entidad: Colaborador): Colaborador {
        throw new Error("Method not implemented.");
    }
    consultarTodos(): Colaborador[] {
        throw new Error("Method not implemented.");
    }

}