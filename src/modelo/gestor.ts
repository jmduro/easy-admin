import { Tarea, Colaborador } from "./entidad";
import { window, ExtensionContext } from 'vscode';

interface Gestor<T> {

    agregar(entidad: T): void;
    modificar(id: number, entidad: T): void;
    eliminar(id: number): void;
    buscar(entidad: T): T[] | undefined;
    consultarUno(id: number): T | undefined;
    consultarTodos(): T[];
}

export class GestorTareas implements Gestor<Tarea> {

    private static id: number = 1;
    private static tareas: Tarea[];

    constructor(
        private context: ExtensionContext
    ) {
        GestorTareas.tareas = this.context.globalState.get<Tarea[]>('tareas', []);
    }

    agregar(entidad: Tarea): void {
        let tarea = this.consultarUno(entidad.id);
        if (tarea || entidad.equals(tarea)) { return; }
        entidad.id = GestorTareas.id;
        GestorTareas.tareas.push(entidad);
        this.guardarCambios();
        this.notificarEvento('Tarea creada', `Se ha creado la tarea: ${entidad.nombre}`);
        GestorTareas.id++;
    }

    modificar(id: number, entidad: Tarea): void {
        let tarea = this.consultarUno(id);
        if (tarea) {
            tarea = entidad;
        }
        this.guardarCambios();
    }

    eliminar(id: number): void {
        let tarea = this.consultarUno(id);
        if (tarea) {
            this.notificarEvento('Tarea eliminada', `Se ha eliminado la tarea: ${tarea.nombre}`);
            GestorTareas.tareas.splice(GestorTareas.tareas.indexOf(tarea), 1);
        }
        this.guardarCambios();
    }

    buscar(entidad: Tarea): Tarea[] | undefined {
        return GestorTareas.tareas.filter(tarea => tarea.like(entidad));
    }

    consultarUno(id: number): Tarea | undefined {
        if (id <= 0) { return undefined; }
        return GestorTareas.tareas.find(tarea => tarea.id === id);
    }

    consultarTodos(): Tarea[] {
        return GestorTareas.tareas;
    }

    private guardarCambios() {
        this.context.globalState.update('tareas', GestorTareas.tareas);
    }

    private notificarEvento(titulo: string, mensaje: string) {
        window.showInformationMessage(mensaje, { title: titulo });
    }

    verificarFechas() {
        const hoy = new Date();

        for (const tarea of GestorTareas.tareas) {
            const fechaTarea = new Date(tarea.fechaLimite);
            if (this.sonFechasIguales(hoy, fechaTarea)) {
                this.notificarEvento('Recordatorio de tarea', `La tarea '${tarea.nombre}' se entrega hoy.`);
            }
        }
    }

    private sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
        return (
            fecha1.getFullYear() === fecha2.getFullYear() &&
            fecha1.getMonth() === fecha2.getMonth() &&
            fecha1.getDate() === fecha2.getDate()
        );
    }
}

export class GestorColaboradores implements Gestor<Colaborador> {

    private static id: number = 1;
    private static colaboradores: Colaborador[];

    constructor(
        private context: ExtensionContext
    ) {
        GestorColaboradores.colaboradores = this.context.globalState.get<Colaborador[]>('colaboradores', []);
    }

    agregar(entidad: Colaborador): void {
        let colaborador = this.consultarUno(entidad.id);
        if (colaborador || entidad.equals(colaborador)) { return; }
        entidad.id = GestorColaboradores.id;
        GestorColaboradores.colaboradores.push(entidad);
        GestorColaboradores.id++;
        this.guardarCambios();
    }

    modificar(id: number, entidad: Colaborador): void {
        let colaborador = this.consultarUno(id);
        if (colaborador) {
            colaborador = entidad;
        }
        this.guardarCambios();
    }

    eliminar(id: number): void {
        let colaborador = this.consultarUno(id);
        if (colaborador) {
            GestorColaboradores.colaboradores.splice(GestorColaboradores.colaboradores.indexOf(colaborador), 1);
        }
        this.guardarCambios();
    }

    buscar(entidad: Colaborador): Colaborador[] | undefined {
        return GestorColaboradores.colaboradores.filter(colaborador => colaborador.like(entidad));
    }

    consultarUno(id: number): Colaborador | undefined {
        if (id <= 0) { return undefined; }
        return GestorColaboradores.colaboradores.find(colaborador => colaborador.id === id);
    }

    consultarTodos(): Colaborador[] {
        return GestorColaboradores.colaboradores;
    }

    private guardarCambios() {
        this.context.globalState.update('colaboradores', GestorColaboradores.colaboradores);
    }
}