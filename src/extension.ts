import * as vscode from 'vscode';
import { TareaProvider } from './treeview/tarea';

import { getWebviewContentTareas } from './webview/tareas';
import { getWebviewContentColaboradores } from './webview/colaboradores';
import { getWebviewContentCalendario } from './webview/calendario';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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
			const panel = vscode.window.createWebviewPanel(
				'easy-admin',
				'Easy Admin',
				vscode.ViewColumn.One,
				{}
			);

			panel.webview.html = getWebviewContentTareas();
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

			panel.webview.html = getWebviewContentColaboradores();
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

			panel.webview.html = getWebviewContentCalendario();
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
