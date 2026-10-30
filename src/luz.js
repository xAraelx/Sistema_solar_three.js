import * as THREE from "three";

export class Luz {
    constructor(opciones = {}) {
        this.luz = null;

        const {
            color = 0xffffff,
            intensidad = 0.5,
        } = opciones;

        this.color = color;
        this.intensidad = intensidad;
        this.distance = opciones.distance;
        this.angle = opciones.angle;
        this.penumbra = opciones.penumbra;
        this.decay = opciones.decay;
        this.helper = null;
        this.helperType = null;
    }

    createLAmb() {
        this.luz = new THREE.AmbientLight(this.color, this.intensidad);
        return this
    }

    createLDir() {
        this.luz = new THREE.DirectionalLight(this.color, this.intensidad);
        this.helperType = 3
        return this
    }

    createLSpot() {
        this.luz = new THREE.SpotLight(
            this.color,this.intensidad,
            this.distance,this.angle,
            this.penumbra,this.decay
        );
        this.helperType = 2
        return this
    }

    createLPunt() {
        this.luz = new THREE.PointLight(
            this.color,this.intensidad,
            this.distance,this.decay
        );
        this.helperType = 1
        return this
    }

    visualHelp(scene, size = 0.5, color) {
        if (this.helperType == null) {
            throw new Error("Primero llama a un create distinto de createLAmb");
        }
        switch (this.helperType) {
            case 1: this.helper = new THREE.PointLightHelper(this.luz, size, color); break;
            case 2: this.helper = new THREE.SpotLightHelper(this.luz, color); break;
            case 3: this.helper = new THREE.DirectionalLightHelper(this.luz, size, color); break;
        }
        scene.add(this.helper);
        return this;
    }
    
    addScene(scene) {
        if (!this.luz) throw new Error("Primero llama a un create");
        scene.add(this.luz);
        return this;
    }

    addObj(obj) {
        if (!this.luz) throw new Error("Primero llama a un create");
        this.luz.add(obj);
        return this
    }
    
    removeScene(scene) {
        if (!this.luz) throw new Error("No se ha creado ninguna luz");
        scene.remove(this.luz);
        this.removeHelp();
        return this;
    }
    
    removeHelp() {
        if (this.helper) {
            this.helper.parent.remove(this.helper);
            this.helper.dispose();
            this.helper = null;
        }
        return this;
    }
    
}