import * as vscode from 'vscode';
import { Controller } from './controller/controller';
import { TareaVista } from './webview/tareas';
import { ColaboradorPanel } from './webview/colaboradores';
import { CalendarioPanel } from './webview/calendario';

export function activate(context: vscode.ExtensionContext) {

	const controller = new Controller();

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => controller.agregarTarea());
	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo) => controller.eliminarTarea(nodo));
	vscode.commands.registerCommand('easy-admin.cambiarEstado', (nodo) => controller.cambiarEstado(nodo));
	vscode.commands.registerCommand('easy-admin.agregarColaborador', () => controller.agregarColaborador());
	vscode.commands.registerCommand('easy-admin.eliminarColaborador', (nodo) => controller.eliminarColaborador(nodo));

	// Tareas
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.tareas', () => {
			TareaVista.createOrShow(context.extensionUri);
		})
	);

	//Colaboradores
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.colaboradores', () => {
			ColaboradorPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.calendario', () => {
			CalendarioPanel.createOrShow(context.extensionUri);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }