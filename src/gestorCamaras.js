export class GestorCamaras {
    constructor() {
        this.camaras = new Map();
        this.activa = null;
        this._oyentes = [];
        this._gui = null;
    }

    add(nombre, cam) {
        this.camaras.set(nombre, cam);
        if (!this.activa) { this.activa = nombre; cam.activar(); }
        else cam.desactivar();
        return this;
    }

    activar(nombre) {
        if (!this.camaras.has(nombre)) throw new Error("No existe la cámara " + nombre);
        if (nombre === this.activa) return this;
        this.camaras.get(this.activa).desactivar();
        this.activa = nombre;
        this.camaras.get(nombre).activar();

        if (this._gui) {
            this._gui.estado.camara = nombre;
            this._gui.control.updateDisplay();
        }
        for (const fn of this._oyentes) fn(nombre);
        return this;
    }

    siguiente() {
        const nombres = [...this.camaras.keys()];
        return this.activar(nombres[(nombres.indexOf(this.activa) + 1) % nombres.length]);
    }

    get actual() {
        return this.camaras.get(this.activa).camara;
    }

    alCambiar(fn) {
        this._oyentes.push(fn);
        return this;
    }

    teclas(mapa) {
        addEventListener("keydown", (e) => {
            if (e.target && e.target.closest && e.target.closest("input, textarea, select")) return;
            const nombre = mapa[e.key.toLowerCase()];
            if (nombre) this.activar(nombre);
        });
        return this;
    }

    gui(gui) {
        const estado = { camara: this.activa };
        const control = gui.add(estado, "camara", [...this.camaras.keys()])
            .name("Cámara")
            .onChange((nombre) => this.activar(nombre));
        this._gui = { estado, control };
        return this;
    }

    resize(aspect) {
        for (const c of this.camaras.values()) c.resize(aspect);
        return this;
    }

    animationLoop() {
        this.camaras.get(this.activa).animationLoop();
    }
}