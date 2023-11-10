import * as vscode from 'vscode';
import { TareaTreeProviderView } from './treeview/tareaProvider';
import { TareaService } from "./treeview/tareaService";
import { Tarea } from './treeview/tarea';

export function activate(context: vscode.ExtensionContext) {
	const tareaService = new TareaService();
	const treeDataProvider = new TareaTreeProviderView(tareaService);

	vscode.window.createTreeView('tareas', { treeDataProvider });

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => {
		vscode.window.showInputBox({ prompt: 'Agregar una nueva tarea' }).then(nombre => {
			if (nombre) {
				tareaService.agregarTarea(nombre);
				treeDataProvider.refresh();
			}
		});
	});

	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo: vscode.TreeItem) => {
		const label = nodo.label as string;
		const index = tareaService.getTareas().findIndex(tarea => tarea.nombre === label);

		if (index !== -1) {
			tareaService.eliminarTarea(index);
			treeDataProvider.refresh();
		}
	});

	vscode.commands.registerCommand('easy-admin.alternarEstado', (nodo: vscode.TreeItem) => {
		const label = nodo.label as string;
		const index = tareaService.getTareas().findIndex(tarea => tarea.nombre === label);

		if (index !== -1) {
			tareaService.alternarEstado(index);
			treeDataProvider.refresh();
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
