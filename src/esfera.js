import * as THREE from "three";

export class Esfera {
    constructor(coord, carac, color, opciones = {}) {
        const {
            giro = [0, 0, 0],
            velGiro = 0,
            receiveShadow = true,
            castShadow = true,
            textura = null,
            emisiva = false,
            opacidad = 1,
            transparente = false,
        } = opciones;

        this.esfera = null;
        this.coord = coord;
        this.carac = carac;
        this.color = color;
        this.giro = giro;
        this.velGiro = velGiro;
        this.receiveShadow = receiveShadow;
        this.castShadow = castShadow;
        this.textura = textura;
        this.emisiva = emisiva;
        this.opacidad = opacidad;
        this.transparente = transparente;
    }

    createEsfera() {
        const geometry = new THREE.SphereGeometry(
            this.carac[0], this.carac[1], this.carac[2]
        );

        const material = new THREE.MeshPhongMaterial({
            color: this.color,
            emissive: this.emisiva ? this.color : 0x000000,
            transparent: this.opacidad < 1 || this.transparente,
            opacity: this.opacidad,
        });

        if (this.textura) {
            new THREE.TextureLoader().load(
                this.textura,
                (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    material.map = tex;
                    material.color.set(0xffffff);
                    if (this.emisiva) {
                        material.emissive.set(0xffffff);
                        material.emissiveMap = tex;
                    }
                    material.needsUpdate = true;
                },
            );
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.coord[0], this.coord[1], this.coord[2]);
        mesh.receiveShadow = this.receiveShadow;
        mesh.castShadow = this.castShadow;
        this.esfera = mesh;
        return this;
    }

    addScene(scene) {
        if (!this.esfera) throw new Error("Primero llama a createEsfera");
        scene.add(this.esfera);
        return this;
    }

    addObj(obj) {
        if (!this.esfera) throw new Error("Primero llama a createEsfera");
        this.esfera.add(obj);
        return this;
    }

    animationLoop(velocidadSistema = 1, timestamp = 0) {
        if (!this.esfera || this.velGiro === 0) return;
        const ang = timestamp * velocidadSistema * this.velGiro;
        this.esfera.rotation.x = this.giro[0] * ang;
        this.esfera.rotation.y = this.giro[1] * ang;
        this.esfera.rotation.z = this.giro[2] * ang;
    }
}