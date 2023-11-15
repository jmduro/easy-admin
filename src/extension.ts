import * as vscode from 'vscode';
import { Controller } from './controller/controller';

export function activate(context: vscode.ExtensionContext) {

	const controller = new Controller();

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => controller.agregarTarea());
	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo) => controller.eliminarTarea(nodo));
	vscode.commands.registerCommand('easy-admin.cambiarEstado', (nodo) => controller.cambiarEstado(nodo));
	vscode.commands.registerCommand('easy-admin.agregarColaborador', () => controller.agregarColaborador());
	vscode.commands.registerCommand('easy-admin.eliminarColaborador', (nodo) => controller.eliminarColaborador(nodo));

	// Tareas
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