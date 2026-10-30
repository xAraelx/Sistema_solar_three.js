import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

export class Camara {
    constructor(opciones = {}) {
        const {
            fov = 60,
            aspect = innerWidth / innerHeight,
            near = 0.1,
            far = 1000,
            pos = [0, 0, 10],
        } = opciones;

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.pos = pos;
        this.camara = null;
        this.controles = null;
        this.objetivo = null;
        this._prev = new THREE.Vector3();
        this._reloj = new THREE.Clock();

        // Tercera persona
        this.nave = null;
        this._offset = new THREE.Vector3();
        this._inclinacion = new THREE.Quaternion();
        this._qSuave = new THREE.Quaternion();
        this._suavizado = 6;
        this._tmp = new THREE.Vector3();
    }

    createPerspectiva() {
        this.camara = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.camara.position.set(...this.pos);
        return this;
    }

    addScene(scene) {
        if (!this.camara) throw new Error("Primero llama a createPerspectiva");
        scene.add(this.camara);
        return this;
    }

    orbitControls(dom, opciones = {}) {
        return this._setControles(new OrbitControls(this.camara, dom), opciones);
    }

    trackballControls(dom, opciones = {}) {
        return this._setControles(new TrackballControls(this.camara, dom), opciones);
    }

    flyControls(dom, opciones = {}) {
        return this._setControles(new FlyControls(this.camara, dom), opciones);
    }


    terceraPersona(nave, dom, controles = {}, seguimiento = {}) {
        if (!nave || !nave.grupo) throw new Error("terceraPersona() necesita una Nave creada");
        this._setControles(new FlyControls(nave.grupo, dom), controles);
        this.nave = nave;
        nave.controles = this.controles;

        this._offset.fromArray(seguimiento.offset || [0, 1.2, 5]);
        if (seguimiento.suavizado !== undefined) this._suavizado = seguimiento.suavizado;
        const inclinacion = seguimiento.inclinacion !== undefined ? seguimiento.inclinacion : -0.12;
        this._inclinacion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), inclinacion);

        this._qSuave.copy(nave.grupo.quaternion);
        this._colocarTrasNave(1);
        return this;
    }

    _colocarTrasNave(alfa) {
        const g = this.nave.grupo;
        this._qSuave.slerp(g.quaternion, alfa);
        this._tmp.copy(this._offset).multiplyScalar(g.scale.x).applyQuaternion(this._qSuave);
        this.camara.position.copy(g.position).add(this._tmp);
        this.camara.quaternion.copy(this._qSuave).multiply(this._inclinacion);
    }

    _setControles(c, opciones) {
        if (!this.camara) {
            throw new Error("Primero llama a createPerspectiva");
        }
        if (this.controles) {
            this.controles.dispose();
        }

        Object.assign(c, opciones);
        c.enabled = false;
        this.controles = c;
        if (this.objetivo && c.target) {
            this.objetivo.getWorldPosition(c.target);
        }
        return this;
    }

    dejarDeSeguir() {
        this.objetivo = null;
        return this;
    }

    activar() {
        if (this.controles) this.controles.enabled = true;
        this._reloj.getDelta();
        return this;
    }

    desactivar() {
        if (this.controles) this.controles.enabled = false;
        return this;
    }

    seguir(obj) {
        if (!this.camara) {
            throw new Error("Primero llama a createPerspectiva");
        }

        if (!obj || typeof obj.getWorldPosition !== "function") {
            throw new Error("seguir() necesita un objeto válido de Three.js");
        }

        this.objetivo = obj;
        obj.getWorldPosition(this._prev);

        this.camara.position.add(this._prev);

        if (this.controles && this.controles.target) {
            this.controles.target.copy(this._prev);
        }

        return this;
    }

    quitarControles() {
        if (this.controles) {
            this.controles.dispose();
        }

        this.controles = null;
        return this;
    }

    resize(aspect) {
        if (!this.camara) return this;

        this.camara.aspect = aspect;
        this.camara.updateProjectionMatrix();

        if (
            this.controles &&
            typeof this.controles.handleResize === "function"
        ) {
            this.controles.handleResize();
        }

        return this;
    }

    animationLoop() {
        if (!this.camara) return;

        const deltaTiempo = this._reloj.getDelta();

        if (this.objetivo) {
            const nueva = new THREE.Vector3();
            this.objetivo.getWorldPosition(nueva);

            const delta = nueva.clone().sub(this._prev);
            this.camara.position.add(delta);

            if (this.controles && this.controles.target) {
                this.controles.target.add(delta);
            }

            this._prev.copy(nueva);
        }

        if (this.controles) {
            this.controles.update(deltaTiempo);
        }

        if (this.nave) {
            this.nave.animationLoop(deltaTiempo);
            this._colocarTrasNave(1 - Math.exp(-this._suavizado * deltaTiempo));
        }
    }
}