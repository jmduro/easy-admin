import * as vscode from 'vscode';
import { Controller } from './controller/controller';
import { TareaVista } from './webview/tareas';
import { ColaboradorPanel } from './webview/colaboradores';
import { CalendarioPanel } from './webview/calendario';

export function activate(context: vscode.ExtensionContext) {

	const controller = new Controller();

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => controller.tareaController.agregarTarea());
	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo) => controller.tareaController.eliminarTarea(nodo));
	vscode.commands.registerCommand('easy-admin.cambiarEstado', (nodo) => controller.tareaController.cambiarEstado(nodo));
	vscode.commands.registerCommand('easy-admin.editarNombreTarea', (nodo) => controller.tareaController.editarNombre(nodo));
	vscode.commands.registerCommand('easy-admin.editarFechaLimiteTarea', (nodo) => controller.tareaController.editarFechaLimite(nodo));
	vscode.commands.registerCommand('easy-admin.editarEncargadoTarea', (nodo) => controller.tareaController.editarEncargado(nodo));
	vscode.commands.registerCommand('easy-admin.editarDescripcionTarea', (nodo) => controller.tareaController.editarDescripcion(nodo));

	vscode.commands.registerCommand('easy-admin.agregarColaborador', () => controller.colaboradorController.agregarColaborador());
	vscode.commands.registerCommand('easy-admin.eliminarColaborador', (nodo) => controller.colaboradorController.eliminarColaborador(nodo));
	vscode.commands.registerCommand('easy-admin.editarNombreColaborador', (nodo) => controller.colaboradorController.editarNombre(nodo));
	vscode.commands.registerCommand('easy-admin.editarPuestoColaborador', (nodo) => controller.colaboradorController.editarPuesto(nodo));
	vscode.commands.registerCommand('easy-admin.editarCorreoColaborador', (nodo) => controller.colaboradorController.editarCorreo(nodo));


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