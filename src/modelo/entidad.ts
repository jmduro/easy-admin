export class Colaborador {

    id: bigint = 0n;
    nombre: string = '';
    correo: string = '';
    puesto: string = '';

    public like(obj: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let encargado: Colaborador = obj as Colaborador;
        let id = new RegExp(`.*${encargado.id}}.*`);
        let nombre = new RegExp(`.*${encargado.nombre}.*`);
        let correo = new RegExp(`.*${encargado.correo}.*`);
        let puesto = new RegExp(`.*${encargado.puesto}.*`);
        return (
            id.test(this.id.toString()) &&
            nombre.test(this.nombre) &&
            correo.test(this.correo) &&
            puesto.test(this.puesto)
        );
    }

    public equals(obj?: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let encargado: Colaborador = obj as Colaborador;
        return (
            this.nombre === encargado.nombre
        );
    }

    public toString(): string {
        return this.nombre;
    }
}

export class Tarea {

    id: bigint = 0n;
    nombre: string = '';
    fechaLimite: Date = new Date();
    private _encargado?: Colaborador = undefined;
    descripcion: string = '';
    completado: boolean = false;

    get encargado(): string {
        if (this._encargado) {
            return this._encargado.nombre;
        }
        return '';
    }

    set encargado(encargado: Colaborador | undefined) {
        this._encargado = encargado;
    }

    public like(obj: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let tarea: Tarea = obj as Tarea;
        let id = new RegExp(`.*${tarea.id}.*`);
        let nombre = new RegExp(`.*${tarea.nombre}.*`);
        let fechaLimite = new RegExp(`${tarea.fechaLimite}`);
        let encargado = new RegExp(`${tarea.encargado}`);
        let descripcion = new RegExp(`${tarea.descripcion}`);
        return (
            id.test(this.id.toString()) &&
            nombre.test(this.nombre) &&
            fechaLimite.test(this.fechaLimite.toDateString()) &&
            encargado.test(this.encargado) &&
            descripcion.test(this.descripcion) &&
            this.completado === tarea.completado
        );
    }

    public equals(obj?: Object): boolean {
        if (obj === undefined) { return false; }
        if (this === obj) { return true; }
        if (typeof this !== typeof obj) { return false; }
        let tarea: Tarea = obj as Tarea;
        return (
            this.nombre === tarea.nombre &&
            this.fechaLimite === tarea.fechaLimite &&
            this.encargado === tarea.encargado &&
            this.descripcion === tarea.descripcion &&
            this.completado === tarea.completado
        );
    }
}