import * as vscode from 'vscode';
import { Colaborador, Entidad, Tarea } from '../modelo/entidad';
import { GestorColaboradores, GestorTareas } from '../modelo/gestor';
import { ColaboradorTreeViewAdapter, TareaTreeViewAdapter } from '../modelo/adapter';
import { ColaboradorProvider, TareaProvider } from '../view/treeview';
import { ColaboradorInputHandler, TareaInputHandler } from './input_handler';

class Notificador {

    static notificarEvento(titulo: string, mensaje: string) {
        vscode.window.showInformationMessage(mensaje, { title: titulo });
    }

    static notificarError(titulo: string, mensaje: string) {
        vscode.window.showErrorMessage(mensaje, { title: titulo });
    }
}

export class TareaTreeViewController {

    private provider: TareaProvider;

    constructor(
        private gestorTareas: GestorTareas,
        private gestorColaboradores: GestorColaboradores
    ) {
        this.provider = new TareaProvider(gestorTareas);
        vscode.window.createTreeView('tareas', { treeDataProvider: this.provider });
    }

    async agregarTarea() {
        const nombre = await TareaInputHandler.getNombreFromUsuario();
        if (!nombre || nombre.trim() === '') { return; }
        const fechaLimite = await TareaInputHandler.getFechaLimiteFromUsuario();
        const colaborador = await TareaInputHandler.getColaboradorFromUsuario(this.gestorColaboradores);

        const tarea = new Tarea();
        tarea.nombre = nombre;
        tarea.fechaLimite = fechaLimite;
        if (colaborador) { tarea.encargado = colaborador; }

        const agregado = this.gestorTareas.agregar(tarea);
        if (!agregado) { Notificador.notificarError('Error al crear tarea', `Ya existe una tarea con el nombre '${nombre}'`); }
        this.provider.refresh();
    }

    async eliminarTarea(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            if (await TareaInputHandler.getRespuestaEliminarTareaFromUsuario()) {
                this.gestorTareas.eliminar(nodo.tarea.id);
                this.provider.refresh();
            }
        }
    }

    cambiarEstado(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.completado = !nodo.tarea.completado;
            this.gestorTareas.modificar(nodo.tarea.id, nodo.tarea);
            this.provider.refresh();
        }
    }

    async editarNombre(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            const nombre = await TareaInputHandler.getNombreFromUsuario(nodo.tarea.nombre);
            if (!nombre || nombre.trim() === '') { return; }
            nodo.tarea.nombre = nombre;
            this.gestorTareas.modificar(nodo.tarea.id, nodo.tarea);
            this.provider.refresh();
        }
    }

    async editarFechaLimite(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.fechaLimite = await TareaInputHandler.getFechaLimiteFromUsuario(nodo.tarea.fechaLimite);
            this.gestorTareas.modificar(nodo.tarea.id, nodo.tarea);
            this.provider.refresh();
        }
    }

    async editarEncargado(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.encargado = await TareaInputHandler.getColaboradorFromUsuario(this.gestorColaboradores);
            this.gestorTareas.modificar(nodo.tarea.id, nodo.tarea);
            this.provider.refresh();
        }
    }

    async editarDescripcion(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.descripcion = await TareaInputHandler.getDescripcionFromUsuario(nodo.tarea.descripcion);
            this.gestorTareas.modificar(nodo.tarea.id, nodo.tarea);
            this.provider.refresh();
        }
    }

    verificarFechas() {
        const hoy = new Date();
        for (const tarea of this.gestorTareas.consultarTodos()) {
            const fechaTarea = new Date(tarea.fechaLimite);
            if (this.sonFechasIguales(hoy, fechaTarea)) {
                Notificador.notificarEvento('Recordatorio de tarea', `La tarea '${tarea.nombre}' se entrega hoy.`);
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

export class ColaboradorTreeViewController {

    private provider: ColaboradorProvider;

    constructor(
        private gestor: GestorColaboradores
    ) {
        this.gestor = gestor;
        this.provider = new ColaboradorProvider(gestor);
        vscode.window.createTreeView('colaboradores', { treeDataProvider: this.provider });
    }

    async agregarColaborador() {
        const nombre = await ColaboradorInputHandler.getNombreFromUsuario();
        if (!nombre || nombre.trim() === '') { return; }
        const puesto = await ColaboradorInputHandler.getPuestoFromUsuario();
        const correo = await ColaboradorInputHandler.getCorreoFromUsuario();

        const colaborador = new Colaborador();
        colaborador.nombre = nombre;
        colaborador.puesto = puesto;
        colaborador.correo = correo;

        this.gestor.agregar(colaborador);
        this.provider.refresh();
    }

    async eliminarColaborador(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            if (await ColaboradorInputHandler.getRespuestaEliminarColaboradorFromUsuario()) {
                this.gestor.eliminar(nodo.colaborador.id);
                this.provider.refresh();
            }
        }
    }

    async editarNombre(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            const nombre = await ColaboradorInputHandler.getNombreFromUsuario(nodo.colaborador.nombre);
            if (nombre && nombre.trim() !== '') { nodo.colaborador.nombre = nombre; }
            this.gestor.modificar(nodo.colaborador.id, nodo.colaborador);
            this.provider.refresh();
        }
    }

    async editarPuesto(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            nodo.colaborador.puesto = await ColaboradorInputHandler.getPuestoFromUsuario(nodo.colaborador.puesto);
            this.gestor.modificar(nodo.colaborador.id, nodo.colaborador);
            this.provider.refresh();
        }
    }

    async editarCorreo(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            nodo.colaborador.correo = await ColaboradorInputHandler.getCorreoFromUsuario(nodo.colaborador.correo);
            this.gestor.modificar(nodo.colaborador.id, nodo.colaborador);
            this.provider.refresh();
        }
    }
}