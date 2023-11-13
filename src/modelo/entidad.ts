export class Colaborador {
    private _nombre: string;
    private _correo: string;
    private _puesto: string;

    constructor() {
        this._nombre = '';
        this._correo = '';
        this._puesto = '';
    }

    get nombre(): string {
        return this._nombre;
    }

    set nombre(nombre: string) {
        if (this.isZeroLength(nombre)) {
            return;
        }
        this._nombre = nombre;
    }

    get correo(): string {
        return this._correo;
    }

    set correo(correo: string) {
        if (this.isZeroLength(correo)) {
            return;
        }
        this._correo = correo;
    }

    get puesto(): string {
        return this._puesto;
    }

    set puesto(puesto: string) {
        if (this.isZeroLength(puesto)) {
            return;
        }
        this._puesto = puesto;
    }

    public like(obj: Object): boolean {
        if (this === obj) { return true; }
        if (obj === null) { return false; }
        if (typeof this !== typeof obj) { return false; }
        let encargado: Colaborador = obj as Colaborador;
        let nombre: RegExp = new RegExp(`.*${encargado.nombre}.*`);
        let correo: RegExp = new RegExp(`.*${encargado.correo}.*`);
        let puesto: RegExp = new RegExp(`.*${encargado.puesto}.*`);
        return(
            nombre.test(this.nombre) &&
            correo.test(this.correo) &&
            puesto.test(this.puesto)
        );
    }

    public equals(obj: Object): boolean {
        if (this === obj) { return true; }
        if (obj === null) { return false; }
        if (typeof this !== typeof obj) { return false; }
        let encargado: Colaborador = obj as Colaborador;
        return (
            this.nombre === encargado.nombre &&
            this.correo === encargado.correo &&
            this.puesto === encargado.puesto
        );
    }

    private isZeroLength(s: string): boolean {
        return s.length < 1;
    }
}

export class Tarea {
    private _nombre: string;
    private _fechaLimite: Date;
    private _encargado?: Colaborador;
    public descripcion: string;
    private _completado: boolean;

    constructor() {
        this._nombre = '';
        this._fechaLimite = new Date();
        this._encargado = undefined;
        this.descripcion = '';
        this._completado = false;
    }

    get nombre(): string {
        return this._nombre;
    }

    set nombre(nombre: string) {
        if (this.isZeroLength(nombre)) {
            return;
        }
        this._nombre = nombre;
    }

    get fechaLimite(): string {
        return this._fechaLimite.toDateString();
    }

    set fechaLimite(fechaLimite: string) {
        // Comprobación de fecha
        return;
    }

    get encargado(): string {
        if (this._encargado) {
            return this._encargado.nombre;
        }
        return '';
    }

    set encargado(encargado: Colaborador) {
        if (encargado) {
            this._encargado = encargado;
        }
        return;
    }

    get completado(): string {
        if (this._completado) {
            return 'Sí';
        }
        return 'No';
    }

    set completado(completado: boolean) {
        this._completado = completado;
    }

    public like(obj: Object): boolean {
        if (this === obj) { return true; }
        if (obj === null) { return false; }
        if (typeof this !== typeof obj) { return false; }
        let tarea: Tarea = obj as Tarea;
        let nombre: RegExp = new RegExp(`.*${tarea.nombre}.*`);
        let fechaLimite: RegExp = new RegExp(`${tarea.fechaLimite}`);
        let encargado: RegExp = new RegExp(`${tarea.encargado}`);
        let descripcion: RegExp = new RegExp(`${tarea.descripcion}`);
        return(
            nombre.test(this.nombre) &&
            fechaLimite.test(this.fechaLimite) &&
            encargado.test(this.encargado) &&
            descripcion.test(this.descripcion) &&
            this.completado === tarea.completado
        );
    }

    public equals(obj: Object): boolean {
        if (this === obj) { return true; }
        if (obj === null) { return false; }
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

    private isZeroLength(s: string): boolean {
        return s.length < 1;
    }

}