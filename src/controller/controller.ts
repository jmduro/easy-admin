import * as vscode from 'vscode';
import { Colaborador, Tarea } from '../modelo/entidad';
import { GestorColaboradores, GestorTareas } from '../modelo/gestor';
import { ColaboradorTreeViewAdapter, TareaTreeViewAdapter } from '../modelo/adapter';
import { ColaboradorProvider, TareaProvider } from '../view/treeview';
import { ColaboradorInputHandler, TareaInputHandler } from './inputHandler';

export class Controller {

    tareaController: TareaController;
    colaboradorController: ColaboradorController;

    constructor(context: vscode.ExtensionContext) {
        // Gestores
        const gestorTareas = new GestorTareas(context);
        const gestorColaboradores = new GestorColaboradores(context);

        // Proveedores para TreeViews
        const tareaProvider = new TareaProvider(gestorTareas);
        const colaboradorProvider = new ColaboradorProvider(gestorColaboradores);

        // Controladores y vistas
        this.tareaController = new TareaController(gestorTareas, gestorColaboradores, tareaProvider);
        this.colaboradorController = new ColaboradorController(gestorColaboradores, tareaProvider, colaboradorProvider);
        vscode.window.createTreeView('tareas', { treeDataProvider: tareaProvider });
        vscode.window.createTreeView('colaboradores', { treeDataProvider: colaboradorProvider });

        // this.loadValues(gestorTareas, gestorColaboradores);  // ! Borrar en producción
    }

    private loadValues(gestorTareas: GestorTareas, gestorColaboradores: GestorColaboradores) {
        let colaborador: Colaborador;

        colaborador = new Colaborador();
        colaborador.nombre = 'Alejo';

        gestorColaboradores.agregar(colaborador);

        let tarea: Tarea;

        tarea = new Tarea();
        tarea.nombre = 'Tarea 1';
        tarea.encargado = colaborador;
        tarea.descripcion = 'Ejemplo';
        tarea.completado = true;
        gestorTareas.agregar(tarea);

        tarea = new Tarea();
        tarea.nombre = 'Tarea 2';
        tarea.encargado = colaborador;
        tarea.descripcion = 'Otro ejemplo';
        gestorTareas.agregar(tarea);
    }
}

export class TareaController {

    constructor(
        private gestorTareas: GestorTareas,
        private gestorColaboradores: GestorColaboradores,
        private tareaProvider: TareaProvider
    ) { }

    async agregarTarea() {
        const nombre = await TareaInputHandler.getNombreFromUsuario();
        if (!nombre || nombre.trim() === '') { return; }
        const fechaLimite = await TareaInputHandler.getFechaLimiteFromUsuario();
        const colaborador = await TareaInputHandler.getColaboradorFromUsuario(this.gestorColaboradores);

        const tarea = new Tarea();
        tarea.nombre = nombre;
        tarea.fechaLimite = fechaLimite;
        if (colaborador) { tarea.encargado = colaborador; }

        this.gestorTareas.agregar(tarea);
        this.tareaProvider.refresh();
    }

    async eliminarTarea(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            if (await TareaInputHandler.getRespuestaEliminarTareaFromUsuario()) {
                this.gestorTareas.eliminar(nodo.tarea.id);
                this.tareaProvider.refresh();
            }
        }
    }

    cambiarEstado(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.completado = !nodo.tarea.completado;
            this.tareaProvider.refresh();
        }
    }

    async editarNombre(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            const nombre = await TareaInputHandler.getNombreFromUsuario(nodo.tarea.nombre);
            if (!nombre || nombre.trim() === '') { return; }
            nodo.tarea.nombre = nombre;
            this.tareaProvider.refresh();
        }
    }

    async editarFechaLimite(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.fechaLimite = await TareaInputHandler.getFechaLimiteFromUsuario(nodo.tarea.fechaLimite);
            this.tareaProvider.refresh();
        }
    }

    async editarEncargado(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.encargado = await TareaInputHandler.getColaboradorFromUsuario(this.gestorColaboradores);
            this.tareaProvider.refresh();
        }
    }

    async editarDescripcion(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            nodo.tarea.descripcion = await TareaInputHandler.getDescripcionFromUsuario(nodo.tarea.descripcion);
            this.tareaProvider.refresh();
        }
    }
}

export class ColaboradorController {

    constructor(
        private gestorColaboradores: GestorColaboradores,
        private tareaProvider: TareaProvider,
        private colaboradorProvider: ColaboradorProvider
    ) { }

    async agregarColaborador() {
        const nombre = await ColaboradorInputHandler.getNombreFromUsuario();
        if (!nombre || nombre.trim() === '') { return; }
        const puesto = await ColaboradorInputHandler.getPuestoFromUsuario();
        const correo = await ColaboradorInputHandler.getCorreoFromUsuario();

        const colaborador = new Colaborador();
        colaborador.nombre = nombre;
        colaborador.puesto = puesto;
        colaborador.correo = correo;

        this.gestorColaboradores.agregar(colaborador);
        this.colaboradorProvider.refresh();
    }

    async eliminarColaborador(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            if (await ColaboradorInputHandler.getRespuestaEliminarColaboradorFromUsuario()) {
                this.gestorColaboradores.eliminar(nodo.colaborador.id);
                this.tareaProvider.refresh();
                this.colaboradorProvider.refresh();
            }
        }
    }

    async editarNombre(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            const nombre = await ColaboradorInputHandler.getNombreFromUsuario(nodo.colaborador.nombre);
            if (nombre && nombre.trim() !== '') { nodo.colaborador.nombre = nombre; }
            this.tareaProvider.refresh();
            this.colaboradorProvider.refresh();
        }
    }

    async editarPuesto(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            nodo.colaborador.puesto = await ColaboradorInputHandler.getPuestoFromUsuario(nodo.colaborador.puesto);
            this.colaboradorProvider.refresh();
        }
    }

    async editarCorreo(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            nodo.colaborador.correo = await ColaboradorInputHandler.getCorreoFromUsuario(nodo.colaborador.correo);
            this.colaboradorProvider.refresh();
        }
    }
}