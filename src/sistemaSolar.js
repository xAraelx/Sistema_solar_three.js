import * as THREE from "three";
import { Esfera } from "./esfera.js";
import { Astro } from "./astro.js";
import { Luz } from "./luz.js";
import { TEX, SOL, LUNA, PLANETAS } from "./datos.js";

function crearSol(scene) {
    new Luz({ intensidad: SOL.luzAmbiente }).createLAmb().addScene(scene);

    const sol = new Esfera([0, 0, 0], [SOL.radio, 64, 32], SOL.color, {
        giro: [0, 1, 0],
        velGiro: SOL.velGiro,
        castShadow: false,
        receiveShadow: false,
        textura: TEX + SOL.textura,
        emisiva: true,
    }).createEsfera().addScene(scene);

    const { color, intensidad, decay, sombraFar } = SOL.luz;
    const luz = new Luz({ color, intensidad, decay }).createLPunt();
    luz.luz.castShadow = true;
    luz.luz.shadow.camera.far = sombraFar;
    sol.addObj(luz.luz);

    return sol;
}

function crearPlaneta(def) {
    return new Astro([0, 0, 0], [def.radio, 48, 24], def.color, {
        giro: [0, 1, 0],
        velGiro: def.velGiro,
        dist: def.dist, f1: def.f1, f2: def.f2, vel: def.vel,
        planoOrbita: def.planoOrbita,
        textura: TEX + def.textura,
    }).createEsfera().createTrayectoria();
}

function crearLuna(defLuna) {
    const def = Object.assign({}, LUNA, defLuna);
    return new Astro([0, 0, 0], [def.radio, def.segmentos, def.segmentos / 2], def.color, {
        giro: [0, -1, 0],
        velGiro: def.vel,
        dist: def.dist, vel: def.vel, fase: def.fase,
        planoOrbita: def.planoOrbita,
        textura: TEX + def.textura,
    }).createEsfera().createTrayectoria();
}

function crearCapa(radioPlaneta, def) {
    const capa = new Esfera([0, 0, 0], [radioPlaneta * def.escala, 48, 24], 0xffffff, {
        giro: [0, 1, 0],
        velGiro: def.velGiro,
        castShadow: false,
        receiveShadow: false,
        opacidad: def.opacidad,
        transparente: true,
        textura: TEX + def.textura,
    }).createEsfera();
    capa.esfera.material.depthWrite = false;
    if (def.aditiva) capa.esfera.material.blending = THREE.AdditiveBlending;
    return capa;
}

function crearAnillo(def) {
    const mat = new THREE.MeshPhongMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
    });

    new THREE.TextureLoader().load(TEX + def.textura, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.color.set(0xffffff);
        mat.opacity = 1;
        mat.needsUpdate = true;
    });

    const anillo = new THREE.Mesh(new THREE.RingGeometry(def.interior, def.exterior, 128), mat);
    anillo.rotation.x = Math.PI / 2;
    anillo.receiveShadow = true;
    return anillo;
}

export function crearSistemaSolar(scene) {
    const sol = crearSol(scene);
    const planetas = {};

    for (const def of PLANETAS) {
        const planeta = crearPlaneta(def).addScene(scene);
        for (const c of def.capas || []) planeta.addObj(crearCapa(def.radio, c));
        if (def.anillo) planeta.addObj(crearAnillo(def.anillo));
        for (const l of def.lunas || []) planeta.addObj(crearLuna(l));
        planetas[def.nombre] = planeta;
    }

    const lista = Object.values(planetas);

    return {
        sol,
        planetas,
        // Los planetas animan a sus lunas y capas a través de satelites
        animationLoop(t) {
            sol.animationLoop(1, t);
            for (const p of lista) p.animationLoop(1, t);
        },
        mostrarTrayectorias(visible) {
            for (const p of lista) p.mostrarTrayectoria(visible);
        },
    };
}