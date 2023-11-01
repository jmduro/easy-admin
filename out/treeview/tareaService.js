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
exports.TareaService = void 0;
const vscode = __importStar(require("vscode"));
const tarea_1 = require("./tarea");
class TareaService {
    tareas = [];
    getTareas() {
        return this.tareas;
    }
    agregarTarea(nombre) {
        this.tareas.push(new tarea_1.Tarea(nombre, false, vscode.TreeItemCollapsibleState.None));
    }
    eliminarTarea(index) {
        if (index >= 0 && index < this.tareas.length) {
            this.tareas.splice(index, 1);
        }
    }
    alternarEstado(index) {
        if (index >= 0 && index < this.tareas.length) {
            this.tareas[index].completado = !this.tareas[index].completado;
        }
    }
}
exports.TareaService = TareaService;
//# sourceMappingURL=tareaService.js.map