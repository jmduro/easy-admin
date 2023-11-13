import * as vscode from 'vscode';
import { TareaProvider } from './view/treeview';

import { Tarea, Colaborador } from './modelo/entidad';
import { GestorColaboradores, GestorTareas } from './modelo/gestor';
import { TareaTreeViewAdapter } from './modelo/adapter';

export function activate(context: vscode.ExtensionContext) {

	const gestorTareas: GestorTareas = new GestorTareas();
	const gestorColaboradores: GestorColaboradores = new GestorColaboradores();

	// TODO: Valores por defecto. Borrar al poner en producción
	// Colaboradores
	let colaborador: Colaborador;

	colaborador = new Colaborador();
	colaborador.nombre = 'Alejo';
	gestorColaboradores.agregar(colaborador);


	// Tareas
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

	const tareaProvider = new TareaProvider(gestorTareas);
	vscode.window.createTreeView('tareas', { treeDataProvider: tareaProvider });

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => {
		vscode.window.showInputBox({ prompt: 'Agregar una nueva tarea' }).then(nombre => {
			if (nombre) {
				let tarea = new Tarea();
				tarea.nombre = nombre;
				gestorTareas.agregar(tarea);
				tareaProvider.refresh();
			}
		});
	});

	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo: TareaTreeViewAdapter) => {
		if (nodo.tarea) {
			gestorTareas.eliminar(nodo.tarea);
			tareaProvider.refresh();
		}
	});

	vscode.commands.registerCommand('easy-admin.alternarEstado', (nodo: TareaTreeViewAdapter) => {
		if (nodo.tarea) {
			let nuevoEstado: boolean;
			if (nodo.tarea.completado === 'Sí') {
				nuevoEstado = false;
			} else {
				nuevoEstado = true;
			}
			nodo.tarea.completado = nuevoEstado;
		}
	});

	//Tareas
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('easy-admin.tareas', () => {
	// 		Tarea.createOrShow(context.extensionUri);
	// 		/*const panel = vscode.window.createWebviewPanel(
	// 			'easy-admin',
	// 			'Easy Admin',
	// 			vscode.ViewColumn.One,
	// 			{}
	// 		);

	// 		panel.webview.html = getWebviewContentTareas(); */
	// 	})
	// );

	// //Colaboradores
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('easy-admin.colaboradores', () => {
	// 		const panel = vscode.window.createWebviewPanel(
	// 			'easy-admin',
	// 			'Easy Admin',
	// 			vscode.ViewColumn.One,
	// 			{}
	// 		);

	// 		//panel.webview.html = getWebviewContentColaboradores();
	// 		//Colaboradores.createOrShow(context.extensionUri);
	// 	})
	// );

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('easy-admin.calendario', () => {
	// 		const panel = vscode.window.createWebviewPanel(
	// 			'easy-admin',
	// 			'Easy Admin',
	// 			vscode.ViewColumn.One,
	// 			{}
	// 		);

	// 		//panel.webview.html = getWebviewContentCalendario();
	// 		//Calendario.createOrShow(context.extensionUri);
	// 	})
	// );
}

// This method is called when your extension is deactivated
export function deactivate() { }