export interface Entidad {
    id: number;
    equals(obj?: Object): boolean;
}

export class Colaborador implements Entidad {

    id: number = 0;
    nombre: string = '';
    correo: string = '';
    puesto: string = '';

    equals(obj?: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let encargado: Colaborador = obj as Colaborador;
        return this.nombre === encargado.nombre;
    }

    toString(): string {
        return this.nombre;
    }
}

export class Tarea implements Entidad {

    id: number = 0;
    nombre: string = '';
    fechaLimite: Date = new Date();
    encargado?: Colaborador = undefined;
    descripcion: string = '';
    completado: boolean = false;

    equals(obj?: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let tarea: Tarea = obj as Tarea;
        return this.nombre === tarea.nombre;
    }
}