import * as THREE from "three";
import { Esfera } from "./esfera.js";

// Jerarquía de un Astro:
//   orbita (Group, inclinado con planoOrbita)
//    ├─ trayectoria (Line)
//    └─ cuerpo (Group, se mueve por la órbita pero NO gira)
//        ├─ esfera (Mesh, gira sobre sí misma con giro/velGiro)
//        └─ objetos añadidos con addObj (lunas, nubes, anillos...)
export class Astro extends Esfera {
    constructor(coord, carac, color, opciones = {}) {
        super(coord, carac, color, opciones);
        const {
            dist = 10,
            f1 = 1,
            f2 = 1,
            vel = 0,
            fase = 0,
            planoOrbita = [0, 0, 0], // tupla [rx, ry, rz] en radianes
        } = opciones;

        this.dist = dist;
        this.f1 = f1;
        this.f2 = f2;
        this.vel = vel;
        this.fase = fase;
        this.planoOrbita = planoOrbita;

        this.orbita = new THREE.Group();
        this.orbita.rotation.set(...planoOrbita);
        this.cuerpo = new THREE.Group();
        this.orbita.add(this.cuerpo);

        this.trayectoria = null;
        this.satelites = [];
    }

    createEsfera() {
        super.createEsfera();
        // La posición pasa al cuerpo; la esfera queda centrada en él
        this.cuerpo.position.copy(this.esfera.position);
        this.esfera.position.set(0, 0, 0);
        this.cuerpo.add(this.esfera);
        return this;
    }

    createTrayectoria() {
        const curve = new THREE.EllipseCurve(0, 0, this.dist * this.f1, this.dist * this.f2);
        const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
        this.trayectoria = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: this.color }));
        this.trayectoria.rotation.x = Math.PI / 2;
        this.orbita.add(this.trayectoria);
        return this;
    }

    animationLoop(velocidadSistema, timestamp) {
        super.animationLoop(velocidadSistema, timestamp);
        const t = timestamp * velocidadSistema * this.vel + this.fase;
        this.cuerpo.position.set(
            Math.cos(t) * this.f1 * this.dist,
            0,
            Math.sin(t) * this.f2 * this.dist
        );
        for (const s of this.satelites) s.animationLoop(velocidadSistema, timestamp);
    }

    addScene(scene) {
        if (!this.esfera) throw new Error("Primero llama a createEsfera");
        scene.add(this.orbita);
        return this;
    }

    // Acepta un Astro (luna), una Esfera (capa) o cualquier Object3D (anillo, luz...)
    addObj(obj) {
        if (!this.esfera) throw new Error("Primero llama a createEsfera");
        if (obj instanceof Astro) {
            this.cuerpo.add(obj.orbita);
            this.satelites.push(obj);
        } else if (obj instanceof Esfera) {
            this.cuerpo.add(obj.esfera);
            this.satelites.push(obj);
        } else {
            this.cuerpo.add(obj);
        }
        return this;
    }

    mostrarTrayectoria(visible) {
        if (this.trayectoria) this.trayectoria.visible = visible;
        for (const s of this.satelites) {
            if (s instanceof Astro) s.mostrarTrayectoria(visible);
        }
        return this;
    }
}