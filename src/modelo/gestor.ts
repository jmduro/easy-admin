import { Tarea, Colaborador } from "./entidad";

interface Gestor<T> {
    agregar(entidad: T): void;
    modificar(entidadActual: T, entidadNueva: T): void;
    eliminar(entidad: T): void;
    buscar(entidad: T): T[] | undefined;
    consultarUno(entidad: T): T | undefined;
    consultarTodos(): T[];
}

export class GestorTareas implements Gestor<Tarea> {
    private static tareas: Tarea[] = [];

    agregar(entidad: Tarea): void {
        let tarea = this.consultarUno(entidad);
        if (!tarea) {
            GestorTareas.tareas.push(entidad);
        }
    }

    modificar(entidadActual: Tarea, entidadNueva: Tarea): void {
        let tarea = this.consultarUno(entidadActual);
        if (tarea) {
            tarea = entidadNueva;
        }
    }

    eliminar(entidad: Tarea): void {
        let tarea = this.consultarUno(entidad);
        if (tarea) {
            GestorTareas.tareas.splice(GestorTareas.tareas.indexOf(tarea), 1);
        }
    }

    buscar(entidad: Tarea): Tarea[] | undefined {
        return GestorTareas.tareas.filter(tarea => tarea.like(entidad));
    }

    consultarUno(entidad: Tarea): Tarea | undefined {
        return GestorTareas.tareas.find(tarea => tarea.equals(entidad));
    }

    consultarTodos(): Tarea[] {
        return GestorTareas.tareas;
    }
}

export class GestorColaboradores implements Gestor<Colaborador> {
    private static colaboradores: Colaborador[] = [];

    agregar(entidad: Colaborador): void {
        let colaborador = this.consultarUno(entidad);
        if (!colaborador) {
            GestorColaboradores.colaboradores.push(entidad);
        }
    }

    modificar(entidadActual: Colaborador, entidadNueva: Colaborador): void {
        let colaborador = this.consultarUno(entidadActual);
        if (colaborador) {
            colaborador = entidadNueva;
        }
    }

    eliminar(entidad: Colaborador): void {
        let colaborador = this.consultarUno(entidad);
        if (colaborador) {
            GestorColaboradores.colaboradores.splice(GestorColaboradores.colaboradores.indexOf(colaborador), 1);
        }
    }

    buscar(entidad: Colaborador): Colaborador[] | undefined {
        return GestorColaboradores.colaboradores.filter(colaborador => colaborador.like(entidad));
    }

    consultarUno(entidad: Colaborador): Colaborador | undefined {
        return GestorColaboradores.colaboradores.find(colaborador => colaborador.equals(entidad));
    }

    consultarTodos(): Colaborador[] {
        return GestorColaboradores.colaboradores;
    }

}