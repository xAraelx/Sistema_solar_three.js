import * as THREE from "three";
import GUI from "lil-gui";
import { Camara } from "./camara.js";
import { GestorCamaras } from "./gestorCamaras.js";
import { crearSistemaSolar } from "./sistemaSolar.js";
import { Nave } from "./nave.js";
import { Hud } from "./hud.js";
import { TEX, PLANETAS } from "./datos.js";


const scene = new THREE.Scene();
new THREE.TextureLoader().load(TEX + "Fondo.jpg", (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.background = tex;
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

Object.assign(document.body.style, { margin: "0", overflow: "hidden" });
renderer.domElement.style.display = "block";


const sistema = crearSistemaSolar(scene);

const nave = new Nave({ pos: [0, 10, 60], mirarA: [0, 0, 0] })
    .createNave().addScene(scene);

const nuevaCamara = (pos) =>
    new Camara({ pos, far: 5000 }).createPerspectiva().addScene(scene);

const vistaPlaneta = (planeta, pos) =>
    nuevaCamara(pos)
        .orbitControls(renderer.domElement, { enablePan: false })
        .seguir(planeta.esfera);

const camaras = new GestorCamaras()
    .add("Central", nuevaCamara([0, 220, 380])
        .orbitControls(renderer.domElement, {}))
    .add("Libre", nuevaCamara([0, 100, 250])
        .terceraPersona(nave, renderer.domElement,
            { movementSpeed: 60, rollSpeed: 0.3, dragToLook: true },
            { offset: [0, 1.2, 5], suavizado: 6 }));

const teclas = { c: "Central", v: "Libre" };
const infoHud = {
    Central: { titulo: "Vista central", subtitulo: "Sistema solar completo", color: 0xffaa00, controles: "orbital" },
    Libre: { titulo: "Pilotando la nave", subtitulo: "Cámara libre · tercera persona", color: 0x66ccff, controles: "nave" },
};

PLANETAS.forEach((def, i) => {
    camaras.add(def.etiqueta, vistaPlaneta(sistema.planetas[def.nombre], def.vista));
    teclas[String(i + 1)] = def.etiqueta;
    const n = (def.lunas || []).length;
    const lunas = n === 0 ? "sin lunas" : n === 1 ? "1 luna" : n + " lunas";
    infoHud[def.etiqueta] = {
        titulo: "Siguiendo: " + def.etiqueta,
        subtitulo: def.tipo + " · " + lunas,
        color: def.color,
        controles: "planeta",
    };
});
camaras.teclas(teclas);

const hud = new Hud().mostrar(infoHud[camaras.activa]);
camaras.alCambiar((nombre) => hud.mostrar(infoHud[nombre]));

const gui = new GUI();
const ajustes = { velocidad: 1, trayectoria: false };

camaras.gui(gui);
gui.add(ajustes, "trayectoria")
    .name("Mostrar Trayectoria")
    .onChange((v) => sistema.mostrarTrayectorias(v));
gui.add(ajustes, "velocidad", 0.25, 5, 0.05).name("Velocidad global");
sistema.mostrarTrayectorias(ajustes.trayectoria);

let tSim = 0;
let ultimo = performance.now();

function animationLoop() {
    requestAnimationFrame(animationLoop);

    const ahora = performance.now();
    tSim += (ahora - ultimo) * ajustes.velocidad * 0.25;
    ultimo = ahora;

    sistema.animationLoop(tSim);
    camaras.animationLoop();

    renderer.render(scene, camaras.actual);
}
animationLoop();

addEventListener("resize", () => {
    camaras.resize(innerWidth / innerHeight);
    renderer.setSize(innerWidth, innerHeight);
});