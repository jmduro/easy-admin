export class Encargado {
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

    private isZeroLength(s: string): boolean {
        return s.length < 1;
    }
}

export class Tarea {
    private _nombre: string;
    private _fechaLimite: Date;
    private _encargado?: Encargado;
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
    }

    get encargado(): string | undefined {
        return this._encargado?.nombre;
    }

    set encargado(encargado: Encargado) {
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

    private isZeroLength(s: string): boolean {
        return s.length < 1;
    }

}