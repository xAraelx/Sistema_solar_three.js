// Panel con la vista actual y sus controles (abajo a la izquierda).
// La tecla H lo oculta o lo muestra.

const CONTROLES = {
    orbital: [
        ["Arrastrar", "girar la vista"],
        ["Rueda", "acercar / alejar"],
        ["Clic dcho.", "desplazar"],
    ],
    planeta: [
        ["Arrastrar", "girar alrededor"],
        ["Rueda", "acercar / alejar"],
    ],
    nave: [
        ["W / S", "avanzar / retroceder"],
        ["A / D", "desplazarse a los lados"],
        ["R / F", "subir / bajar"],
        ["Q / E", "rotar"],
        ["Arrastrar / Flechas", "orientar la nave"],
    ],
};

const CAMARAS = [
    ["C", "vista central"],
    ["V", "nave"],
    ["1 – 6", "planetas"],
    ["H", "ocultar este panel"],
];

const CSS = `
.hud {
    position: fixed; left: 16px; bottom: 16px; width: 236px;
    padding: 12px 14px 12px 16px; box-sizing: border-box;
    background: rgba(10, 12, 20, 0.72);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 3px solid var(--acento, #ffaa00);
    border-radius: 10px;
    color: #e6e8ee; font: 12px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
    pointer-events: none; user-select: none;
    transition: opacity 0.2s;
}
.hud.oculto { opacity: 0; }
.hud-titulo { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.hud-punto { width: 10px; height: 10px; border-radius: 50%; background: var(--acento, #ffaa00);
    box-shadow: 0 0 8px var(--acento, #ffaa00); flex: none; }
.hud-sub { color: #9aa0ad; font-size: 11px; margin: 2px 0 10px 18px; }
.hud-seccion { color: #6f7685; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
    margin: 8px 0 4px; }
.hud-fila { display: grid; grid-template-columns: 78px 1fr; align-items: center; gap: 6px; margin: 3px 0; }
.hud kbd { justify-self: start; font: 11px ui-monospace, Consolas, monospace; color: #fff;
    padding: 1px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18); border-bottom-width: 2px; white-space: nowrap; }
.hud-desc { color: #c4c8d2; }
`;

const hex = (c) => "#" + c.toString(16).padStart(6, "0");

export class Hud {
    constructor() {
        const estilo = document.createElement("style");
        estilo.textContent = CSS;
        document.head.appendChild(estilo);

        this.el = document.createElement("div");
        this.el.className = "hud";
        document.body.appendChild(this.el);

        addEventListener("keydown", (e) => {
            if (e.target && e.target.closest && e.target.closest("input, textarea, select")) return;
            if (e.key.toLowerCase() === "h") this.el.classList.toggle("oculto");
        });
    }

    mostrar(info) {
        if (!info) return this;
        this.el.style.setProperty("--acento", hex(info.color));
        this.el.innerHTML =
            `<div class="hud-titulo"><span class="hud-punto"></span>${info.titulo}</div>` +
            `<div class="hud-sub">${info.subtitulo}</div>` +
            `<div class="hud-seccion">Controles</div>` +
            filas(CONTROLES[info.controles] || []) +
            `<div class="hud-seccion">Cámaras</div>` +
            filas(CAMARAS);
        return this;
    }
}

function filas(lista) {
    return lista
        .map(([tecla, desc]) =>
            `<div class="hud-fila"><kbd>${tecla}</kbd><span class="hud-desc">${desc}</span></div>`)
        .join("");
}
