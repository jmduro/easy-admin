import * as vscode from 'vscode';
import { TareaProvider } from './treeview/tarea';

import { Tarea } from './webview/tareas';


export function activate(context: vscode.ExtensionContext) {
	const tareaProvider = new TareaProvider();
	vscode.window.createTreeView('tareas', { treeDataProvider: tareaProvider });

	// vscode.commands.registerCommand('easy-admin.agregarTarea', () => {
	// 	vscode.window.showInputBox({ prompt: 'Agregar una nueva tarea' }).then(nombre => {
	// 		if (nombre) {
	// 			tareaService.agregarTarea(nombre);
	// 			tareaProvider.refresh();
	// 		}
	// 	});
	// });

	// vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo: vscode.TreeItem) => {
	// 	const label = nodo.label as string;
	// 	const index = tareaService.getTareas().findIndex(tarea => tarea.nombre === label);

	// 	if (index !== -1) {
	// 		tareaService.eliminarTarea(index);
	// 		tareaProvider.refresh();
	// 	}
	// });

	// vscode.commands.registerCommand('easy-admin.alternarEstado', (nodo: vscode.TreeItem) => {
	// 	const label = nodo.label as string;
	// 	const index = tareaService.getTareas().findIndex(tarea => tarea.nombre === label);

	// 	if (index !== -1) {
	// 		tareaService.alternarEstado(index);
	// 		tareaProvider.refresh();
	// 	}
	// });
	//context.subscriptions.push(disposable);
	
	//Tareas
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.tareas', () => {
			Tarea.createOrShow(context.extensionUri);
			/*const panel = vscode.window.createWebviewPanel(
				'easy-admin',
				'Easy Admin',
				vscode.ViewColumn.One,
				{}
			);

			panel.webview.html = getWebviewContentTareas(); */
		})
	);

	//Colaboradores
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.colaboradores', () => {
			const panel = vscode.window.createWebviewPanel(
				'easy-admin',
				'Easy Admin',
				vscode.ViewColumn.One,
				{}
			);

			//panel.webview.html = getWebviewContentColaboradores();
			//Colaboradores.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.calendario', () => {
			const panel = vscode.window.createWebviewPanel(
				'easy-admin',
				'Easy Admin',
				vscode.ViewColumn.One,
				{}
			);

			//panel.webview.html = getWebviewContentCalendario();
			//Calendario.createOrShow(context.extensionUri);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
