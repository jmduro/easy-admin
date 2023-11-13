import { Tarea, Encargado } from "./entidad";

interface Gestor<T> {
    agregar(entidad: T): void;
    modificar(entidadActual: T, entidadNueva: T): void;
    eliminar(entidad: T): void;
    buscar(entidad: T): T;
    consultarTodos(): Array<T>;
}

export class GestorTareas implements Gestor<Tarea> {
    
    
    agregar(entidad: Tarea): void {
        throw new Error("Method not implemented.");
    }
    modificar(entidadActual: Tarea, entidadNueva: Tarea): void {
        throw new Error("Method not implemented.");
    }
    eliminar(entidad: Tarea): void {
        throw new Error("Method not implemented.");
    }
    buscar(entidad: Tarea): Tarea {
        throw new Error("Method not implemented.");
    }
    consultarTodos(): Tarea[] {
        throw new Error("Method not implemented.");
    }

}

export class GestorEncargados implements Gestor<Encargado> {
    agregar(entidad: Encargado): void {
        throw new Error("Method not implemented.");
    }
    modificar(entidadActual: Encargado, entidadNueva: Encargado): void {
        throw new Error("Method not implemented.");
    }
    eliminar(entidad: Encargado): void {
        throw new Error("Method not implemented.");
    }
    buscar(entidad: Encargado): Encargado {
        throw new Error("Method not implemented.");
    }
    consultarTodos(): Encargado[] {
        throw new Error("Method not implemented.");
    }

}