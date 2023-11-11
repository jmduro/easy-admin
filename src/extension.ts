import * as vscode from 'vscode';
import { TareaProvider } from './treeview/tarea';

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
}

// This method is called when your extension is deactivated
export function deactivate() { }
