// Datos del sistema solar.


export const TEX = "src/texturas/";
const grados = (g) => (g * Math.PI) / 180;

export const SOL = {
    radio: 15,
    color: 0xffaa00,
    textura: "ElSol.jpg",
    velGiro: 0.0005,
    luzAmbiente: 0.15,
    luz: { color: 0xffffff, intensidad: 2, decay: 0, sombraFar: 800 },
};


export const LUNA = {
    color: 0xaaaaaa,
    textura: "Luna.jpg",
    segmentos: 32,
};

export const PLANETAS = [
    {
        nombre: "mercurio", etiqueta: "Mercurio", tipo: "Planeta rocoso", vista: [2.5, 0.8, 0],
        radio: 0.6, color: 0x999999, textura: "Mercurio.jpg",
        velGiro: 0.0010, dist: 35, f1: 1.0, f2: 0.95, vel: 0.0030,
        planoOrbita: [grados(7), 0, 0],
    },
    {
        nombre: "venus", etiqueta: "Venus", tipo: "Planeta rocoso", vista: [6, 2, 0],
        radio: 1.5, color: 0xddaa66, textura: "Venus.jpg",
        velGiro: 0.0005, dist: 52, f1: 1.0, f2: 1.0, vel: 0.0018,
        planoOrbita: [0, 0, grados(3.4)],
        capas: [
            { textura: "VenusAtmofera.jpg", escala: 1.06, velGiro: 0.0013, opacidad: 0.75 },
        ],
    },
    {
        nombre: "tierra", etiqueta: "Tierra", tipo: "Planeta rocoso", vista: [6, 2, 0],
        radio: 1.6, color: 0x3366ff, textura: "Tierra.jpg",
        velGiro: 0.0020, dist: 72, f1: 1.0, f2: 0.95, vel: 0.0012,
        planoOrbita: [0, 0, 0],
        capas: [
            { textura: "Nubes.jpg", escala: 1.03, velGiro: 0.0046, opacidad: 0.9, aditiva: true },
        ],
        lunas: [
            { nombre: "luna", radio: 0.45, dist: 5, vel: 0.008, planoOrbita: [grados(5.1), 0, 0] },
        ],
    },
    {
        nombre: "marte", etiqueta: "Marte", tipo: "Planeta rocoso", vista: [5, 1.5, 0],
        radio: 0.85, color: 0xcc4422, textura: "Marte.jpg",
        velGiro: 0.0018, dist: 95, f1: 1.1, f2: 0.95, vel: 0.0009,
        planoOrbita: [grados(-1.85), 0, 0],
        lunas: [
            { nombre: "fobos", radio: 0.18, dist: 1.9, vel: 0.020, planoOrbita: [grados(1.1), 0, 0] },
            { nombre: "deimos", radio: 0.14, dist: 3.1, vel: 0.012, fase: 2, planoOrbita: [0, 0, grados(1.8)] },
        ],
    },
    {
        nombre: "jupiter", etiqueta: "Júpiter", tipo: "Gigante gaseoso", vista: [0, 15, 45],
        radio: 8, color: 0xddbb99, textura: "Jupiter.jpg",
        velGiro: 0.0030, dist: 170, f1: 1.0, f2: 1.0, vel: 0.0004,
        planoOrbita: [0, 0, grados(-1.3)],
        lunas: [
            { nombre: "io", radio: 0.45, dist: 12, vel: 0.010, planoOrbita: [grados(0.05), 0, 0] },
            { nombre: "europa", radio: 0.4, dist: 15, vel: 0.007, fase: 1.5, planoOrbita: [grados(0.47), 0, 0] },
            { nombre: "ganimedes", radio: 0.65, dist: 19, vel: 0.005, fase: 3, planoOrbita: [0, 0, grados(0.2)] },
            { nombre: "calisto", radio: 0.6, dist: 24, vel: 0.0035, fase: 4.5, planoOrbita: [grados(0.28), 0, 0] },
        ],
    },
    {
        nombre: "saturno", etiqueta: "Saturno", tipo: "Gigante gaseoso", vista: [0, 12, 35],
        radio: 6.8, color: 0xddcc99, textura: "Saturno.jpg",
        velGiro: 0.0028, dist: 250, f1: 1.0, f2: 0.95, vel: 0.00025,
        planoOrbita: [grados(2.5), 0, 0],
        anillo: { interior: 8.2, exterior: 15.6, color: 0xc9b28a, textura: "AnilloSaturno.png" },
        lunas: [
            { nombre: "rea", radio: 0.4, dist: 19, vel: 0.006, fase: 1, planoOrbita: [grados(0.35), 0, 0] },
            { nombre: "titan", radio: 0.7, dist: 26, vel: 0.004, fase: 3.5, planoOrbita: [0, 0, grados(0.35)] },
        ],
    },
];