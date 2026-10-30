# Práctica sistema solar

Sistema solar interactivo hecho con [three.js](https://threejs.org/) (r152). Incluye el Sol, seis planetas (de Mercurio a Saturno) y 13 lunas, cada uno con su órbita elíptica en un plano inclinado, su rotación propia y su textura. La Tierra tiene nubes, Venus una atmósfera semitransparente y Saturno su anillo. Se puede recorrer con una vista general, una vista que sigue a cada planeta y una nave que se pilota en tercera persona.

### Autores:
- [Arael Jesus Almeida Gonzlez](https://github.com/xAraelx)

**Proyecto en CodeSandbox:** [ENLACE AL SANDBOX](https://codesandbox.io/p/sandbox/nada-forked-f6dmrt)

**Vídeo de la ejecución:** [ENLACE AL VÍDEO](#)

![Demostración](#)

------

## Estructura de la carpeta

```
/
|- src/
|  |- index.html          #Página: solo carga index.js
|  |- index.js            #Escena, renderer, cámaras, GUI, panel y bucle de animación
|  |- datos.js            #Parámetros del Sol, los planetas, sus capas, el anillo y las lunas
|  |- sistemaSolar.js     #Construye el sistema a partir de datos.js
|  |- esfera.js           #Clase Esfera: malla esférica con textura y rotación propia
|  |- astro.js            #Clase Astro (hereda de Esfera): órbita, plano orbital y satélites
|  |- luz.js              #Clase Luz: ambiente, puntual, focal y direccional
|  |- camara.js           #Clase Camara: cámara, controles, seguimiento y tercera persona
|  |- gestorCamaras.js    #Cambio de cámaras con teclado y GUI
|  |- nave.js             #Clase Nave: triángulo con aleta que mueve FlyControls
|  |- hud.js              #Panel con la vista actual y sus controles
|  |- texturas/
|     |- ElSol.jpg, Mercurio.jpg, Venus.jpg, Tierra.jpg, Marte.jpg,
|     |  Jupiter.jpg, Saturno.jpg, Luna.jpg   #Superficies
|     |- Nubes.jpg            #Nubes de la Tierra
|     |- VenusAtmofera.jpg    #Atmósfera de Venus
|     |- AnilloSaturno.png    #Anillo de Saturno
|     |- Fondo.jpg            #Fondo del espacio (equirectangular)
|- package.json
|- README.md
```

## Recursos necesarios

El proyecto está pensado para CodeSandbox, que instala las dependencias de `package.json`:

- `three` 0.152.1
- `lil-gui`

No hay que añadir `type="module"` al `<script>` de `index.html`: el bundler de CodeSandbox ya trata `index.js` como módulo, y con ese atributo deja de funcionar.

------

## Controles

Abajo a la izquierda hay un panel que indica qué se está viendo (en la vista de un planeta, cuál es, de qué tipo y cuántas lunas tiene) y muestra los controles de esa vista. Se oculta con `H`.

| Vista | Control | Acción |
|---|---|---|
| **Central** | Arrastrar | Girar alrededor del Sol |
| | Rueda | Acercar / alejar |
| | Clic derecho + arrastrar | Desplazar la cámara |
| **Planeta** | Arrastrar | Girar alrededor del planeta |
| | Rueda | Acercar / alejar |
| **Nave** | `W` / `S` | Avanzar / retroceder |
| | `A` / `D` · `R` / `F` | Moverse a los lados · subir / bajar |
| | `Q` / `E` · flechas | Alabear · cabecear y girar |
| | Arrastrar | Orientar la nave |
| **Todas** | `C` | Vista central |
| | `V` | Nave (cámara libre) |
| | `1` – `6` | Mercurio, Venus, Tierra, Marte, Júpiter y Saturno |
| | `H` | Ocultar / mostrar el panel |

La GUI de la esquina superior derecha permite elegir la **cámara**, **mostrar u ocultar las órbitas** (de planetas y lunas a la vez) y cambiar la **velocidad global** de la simulación (de ×0,25 a ×5).

------

## Descripción del trabajo

### Jerarquía de los astros

Los planetas y las lunas son objetos de la clase `Astro`, que hereda de `Esfera`. Cada astro se compone de varios nodos del grafo de escena:

```
escena (o el cuerpo de su planeta, si es una luna)
└─ orbita          Grupo inclinado según planoOrbita
   ├─ trayectoria  elipse de la órbita
   └─ cuerpo       Grupo que se traslada por la elipse (no gira)
      ├─ esfera    superficie con textura; gira sobre sí misma
      └─ addObj    capas (nubes, atmósfera), anillo y órbitas de las lunas
```

Separar la traslación (`cuerpo`) de la rotación propia (`esfera`) evita que las lunas giren "pegadas" a su planeta. Si una luna colgara directamente de la malla del planeta, heredaría su rotación: orbitaría más rápido de lo indicado y su plano orbital daría vueltas con cada día del planeta. Con esta estructura, `addObj` cuelga las lunas del `cuerpo`, así que siguen al planeta en su órbita pero no en su giro.

Cada `Astro` guarda en `satelites` lo que se le añade con `addObj` (lunas y capas). Al animar un planeta se animan también sus satélites, y `mostrarTrayectoria` se propaga a las órbitas de sus lunas.

### Órbitas y rotación

- **Órbitas**: la posición se calcula con las ecuaciones paramétricas de una elipse centrada en el padre (`x = cos t · f1 · dist`, `z = sin t · f2 · dist`), con velocidad angular constante. La trayectoria se dibuja con un `EllipseCurve` con los mismos semiejes, así que coincide con el recorrido.
- **Plano orbital**: cada astro tiene la tupla `planoOrbita = [rx, ry, rz]` (en radianes), que gira el grupo `orbita`. En `datos.js` se escriben en grados con la función `grados()`. Las inclinaciones son aproximadas a las reales (Mercurio 7°, Venus 3,4°, la Luna 5,1°…). La de una luna es relativa al plano orbital de su planeta.
- **Fase**: la opción `fase` desplaza la posición inicial, para que las lunas de un mismo planeta no empiecen alineadas.
- **Rotación propia**: cada `esfera` gira según `giro` (eje) y `velGiro` (velocidad).
- **Rotación síncrona**: las lunas giran sobre sí mismas al mismo ritmo al que orbitan, así que muestran siempre la misma cara a su planeta.

### Lunas

| Planeta | Lunas |
|---|---|
| Tierra | Luna |
| Marte | Fobos, Deimos |
| Júpiter | Ío, Europa, Ganímedes, Calisto |
| Saturno | Rea, Titán |

Mercurio y Venus no tienen lunas. Todas usan la misma textura (`Luna.jpg`). Las de Saturno están fuera del anillo.

### Escalas y tiempo

Con distancias y tamaños reales los planetas serían invisibles, así que todos los valores de `datos.js` están ajustados a mano para que el sistema se vea bien. Se conserva el orden real: lo grande sigue siendo más grande y lo lejano, más lejano. Las lunas están a entre 2 y 4 radios de su planeta.

El tiempo de simulación avanza 250 unidades por segundo real (a velocidad ×1). Con eso:

| Astro | Radio | Distancia | Periodo orbital |
|---|---|---|---|
| Sol | 15 | – | – |
| Mercurio | 0,6 | 35 | 8 s |
| Tierra | 1,6 | 72 | 21 s |
| Luna | 0,45 | 5 (de la Tierra) | 3 s |
| Júpiter | 8 | 170 | 63 s |
| Saturno | 6,8 | 250 | 100 s |

Un día terrestre dura unos 13 s.

### Texturas y capas

- Todos los astros usan `MeshPhongMaterial` con su textura en `map`. El Sol es **emisivo** (`emissiveMap`), ya que la luz está dentro de él.
- Las **nubes de la Tierra** son una segunda esfera un 3 % mayor, con mezcla aditiva (`AdditiveBlending`) y su propia velocidad de giro.
- La **atmósfera de Venus** es otra esfera un 6 % mayor con opacidad 0,75.
- El **anillo de Saturno** es un `RingGeometry` de doble cara con la textura `AnilloSaturno.png`.
- El **fondo** es `scene.background` con una imagen equirectangular.

### Iluminación y sombras

- El Sol lleva una `PointLight` sin atenuación (`decay = 0`), así que ilumina igual a todo el sistema. Proyecta sombras con `renderer.shadowMap` (`shadow.camera.far = 800`).
- Una luz ambiente débil (0,15) deja ver un poco las caras nocturnas.

### Cámaras

Cada cámara es un objeto `Camara` (una `PerspectiveCamera` con sus controles), y `GestorCamaras` activa una y desactiva las demás. Al cambiar de cámara, el desplegable de la GUI y el panel se actualizan.

| Vista | Cámara |
|---|---|
| **Central** | `OrbitControls` alrededor del Sol. Es la vista inicial |
| **Planeta** | `OrbitControls` sin desplazamiento. En cada fotograma, la cámara y el punto de giro se mueven lo mismo que el planeta, así que lo siguen manteniendo el ángulo elegido. Hay una por planeta, creadas en bucle a partir de `datos.js` (campo `vista`) |
| **Nave** | Tercera persona. `FlyControls` mueve la nave y la cámara se coloca detrás y un poco por encima. La posición sigue a la nave sin retraso, y la orientación se suaviza con `slerp`, así que en los giros la cámara tarda un poco en ponerse detrás |

La nave es un triángulo plano azul con una aleta vertical (medio triángulo en un azul más claro) que permite distinguir arriba de abajo y delante de detrás. Se ve también desde las demás cámaras.

### Capturas

| | |
|---|---|
| ![Vista central](readme-data/vista_central.jpg) | ![Tierra](readme-data/vista_tierra.jpg) |
| ![Júpiter](readme-data/vista_jupiter.jpg) | ![Saturno](readme-data/vista_saturno.jpg) |
| ![Marte](readme-data/vista_marte.jpg) | ![Nave](readme-data/vista_nave.jpg) |

**Problemas observados y limitaciones:**
- Las órbitas tienen velocidad constante: no se aplican las leyes de Kepler.
- Los ejes de rotación no están inclinados.
- Fobos y Deimos son irregulares, pero aquí son esferas.

------

## Fuentes
Todas las texturas se obtivieron de [SOLAR SYSTEM SCOPE](https://www.solarsystemscope.com/textures/)

### Datos y documentación

- [Guía de la sesión 6](https://github.com/otsedom/otsedom.github.io/tree/main/IG/S6)
- [Documentación de three.js](https://threejs.org/docs/): `OrbitControls`, `FlyControls`, `MeshPhongMaterial`, `PointLight`, `RingGeometry`, `EllipseCurve`
- [lil-gui](https://lil-gui.georgealways.com/)

### Asistencia de IA

- [Búsqueda de las texturas de los planetas, el Sol y el fondo (chat con Claude)](https://claude.ai/share/9d192bbe-bf87-4ce9-91fc-5ee3fa31094d)
- [Petición de creación de archivos de datos para agilizar el proceso de creación de los objetos (chat con Claude)](https://claude.ai/share/daa8c0d7-3561-4e64-8da8-a1915db4d1b3)
- [Petición de creación de la nave (chat con Claude)](https://claude.ai/share/4f77a3a5-c8b3-48cd-b6ca-5fa5b245515b)
- [Petición del CSS para el HUD (chat con Claude)](https://claude.ai/share/9df27e4e-b8bf-4c0d-ba15-56c2a594fd2c)
