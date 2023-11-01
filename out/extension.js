"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const tareaProvider_1 = require("./treeview/tareaProvider");
const tareaService_1 = require("./treeview/tareaService");
function activate(context) {
    const tareaService = new tareaService_1.TareaService();
    const treeDataProvider = new tareaProvider_1.TareaTreeProviderView(tareaService);
    vscode.window.createTreeView('tareas', { treeDataProvider });
    let agregarTarea = vscode.commands.registerCommand('easy-admin.agregarTarea', () => {
        vscode.window.showInputBox({ prompt: 'Agregar una nueva tarea' }).then(nombre => {
            if (nombre) {
                tareaService.agregarTarea(nombre);
                treeDataProvider.refresh();
            }
        });
    });
    vscode.commands.registerCommand('easy-admin.eliminarTarea', (nodo) => {
        const label = nodo.label;
        const index = tareaService.getTareas().findIndex(tarea => tarea.label === label);
        if (index !== -1) {
            tareaService.eliminarTarea(index);
            treeDataProvider.refresh();
        }
    });
    vscode.commands.registerCommand('easy-admin.alternarEstado', (nodo) => {
        const label = nodo.label;
        const index = tareaService.getTareas().findIndex(tarea => tarea.label === label);
        if (index !== -1) {
            tareaService.alternarEstado(index);
            treeDataProvider.refresh();
        }
    });
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map