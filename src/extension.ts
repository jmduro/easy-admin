import * as vscode from 'vscode';
import { GestorColaboradores, GestorTareas } from './modelo/gestor';
import { ColaboradorTreeViewController, TareaTreeViewController } from './controller/controller';

export function activate(context: vscode.ExtensionContext) {

	const gestorTareas = new GestorTareas(context);
	const gestorColaboradores = new GestorColaboradores(context);

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
}

// This method is called when your extension is deactivated
export function deactivate() { }