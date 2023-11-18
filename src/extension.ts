import * as vscode from 'vscode';
import { GestorColaboradores, GestorTareas } from './modelo/gestor';
import { ColaboradorTreeViewController, TareaTreeViewController } from './controller/controller';
import { TareaPanel } from './webview/tareas';
import { ColaboradorPanel } from './webview/colaboradores';
import { CalendarioPanel } from './webview/calendario';

export function activate(context: vscode.ExtensionContext) {

	context.globalState.setKeysForSync(['tareas,', 'colaboradores']);

	const gestorTareas = GestorTareas.getInstance(context);
	const gestorColaboradores = GestorColaboradores.getInstance(context);

	const tareaController = new TareaTreeViewController(gestorTareas, gestorColaboradores);
	const colaboradorController = new ColaboradorTreeViewController(gestorColaboradores);

	vscode.commands.registerCommand('easy-admin.agregarTarea', () => tareaController.agregarTarea());
	vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo) => tareaController.eliminarTarea(nodo));
	vscode.commands.registerCommand('easy-admin.cambiarEstado', (nodo) => tareaController.cambiarEstado(nodo));
	vscode.commands.registerCommand('easy-admin.editarNombreTarea', (nodo) => tareaController.editarNombre(nodo));
	vscode.commands.registerCommand('easy-admin.editarFechaLimiteTarea', (nodo) => tareaController.editarFechaLimite(nodo));
	vscode.commands.registerCommand('easy-admin.editarEncargadoTarea', (nodo) => tareaController.editarEncargado(nodo));
	vscode.commands.registerCommand('easy-admin.editarDescripcionTarea', (nodo) => tareaController.editarDescripcion(nodo));

	vscode.commands.registerCommand('easy-admin.agregarColaborador', () => colaboradorController.agregarColaborador());
	vscode.commands.registerCommand('easy-admin.eliminarColaborador', (nodo) => colaboradorController.eliminarColaborador(nodo));
	vscode.commands.registerCommand('easy-admin.editarNombreColaborador', (nodo) => colaboradorController.editarNombre(nodo));
	vscode.commands.registerCommand('easy-admin.editarPuestoColaborador', (nodo) => colaboradorController.editarPuesto(nodo));
	vscode.commands.registerCommand('easy-admin.editarCorreoColaborador', (nodo) => colaboradorController.editarCorreo(nodo));

	vscode.commands.registerCommand('easy-admin.verTareas', () => { TareaPanel.createOrShow(context.extensionUri); });
	vscode.commands.registerCommand('easy-admin.verColaboradores', () => { ColaboradorPanel.createOrShow(context.extensionUri); });
	vscode.commands.registerCommand('easy-admin.verCalendario', () => { CalendarioPanel.createOrShow(context.extensionUri); });
}

// This method is called when your extension is deactivated
export function deactivate() { }