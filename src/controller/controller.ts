import * as vscode from 'vscode';
import { Colaborador, Tarea } from '../modelo/entidad';
import { GestorColaboradores, GestorTareas } from '../modelo/gestor';
import { ColaboradorTreeViewAdapter, TareaTreeViewAdapter } from '../modelo/adapter';
import { ColaboradorProvider, TareaProvider } from '../view/treeview';

export class Controller {

    private gestorTareas;
    private gestorColaboradores;

    private tareaProvider;
    private colaboradorProvider;

    constructor() {
        this.gestorTareas = new GestorTareas();
        this.gestorColaboradores = new GestorColaboradores();
        this.tareaProvider = new TareaProvider(this.gestorTareas);
        this.colaboradorProvider = new ColaboradorProvider(this.gestorColaboradores);

        this.loadValues();  // ! Borrar en producción
        vscode.window.createTreeView('tareas', { treeDataProvider: this.tareaProvider });
        vscode.window.createTreeView('colaboradores', { treeDataProvider: this.colaboradorProvider });
    }

    private loadValues() {
        let colaborador: Colaborador;

        colaborador = new Colaborador();
        colaborador.nombre = 'Alejo';
        this.gestorColaboradores.agregar(colaborador);

        let tarea: Tarea;

        tarea = new Tarea();
        tarea.nombre = 'Tarea 1';
        tarea.encargado = colaborador;
        tarea.descripcion = 'Ejemplo';
        tarea.completado = true;
        this.gestorTareas.agregar(tarea);

        tarea = new Tarea();
        tarea.nombre = 'Tarea 2';
        tarea.encargado = colaborador;
        tarea.descripcion = 'Otro ejemplo';
        this.gestorTareas.agregar(tarea);
    }

    async agregarTarea() {
        const nombre = await vscode.window.showInputBox({ prompt: 'Nombre de la tarea' });
        if (!nombre || nombre === '') { return; }

        const opcionesColaborador: Map<string, Colaborador> = new Map([['', new Colaborador()]]);
        this.gestorColaboradores.consultarTodos().forEach(colaborador => opcionesColaborador.set(colaborador.nombre, colaborador));
        const nombreColaborador = await vscode.window.showQuickPick(Array.from(opcionesColaborador.keys()), { placeHolder: 'Elige un colaborador (Deja en blanco para no seleccionar ninguno.)' });

        const tarea = new Tarea();
        tarea.nombre = nombre;
        if (nombreColaborador && nombreColaborador !== '') {
            let colaborador = opcionesColaborador.get(nombreColaborador);
            if (colaborador) { tarea.encargado = colaborador; }
        }

        this.gestorTareas.agregar(tarea);
        this.tareaProvider.refresh();
    }

    async eliminarTarea(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            const eliminar = await vscode.window.showQuickPick(['Sí', 'No'], { placeHolder: '¿Está seguro de querer eliminar esta tarea?' });
            if (eliminar && eliminar === 'Sí') {
                this.gestorTareas.eliminar(nodo.tarea.id);
                this.tareaProvider.refresh();
            }
        }
    }

    cambiarEstado(nodo?: TareaTreeViewAdapter) {
        if (nodo && nodo.tarea) {
            let nuevoEstado: boolean;
            if (nodo.tarea.completado === 'Sí') {
                nuevoEstado = false;
            } else {
                nuevoEstado = true;
            }
            nodo.tarea.completado = nuevoEstado;
            this.tareaProvider.refresh();
        }
    }

    agregarColaborador() {
        vscode.window.showInputBox({ prompt: 'Agregar un nuevo colaborador' }).then(nombre => {
            if (nombre) {
                let colaborador = new Colaborador();
                colaborador.nombre = nombre;
                this.gestorColaboradores.agregar(colaborador);
                this.colaboradorProvider.refresh();
            }
        });
    }

    async eliminarColaborador(nodo?: ColaboradorTreeViewAdapter) {
        if (nodo && nodo.colaborador) {
            const eliminar = await vscode.window.showQuickPick(['Sí', 'No'], { placeHolder: '¿Está seguro de querer eliminar este colaborador?' });
            if (eliminar && eliminar === 'Sí') {
                this.gestorColaboradores.eliminar(nodo.colaborador.id);
                this.colaboradorProvider.refresh();
            }
        }
    }
}