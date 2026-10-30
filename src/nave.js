import * as THREE from "three";

export class Nave {
    constructor(opciones = {}) {
        const {
            pos = [0, 0, 0],
            mirarA = [0, 0, 0],
            escala = 1,
            color = 0x2266ff,
            colorAleta = 0x88bbff,
        } = opciones;

        this.pos = pos;
        this.mirarA = mirarA;
        this.escala = escala;
        this.color = color;
        this.colorAleta = colorAleta;

        this.grupo = null;
        this.controles = null;
    }

    createNave() {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.Float32BufferAttribute([
            0, 0, -1.2,
            -0.8, 0, 0.8,
            0.8, 0, 0.8,
        ], 3));

        const mat = new THREE.MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide });

        const aletaGeom = new THREE.BufferGeometry();
        aletaGeom.setAttribute("position", new THREE.Float32BufferAttribute([
            0, 0, -1.2,
            0, 0, 0.8,
            0, 0.8, 0.8,
        ], 3));
        const aletaMat = new THREE.MeshBasicMaterial({ color: this.colorAleta, side: THREE.DoubleSide });

        const g = new THREE.Group();
        g.add(new THREE.Mesh(geom, mat));
        g.add(new THREE.Mesh(aletaGeom, aletaMat));

        g.scale.setScalar(this.escala);
        g.position.set(...this.pos);
        g.lookAt(new THREE.Vector3(...this.mirarA));
        g.rotateY(Math.PI);

        this.grupo = g;
        return this;
    }

    addScene(scene) {
        if (!this.grupo) throw new Error("Primero llama a createNave");
        scene.add(this.grupo);
        return this;
    }

    animationLoop() {}
}