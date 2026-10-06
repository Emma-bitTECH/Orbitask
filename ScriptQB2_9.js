/* =========================================================
   ÓRBITASK — lógica de la aplicación
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURACIÓN
   --------------------------------------------------------- */

// Usuarios habilitados por el momento
const USUARIOS = {
    admin1: "1234",
    admin2: "4321"
};

// ===== MODO DISEÑO — poner en false antes de publicar =====
const MODO_DISENO = true;

// El botón ? repite el tutorial guiado sobre la página.
// En true usa en cambio la versión en ventana (las diapositivas del dialog).
const TUTORIAL_CON_VENTANAS = false;

// Mascotas espaciales disponibles
// (Perro-fuego FROG queda pendiente de link de GIF; cuando lo tengas,
//  descomentá la línea y entra automáticamente al sorteo)
const MASCOTAS = [
    {
        id: "catarsis",
        nombre: "CATARSIS",
        descripcion: "Gato-ciervo",
        gif: "https://ik.imagekit.io/ui9le8s20/catarsis.gif"
    },
    {
        id: "hurlin",
        nombre: "HURLIN",
        descripcion: "Hurón-mago",
        gif: "https://ik.imagekit.io/ui9le8s20/huron-ezgif.com-crop.gif?updatedAt=1789056660227"
    }
    // , { id: "frog", nombre: "FROG", descripcion: "Perro-fuego", gif: "PEGAR_LINK_AQUI" }
];

// Colores de urgencia (4 = muy urgente ... 1 = nada urgente)
const COLORES_URGENCIA = { 4: "#FF4D4D", 3: "#FF9A3C", 2: "#FFE14D", 1: "#5BE38C" };

// --- vida ---
const VALORES_COMUNES  = [3, 5, 10, 12, 15];
const VALOR_BRONCE     = 20;    // cada tanto
const VALOR_ORO        = 50;    // todavía más raro
const PROB_ORO         = 0.02;  // 2%
const PROB_BRONCE      = 0.10;  // 10%

// La barra pierde un 30% cada 24 horas
const DECAIMIENTO_POR_SEGUNDO = 30 / (24 * 60 * 60);

// --- anti-trampa ---
const MAX_DESMARCADAS   = 3;            // veces que se puede devolver una tarea a pendientes
const ALIMENTOS_SEGUIDOS = 5;           // alimentaciones antes del descanso
const DESCANSO_MS        = 30 * 60 * 1000;   // 30 minutos

// --- amenaza espacial ---
const AMENAZA = {
    intervalo:      45 * 60 * 1000,   // cada cuánto llega una amenaza
    duracionAtaque: 10 * 60 * 1000,   // cuánto dura el ataque si no llegaste al nivel
    avisoCerca:      5 * 60 * 1000,   // desde cuándo el contador se pone en alerta
    mensajeDetenido:     8 * 1000     // cuánto queda el cartel "ataque detenido"
};

const EFECTOS_ATAQUE = [
    { id: "letras", nombre: "Letras desordenadas" },
    { id: "alien",  nombre: "Categorías alienígenas" },
    { id: "mono",   nombre: "Página monocromática" }
];

/* ---------------------------------------------------------
   2. TEXTOS DEL TUTORIAL (una sola fuente para las dos versiones)
   --------------------------------------------------------- */

const IMG_MODULOS = "https://dthezntil550i.cloudfront.net/0q/latest/0q2210030121066210017806817/ea891afb-19ce-49ac-80bc-5acaa711246d.png";

const PASOS_TUTORIAL = [
    {
        id: "1",
        selector: null,
        imagen: "logo-completo.png",
        html: `<h2>¡Bienvenid@, viajer@ espacial!</h2>
               <p>ÓRBITASK es una herramienta que permite el registro y administración de tareas, dividido en sus dos formatos, web y físico. En este tutorial, te explicaremos cómo funciona el sitio web.</p>`
    },
    {
        id: "2",
        selector: "#seccion_abajo",
        imagen: IMG_MODULOS,
        html: `<p>Después de haber iniciado sesión, encontrarás que la página está dividida en tres módulos.</p>
               <ul class="lista_tutorial">
                   <li>Mascota alienígena</li>
                   <li>Lista de tareas pendientes</li>
                   <li>Lista de tareas realizadas</li>
               </ul>`
    },
    {
        id: "3",
        selector: "#seccion_personaje",
        imagen: "https://ik.imagekit.io/ui9le8s20/catarsis.gif",
        html: `<p>En el primer módulo, entonces, encontrarás lo más importante: ¡tu mascota alienigena!</p>
               <p>Al iniciar sesión, se te es asignada una criatura espacial aleatoria, la cuál deberás cuidar y mantener con vida a medida que completes tus tareas. Debés llevarlo al máximo nivel posible para que te proteja de los peligros espacial</p>`
    },
    {
        id: "4",
        selector: "#lista_pendientes",
        imagen: IMG_MODULOS,
        html: `<p>En la lista de tareas pendientes encontrarás ítems con tus quehaceres. Al pulsar el botón +, podrás registrar tareas con sus respectivos detalles y, una vez se agreguen a tu lista, podrás pulsarlas para entrar en el modo edición de estas. Cada item tendrá a derecha un pequeño círculo de color que determinará la urgencia que le asignes, y un símbolo de la categoría en la que lo clasifiques.</p>
               <p>Cuando concluyas tus tareas, solo marca el pequeño cuadrado a su izquierda y pasarán a la siguiente lista.</p>
               <button type="button" class="boton_texto" data-extra="1">Más información sobre registrar y editar tareas</button>`
    },
    {
        id: "5",
        selector: "#lista_realizados",
        imagen: IMG_MODULOS,
        html: `<p>Cuando tus tareas aparezcan en la lista de tareas realizadas, nosotros entendemos que ya las terminaste, pero siéntete libre de desmarcar el cuadrado y devolverlas a la lista de pendientes cuando quieras.</p>
               <p>Cada tarea realizada tendrá a su derecha un valor de vida ♥ que, al hacer click sobre este, servirá para aumentar el nivel de tu mascota alienígena. Algunas tareas valen más, y otras menos, es un número que solo el destino decide ¡Pero cuidado! Si devuelves tu item a la lista de tareas pendientes, cuando lo devuelvas a la lista de tareas realizadas tendrá un nuevo valor y será distinto el progreso del nivel de tu mascota.</p>`
    },
    {
        id: "6",
        selector: "#contador_amenaza",
        imagen: "logo-completo.png",
        html: `<h2>Amenaza espacial</h2>
               <p>Arriba, en el centro de la barra, vas a ver un contador de <strong>amenaza espacial</strong>. Cada cierto tiempo, el espacio manda un ataque sobre tu órbita, y el contador te avisa cuánto falta y qué <strong>nivel necesario</strong> tiene que tener tu mascota para frenarlo.</p>
               <p>Si llegás a ese nivel antes de que el contador llegue a cero, tu mascota detiene el ataque. Si no llegás, durante unos minutos algo se descontrola: las letras de tus ítems se desordenan, las categorías se vuelven alienígenas o la página entera pierde el color.</p>`
    },
    {
        id: "extra",
        selector: "#boton",
        imagen: IMG_MODULOS,
        html: `<h2>Registrar y editar tareas</h2>
               <p>Al agregar o editar ítems, se abrirá una pestaña con distintos recuadros que puedes o no completar para detallar mejor sobre qué tratarán tus tareas. El único recuadro obligatorio es el primero, el del nombre. Luego, puede completar sobre la descripción, la urgencia del ítem (a partir de colores rojo - muy urgente - y verde - nada urgente)</p>`
    }
];

const PASOS_PRINCIPALES = PASOS_TUTORIAL.filter(p => p.id !== "extra");

/* ---------------------------------------------------------
   3. ESTADO
   --------------------------------------------------------- */

let usuarioActual = null;
let estado = null;
let idEnEdicion = null;
let mascotaPendienteDeRevelar = false;
let relojGeneral = null;

const claveDe = (usuario) => "orbitask_" + usuario;

function estadoInicial(){
    const mascota = MASCOTAS[Math.floor(Math.random() * MASCOTAS.length)];
    return {
        mascotaId: mascota.id,
        vida: 0,
        nivel: 0,
        tareas: [],
        ultimoTick: Date.now(),
        tutorialVisto: false,
        mascotaRevelada: false,
        alimentosSeguidos: 0,
        descansoHasta: 0,
        amenaza: null
    };
}

function guardarEstado(){
    if(!usuarioActual || !estado) return;
    try{
        localStorage.setItem(claveDe(usuarioActual), JSON.stringify(estado));
    }catch(e){
        console.warn("No se pudo guardar el estado:", e);
    }
}

function cargarEstado(usuario){
    try{
        const crudo = localStorage.getItem(claveDe(usuario));
        if(crudo) return JSON.parse(crudo);
    }catch(e){
        console.warn("No se pudo leer el estado:", e);
    }
    return null;
}

function mascotaDelUsuario(){
    return MASCOTAS.find(m => m.id === estado.mascotaId) || MASCOTAS[0];
}

/* ---------------------------------------------------------
   4. LOGIN
   --------------------------------------------------------- */

const pantallaLogin = document.getElementById("pantalla_login");
const app           = document.getElementById("app");
const formLogin     = document.getElementById("form_login");
const loginError    = document.getElementById("login_error");

// vuelve a mostrar la pantalla de login sin romper su maquetado en dos
// paneles (antes se forzaba display:flex y se desarmaba la grilla)
function mostrarLogin(){
    pantallaLogin.style.removeProperty("display");
    pantallaLogin.hidden = false;
    document.getElementById("login_usuario").value = "";
    document.getElementById("login_clave").value   = "";
    loginError.classList.remove("visible");
}

function ocultarLogin(){
    pantallaLogin.style.display = "none";
}

formLogin.addEventListener("submit", function(evento){
    evento.preventDefault();
    const usuario = document.getElementById("login_usuario").value.trim().toLowerCase();
    const clave   = document.getElementById("login_clave").value;

    if(USUARIOS[usuario] !== undefined && USUARIOS[usuario] === clave){
        loginError.classList.remove("visible");
        iniciarSesion(usuario);
    }else{
        loginError.classList.add("visible");
        document.getElementById("login_clave").value = "";
    }
});

function iniciarSesion(usuario){
    usuarioActual = usuario;

    const guardado = cargarEstado(usuario);
    const primerIngreso = (guardado === null);

    estado = guardado || estadoInicial();

    // completa campos que puedan faltar en estados viejos
    if(typeof estado.vida  !== "number")  estado.vida  = 0;
    if(typeof estado.nivel !== "number")  estado.nivel = 0;
    if(!Array.isArray(estado.tareas))     estado.tareas = [];
    if(!estado.mascotaId)                 estado.mascotaId = MASCOTAS[0].id;
    if(typeof estado.alimentosSeguidos !== "number") estado.alimentosSeguidos = 0;
    if(typeof estado.descansoHasta !== "number")     estado.descansoHasta = 0;
    if(!estado.amenaza)                   estado.amenaza = nuevaAmenaza();

    aplicarDecaimiento();

    ocultarLogin();
    app.hidden = false;

    pintarMascota();
    renderizarListas();
    actualizarBarraVida();
    actualizarAmenaza();
    guardarEstado();

    if(primerIngreso || !estado.tutorialVisto){
        mascotaPendienteDeRevelar = !estado.mascotaRevelada;
        // primer ingreso: tutorial visual sobre la propia página
        setTimeout(() => iniciarTutorialVisual(), 350);
    }

    if(relojGeneral) clearInterval(relojGeneral);
    relojGeneral = setInterval(tickGeneral, 1000);
}

document.getElementById("boton_salir").addEventListener("click", function(){
    guardarEstado();
    if(relojGeneral) clearInterval(relojGeneral);
    cerrarTutorialVisual(false);
    usuarioActual = null;
    estado = null;
    app.hidden = true;
    mostrarLogin();
});

/* ---------------------------------------------------------
   4 bis. MODO DISEÑO — BORRAR ANTES DE PUBLICAR
   --------------------------------------------------------- */

document.getElementById("boton_reset_dev").addEventListener("click", function(){
    Object.keys(USUARIOS).forEach(u => {
        try{ localStorage.removeItem(claveDe(u)); }catch(e){ /* ignorar */ }
    });

    if(relojGeneral) clearInterval(relojGeneral);
    cerrarTutorialVisual(false);
    usuarioActual = null;
    estado = null;
    mascotaPendienteDeRevelar = false;
    quitarEfectoAtaque();

    app.hidden = true;
    mostrarLogin();

    const aviso = document.getElementById("aviso_dev");
    const textoOriginal = aviso.dataset.original || aviso.textContent;
    aviso.dataset.original = textoOriginal;
    aviso.textContent = "Usuarios reiniciados. El próximo ingreso vuelve a ser el primero.";
    aviso.style.color = "#72E6B1";
    aviso.style.opacity = "1";

    setTimeout(() => {
        aviso.textContent = textoOriginal;
        aviso.style.color = "";
        aviso.style.opacity = "";
    }, 3500);
});

/* ---------------------------------------------------------
   5. MASCOTA, BARRA DE VIDA Y NIVEL
   --------------------------------------------------------- */

function pintarMascota(){
    const m = mascotaDelUsuario();
    document.getElementById("gif_mascota").src = m.gif;
    document.getElementById("gif_mascota").alt = m.nombre + " — " + m.descripcion;
    document.getElementById("nombre_mascota").textContent = m.nombre;
}

let animandoSubidaNivel = false;

function actualizarBarraVida(){
    const porcentaje = Math.max(0, Math.min(100, estado.vida));

    if(!animandoSubidaNivel){
        document.getElementById("barra_vida_relleno").style.width = porcentaje + "%";
        document.getElementById("barra_vida_texto").textContent = Math.round(porcentaje) + "%";
    }

    document.getElementById("contador_nivel").textContent = "NIVEL " + estado.nivel;
}

function alimentar(puntos){
    const nivelAnterior = estado.nivel;

    estado.vida += puntos;
    while(estado.vida >= 100){
        estado.vida -= 100;
        estado.nivel += 1;
    }

    animarGananciaDeVida(puntos, estado.nivel > nivelAnterior);
    actualizarBarraVida();
    guardarEstado();
}

function animarGananciaDeVida(puntos, subioDeNivel){
    const barra = document.getElementById("barra_vida");
    const zona  = document.getElementById("zona_vida");
    const nivel = document.getElementById("contador_nivel");
    const tipo  = tipoDeValor(puntos);

    barra.classList.remove("ganando", "bronce", "oro");
    void barra.offsetWidth;
    barra.classList.add("ganando");
    if(tipo) barra.classList.add(tipo);
    setTimeout(() => barra.classList.remove("ganando", "bronce", "oro"), 900);

    const flota = document.createElement("span");
    flota.className = "flota_vida" + (tipo ? " " + tipo : "");
    flota.textContent = "+" + puntos;
    zona.appendChild(flota);
    setTimeout(() => flota.remove(), 1050);

    if(subioDeNivel){
        const relleno = document.getElementById("barra_vida_relleno");

        animandoSubidaNivel = true;
        relleno.style.width = "100%";
        document.getElementById("barra_vida_texto").textContent = "100%";

        setTimeout(() => {
            relleno.style.transition = "none";
            relleno.style.width = "0%";
            void relleno.offsetWidth;
            relleno.style.transition = "";
            animandoSubidaNivel = false;
            actualizarBarraVida();
        }, 620);

        nivel.classList.remove("subio");
        void nivel.offsetWidth;
        nivel.classList.add("subio");
        setTimeout(() => nivel.classList.remove("subio"), 1050);
    }
}

// la barra pierde un 30% cada 24 horas, también mientras no estás
function aplicarDecaimiento(){
    const ahora = Date.now();
    const desde = estado.ultimoTick || ahora;
    const segundos = Math.max(0, (ahora - desde) / 1000);
    estado.ultimoTick = ahora;

    if(segundos <= 0) return;

    estado.vida -= segundos * DECAIMIENTO_POR_SEGUNDO;

    while(estado.vida < 0){
        if(estado.nivel > 0){
            estado.nivel -= 1;
            estado.vida += 100;
        }else{
            estado.vida = 0;
            break;
        }
    }
}

// reloj único: decaimiento + amenaza + estado de los corazones
function tickGeneral(){
    aplicarDecaimiento();
    actualizarBarraVida();
    actualizarAmenaza();
    actualizarCorazones();
    guardarEstado();
}

/* ---------------------------------------------------------
   6. LISTAS DE TAREAS
   --------------------------------------------------------- */

const ulPendientes = document.getElementById("ul_pendientes");
const ulRealizados = document.getElementById("ul_realizados");

function valorDeVidaAleatorio(){
    const sorteo = Math.random();
    if(sorteo < PROB_ORO)                return VALOR_ORO;
    if(sorteo < PROB_ORO + PROB_BRONCE)  return VALOR_BRONCE;
    return VALORES_COMUNES[Math.floor(Math.random() * VALORES_COMUNES.length)];
}

function tipoDeValor(valor){
    if(valor === VALOR_ORO)    return "oro";
    if(valor === VALOR_BRONCE) return "bronce";
    return "";
}

function nuevoId(){
    return "t" + Date.now() + Math.floor(Math.random() * 1000);
}

// ¿los corazones están en descanso? (anti-trampa)
function enDescanso(){
    return Date.now() < (estado.descansoHasta || 0);
}

function restanteDescanso(){
    return Math.max(0, (estado.descansoHasta || 0) - Date.now());
}

function renderizarListas(){
    ulPendientes.innerHTML = "";
    ulRealizados.innerHTML = "";

    const pendientes = estado.tareas
        .filter(t => !t.hecha)
        .sort((a, b) => (b.urgencia - a.urgencia) || (a.creada - b.creada));

    const realizados = estado.tareas
        .filter(t => t.hecha)
        .sort((a, b) => (b.completada || 0) - (a.completada || 0));

    if(pendientes.length === 0){
        ulPendientes.innerHTML = '<li class="lista_vacia">Todavía no cargaste tareas. Pulsá el + para empezar.</li>';
    }else{
        pendientes.forEach(t => ulPendientes.appendChild(crearLi(t, false)));
    }

    if(realizados.length === 0){
        ulRealizados.innerHTML = '<li class="lista_vacia">Acá van a aparecer las tareas que completes.</li>';
    }else{
        realizados.forEach(t => ulRealizados.appendChild(crearLi(t, true)));
    }
}

// orden visual: checkbox · nombre · círculo de urgencia · símbolo de categoría [· corazón]
function crearLi(tarea, esRealizado){
    const li = document.createElement("li");
    li.dataset.id = tarea.id;

    const usadas    = tarea.desmarcadas || 0;
    const restantes = MAX_DESMARCADAS - usadas;
    const bloqueada = esRealizado && restantes <= 0;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = !!tarea.hecha;

    if(!esRealizado){
        check.title = "Marcar como realizada";
    }else if(bloqueada){
        check.disabled = true;
        check.title = "Ya devolviste esta tarea a pendientes " + MAX_DESMARCADAS + " veces. No se puede devolver de nuevo.";
    }else{
        check.title = "Devolver a pendientes (te quedan " + restantes + " de " + MAX_DESMARCADAS + ")";
    }

    check.addEventListener("change", () => alternarHecha(tarea.id, check.checked));

    const nombre = document.createElement("span");
    nombre.className = "item_nombre";
    nombre.textContent = nombreVisible(tarea);
    nombre.title = tarea.descripcion ? tarea.descripcion : "Pulsá para editar";
    nombre.addEventListener("click", () => abrirEdicion(tarea.id));

    const circulo = document.createElement("span");
    circulo.className = "circulo_urgencia";
    circulo.style.backgroundColor = COLORES_URGENCIA[tarea.urgencia] || COLORES_URGENCIA[2];
    circulo.title = "Urgencia";

    const simbolo = document.createElement("span");
    simbolo.className = "simbolo_categoria";
    simbolo.textContent = categoriaVisible(tarea);
    simbolo.title = "Categoría";

    if(bloqueada) li.classList.add("item_bloqueado");

    li.append(check, nombre, circulo, simbolo);

    if(esRealizado){
        const tipo = tipoDeValor(tarea.valor);
        const corazon = document.createElement("button");
        corazon.type = "button";
        corazon.className = "boton_corazon" + (tipo ? " " + tipo : "");
        corazon.dataset.valor = tarea.valor;
        corazon.textContent = "♥+" + tarea.valor;
        corazon.addEventListener("click", (e) => {
            e.stopPropagation();
            if(enDescanso()){ avisarDescanso(li); return; }
            mostrarConfirmCorazon(li, tarea);
        });
        li.appendChild(corazon);
        pintarCorazon(corazon);
    }

    return li;
}

// pone el corazón gris mientras dura el descanso
function pintarCorazon(corazon){
    const valor = corazon.dataset.valor;
    if(enDescanso()){
        corazon.classList.add("descansando");
        corazon.textContent = "♥ " + formatearTiempo(restanteDescanso());
        corazon.title = "Tu mascota está digiriendo. Podés volver a alimentarla en " + formatearTiempo(restanteDescanso()) + ".";
    }else{
        corazon.classList.remove("descansando");
        corazon.textContent = "♥+" + valor;
        corazon.title = (Number(valor) === VALOR_ORO)    ? "¡Corazón dorado! Vale " + VALOR_ORO + " de vida"
                      : (Number(valor) === VALOR_BRONCE) ? "¡Corazón de bronce! Vale " + VALOR_BRONCE + " de vida"
                      : "Alimentar a tu mascota";
    }
}

function actualizarCorazones(){
    document.querySelectorAll("#ul_realizados .boton_corazon").forEach(pintarCorazon);
}

function avisarDescanso(li){
    cerrarConfirms();
    const caja = document.createElement("div");
    caja.className = "confirm_corazon";
    caja.innerHTML =
        '<p><strong>Tu mascota está digiriendo.</strong><br>Comió ' + ALIMENTOS_SEGUIDOS +
        ' tareas seguidas. Podés volver a alimentarla en ' + formatearTiempo(restanteDescanso()) + '.</p>' +
        '<div class="fila_botones"><button type="button" class="confirm_no">Entendido</button></div>';
    caja.querySelector(".confirm_no").addEventListener("click", (e) => { e.stopPropagation(); cerrarConfirms(); });
    li.appendChild(caja);
}

function formatearTiempo(ms){
    const total = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(total / 60);
    const seg = total % 60;
    return String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0");
}

function alternarHecha(id, hecha){
    const tarea = estado.tareas.find(t => t.id === id);
    if(!tarea) return;

    if(!hecha){
        const usadas = tarea.desmarcadas || 0;
        if(usadas >= MAX_DESMARCADAS){
            renderizarListas();
            return;
        }
        tarea.desmarcadas = usadas + 1;
    }

    tarea.hecha = hecha;

    if(hecha){
        tarea.valor = valorDeVidaAleatorio();
        tarea.completada = Date.now();
    }else{
        tarea.valor = null;
        tarea.completada = null;
    }

    guardarEstado();
    renderizarListas();
}

/* ---------- confirm emergente del corazón ---------- */

function cerrarConfirms(){
    document.querySelectorAll(".confirm_corazon").forEach(c => c.remove());
}

function mostrarConfirmCorazon(li, tarea){
    const yaAbierto = li.querySelector(".confirm_corazon");
    cerrarConfirms();
    if(yaAbierto) return;

    const tipo = tipoDeValor(tarea.valor);

    const caja = document.createElement("div");
    caja.className = "confirm_corazon" + (tipo ? " " + tipo : "");
    caja.innerHTML =
        (tipo ? '<p class="aviso_especial ' + tipo + '">' +
                (tipo === "oro" ? "¡Corazón dorado!" : "¡Corazón de bronce!") + '</p>' : '') +
        '<p>Una vez que alimentes a tu animal espacial con esta tarea, la tarea se borra. ¿Seguimos?</p>' +
        '<div class="fila_botones">' +
            '<button type="button" class="confirm_no">Cancelar</button>' +
            '<button type="button" class="confirm_si' + (tipo ? ' ' + tipo : '') + '">Alimentar ♥+' + tarea.valor + '</button>' +
        '</div>';

    caja.querySelector(".confirm_no").addEventListener("click", (e) => {
        e.stopPropagation();
        cerrarConfirms();
    });

    caja.querySelector(".confirm_si").addEventListener("click", (e) => {
        e.stopPropagation();
        cerrarConfirms();

        alimentar(tarea.valor);
        estado.tareas = estado.tareas.filter(t => t.id !== tarea.id);

        // anti-trampa: tras N alimentaciones seguidas, los corazones descansan
        estado.alimentosSeguidos = (estado.alimentosSeguidos || 0) + 1;
        if(estado.alimentosSeguidos >= ALIMENTOS_SEGUIDOS){
            estado.alimentosSeguidos = 0;
            estado.descansoHasta = Date.now() + DESCANSO_MS;
        }

        guardarEstado();
        renderizarListas();
    });

    li.appendChild(caja);
}

document.addEventListener("click", function(e){
    if(!e.target.closest(".confirm_corazon") && !e.target.closest(".boton_corazon")){
        cerrarConfirms();
    }
});

/* ---------------------------------------------------------
   7. DIALOG AGREGAR / EDITAR ITEM
   --------------------------------------------------------- */

const dialogItem       = document.getElementById("agregar_item");
const formItem         = document.getElementById("form_item");
const inputNombre      = document.getElementById("primera_barra");
const inputDescripcion = document.getElementById("segunda_barra");
const selectUrgencia   = document.getElementById("select_urgencia");
const selectCategoria  = document.getElementById("select_categoria");
const tituloFormItem   = document.getElementById("titulo_form_item");
const botonBorrarItem  = document.getElementById("boton_borrar_item");

document.getElementById("boton").addEventListener("click", function(){
    idEnEdicion = null;
    tituloFormItem.textContent = "NUEVA TAREA";
    formItem.reset();
    selectUrgencia.value  = "2";
    selectCategoria.value = "⭐";
    botonBorrarItem.classList.remove("visible");
    dialogItem.showModal();
    inputNombre.focus();
});

function abrirEdicion(id){
    const tarea = estado.tareas.find(t => t.id === id);
    if(!tarea) return;

    idEnEdicion = id;
    tituloFormItem.textContent = "EDITAR TAREA";
    inputNombre.value      = tarea.nombre;
    inputDescripcion.value = tarea.descripcion || "";
    selectUrgencia.value   = String(tarea.urgencia);
    selectCategoria.value  = tarea.categoria || "⭐";
    botonBorrarItem.classList.add("visible");
    dialogItem.showModal();
    inputNombre.focus();
}

formItem.addEventListener("submit", function(evento){
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    if(nombre === ""){ inputNombre.focus(); return; }

    if(idEnEdicion){
        const tarea = estado.tareas.find(t => t.id === idEnEdicion);
        if(tarea){
            tarea.nombre      = nombre;
            tarea.descripcion = inputDescripcion.value.trim();
            tarea.urgencia    = parseInt(selectUrgencia.value, 10);
            tarea.categoria   = selectCategoria.value;
        }
    }else{
        estado.tareas.push({
            id:          nuevoId(),
            nombre:      nombre,
            descripcion: inputDescripcion.value.trim(),
            urgencia:    parseInt(selectUrgencia.value, 10),
            categoria:   selectCategoria.value,
            hecha:       false,
            valor:       null,
            desmarcadas: 0,
            creada:      Date.now(),
            completada:  null
        });
    }

    guardarEstado();
    renderizarListas();
    dialogItem.close();
});

botonBorrarItem.addEventListener("click", function(){
    if(!idEnEdicion) return;
    estado.tareas = estado.tareas.filter(t => t.id !== idEnEdicion);
    guardarEstado();
    renderizarListas();
    dialogItem.close();
});

/* ---------------------------------------------------------
   8. AMENAZA ESPACIAL
   --------------------------------------------------------- */

const cajaAmenaza    = document.getElementById("contador_amenaza");
const amenazaTitulo  = document.getElementById("amenaza_titulo");
const amenazaTiempo  = document.getElementById("amenaza_tiempo");
const amenazaNivel   = document.getElementById("amenaza_nivel");

let rotacionEfecto = 0;

function nuevaAmenaza(){
    return {
        llegaEn: Date.now() + AMENAZA.intervalo,
        nivelNecesario: (estado ? estado.nivel : 0) + 1,
        atacandoHasta: 0,
        efecto: null,
        detenidoHasta: 0
    };
}

function actualizarAmenaza(){
    const a = estado.amenaza;
    const ahora = Date.now();

    // 1. ataque en curso
    if(a.atacandoHasta > ahora){
        cajaAmenaza.className = "atacando";
        amenazaTitulo.textContent = "ATAQUE ESPACIAL EN PROCESO";
        amenazaTiempo.textContent = formatearTiempo(a.atacandoHasta - ahora);
        const ef = EFECTOS_ATAQUE.find(e => e.id === a.efecto);
        amenazaNivel.textContent = ef ? ef.nombre.toUpperCase() : "";
        aplicarEfectoAtaque(a.efecto);
        return;
    }

    // 2. el ataque acaba de terminar
    if(a.atacandoHasta && a.atacandoHasta <= ahora){
        quitarEfectoAtaque();
        Object.assign(a, nuevaAmenaza());
        guardarEstado();
    }

    // 3. cartel de "ataque detenido"
    if(a.detenidoHasta > ahora){
        cajaAmenaza.className = "detenido";
        amenazaTitulo.textContent = "ATAQUE ESPACIAL DETENIDO";
        amenazaTiempo.textContent = "✔";
        amenazaNivel.textContent = "TU MASCOTA LO FRENÓ";
        return;
    }

    if(a.detenidoHasta && a.detenidoHasta <= ahora){
        a.detenidoHasta = 0;
        Object.assign(a, nuevaAmenaza());
        guardarEstado();
    }

    // 4. la amenaza llegó: se resuelve y se repinta en el acto
    if(ahora >= a.llegaEn){
        if(estado.nivel >= a.nivelNecesario){
            a.detenidoHasta = ahora + AMENAZA.mensajeDetenido;
        }else{
            a.efecto = EFECTOS_ATAQUE[Math.floor(Math.random() * EFECTOS_ATAQUE.length)].id;
            a.atacandoHasta = ahora + AMENAZA.duracionAtaque;
            aplicarEfectoAtaque(a.efecto);
        }
        guardarEstado();
        actualizarAmenaza();
        return;
    }

    // 5. cuenta regresiva
    const falta = a.llegaEn - ahora;
    cajaAmenaza.className = (falta <= AMENAZA.avisoCerca) ? "cerca" : "esperando";
    amenazaTitulo.textContent = "AMENAZA ESPACIAL";
    amenazaTiempo.textContent = formatearTiempo(falta);
    amenazaNivel.textContent  = "NIVEL NECESARIO " + a.nivelNecesario;
}

/* ---------- efectos del ataque ---------- */

let efectoActivo = null;
const letrasRevueltas = new Map();   // id de tarea -> nombre desordenado

function aplicarEfectoAtaque(efecto){
    if(efectoActivo === efecto) return;
    quitarEfectoAtaque();
    efectoActivo = efecto;

    if(efecto === "mono")   document.body.classList.add("ataque_mono");
    if(efecto === "letras") document.body.classList.add("ataque_letras");

    renderizarListas();
}

function quitarEfectoAtaque(){
    if(!efectoActivo) return;
    efectoActivo = null;
    letrasRevueltas.clear();
    document.body.classList.remove("ataque_mono", "ataque_letras");
    if(estado) renderizarListas();
}

function nombreVisible(tarea){
    if(efectoActivo !== "letras") return tarea.nombre;

    if(!letrasRevueltas.has(tarea.id)){
        letrasRevueltas.set(tarea.id, desordenar(tarea.nombre));
    }
    return letrasRevueltas.get(tarea.id);
}

// desordena las letras de cada palabra, dejando espacios y signos en su lugar
function desordenar(texto){
    return texto.split(" ").map(palabra => {
        const letras = palabra.split("");
        for(let i = letras.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [letras[i], letras[j]] = [letras[j], letras[i]];
        }
        return letras.join("");
    }).join(" ");
}

function categoriaVisible(tarea){
    if(efectoActivo === "alien") return "👽";
    return tarea.categoria || "⭐";
}

/* ---------- MODO DISEÑO — BORRAR ANTES DE PUBLICAR ---------- */

if(MODO_DISENO){
    document.getElementById("amenaza_dev").addEventListener("click", function(){
        if(!estado) return;
        estado.amenaza.llegaEn = Date.now();
        estado.amenaza.atacandoHasta = 0;
        estado.amenaza.detenidoHasta = 0;
        actualizarAmenaza();
        guardarEstado();
    });

    document.getElementById("amenaza_dev_efecto").addEventListener("click", function(){
        if(!estado) return;
        const ef = EFECTOS_ATAQUE[rotacionEfecto % EFECTOS_ATAQUE.length];
        rotacionEfecto++;
        estado.amenaza.detenidoHasta = 0;
        estado.amenaza.efecto = ef.id;
        estado.amenaza.atacandoHasta = Date.now() + 60 * 1000;   // 1 minuto de prueba
        actualizarAmenaza();
        guardarEstado();
    });

    // detener el ataque en curso y reprogramar la próxima amenaza
    document.getElementById("amenaza_dev_parar").addEventListener("click", function(){
        if(!estado) return;
        quitarEfectoAtaque();
        estado.amenaza.atacandoHasta = 0;
        estado.amenaza.detenidoHasta = 0;
        Object.assign(estado.amenaza, nuevaAmenaza());
        actualizarAmenaza();
        guardarEstado();
    });
}else{
    document.getElementById("amenaza_dev_zona").style.display = "none";
}

/* ---------------------------------------------------------
   9. TUTORIAL EN VENTANA (botón ?)
   --------------------------------------------------------- */

const dialogTutorial  = document.getElementById("tutorial_dialog");
const dialogImagen    = document.getElementById("dialog_imagen");
const dialogTexto     = document.getElementById("dialog_texto");
const dialogPaso      = document.getElementById("dialog_paso");
const dialogAnterior  = document.getElementById("dialog_anterior");
const dialogSiguiente = document.getElementById("dialog_siguiente");

let indiceDialog = 0;
let dialogEnExtra = false;

function pasoDialogActual(){
    return dialogEnExtra
        ? PASOS_TUTORIAL.find(p => p.id === "extra")
        : PASOS_PRINCIPALES[indiceDialog];
}

function pintarDialogTutorial(){
    const paso = pasoDialogActual();

    dialogImagen.src = paso.imagen;
    dialogImagen.alt = "";
    dialogTexto.innerHTML = paso.html;

    dialogPaso.textContent = dialogEnExtra
        ? "información extra"
        : (indiceDialog + 1) + " / " + PASOS_PRINCIPALES.length;

    dialogAnterior.hidden = (!dialogEnExtra && indiceDialog === 0);

    const botonExtra = dialogTexto.querySelector("[data-extra]");
    if(botonExtra){
        botonExtra.addEventListener("click", () => {
            dialogEnExtra = true;
            pintarDialogTutorial();
        });
    }
}

function abrirTutorialDialog(){
    indiceDialog = 0;
    dialogEnExtra = false;
    pintarDialogTutorial();
    if(!dialogTutorial.open) dialogTutorial.showModal();
}

dialogSiguiente.addEventListener("click", function(){
    if(dialogEnExtra){
        dialogEnExtra = false;
        indiceDialog = PASOS_PRINCIPALES.findIndex(p => p.id === "5");
        pintarDialogTutorial();
        return;
    }
    if(indiceDialog < PASOS_PRINCIPALES.length - 1){
        indiceDialog++;
        pintarDialogTutorial();
    }else{
        dialogTutorial.close();
    }
});

dialogAnterior.addEventListener("click", function(){
    if(dialogEnExtra){
        dialogEnExtra = false;
        indiceDialog = PASOS_PRINCIPALES.findIndex(p => p.id === "4");
        pintarDialogTutorial();
        return;
    }
    if(indiceDialog > 0){
        indiceDialog--;
        pintarDialogTutorial();
    }
});

document.getElementById("dialog_saltar").addEventListener("click", () => dialogTutorial.close());

// el botón ? repite el tutorial guiado sobre la propia página.
// Poné TUTORIAL_CON_VENTANAS en true si alguna vez querés la versión en ventana.
document.getElementById("botontut").addEventListener("click", function(){
    if(TUTORIAL_CON_VENTANAS) abrirTutorialDialog();
    else                      iniciarTutorialVisual();
});

document.getElementById("botontut2").addEventListener("click", function(){
    document.getElementById("tutorial_agenda").showModal();
});

document.querySelectorAll(".boton_cerrar").forEach(boton => {
    boton.addEventListener("click", function(){
        const d = document.getElementById(boton.dataset.cerrar);
        if(d) d.close();
    });
});

/* ---------------------------------------------------------
   10. TUTORIAL VISUAL (primer ingreso)
   --------------------------------------------------------- */

const capaVisual      = document.getElementById("tutorial_visual");
const foco            = document.getElementById("foco");
const globo           = document.getElementById("globo_visual");
const visualTexto     = document.getElementById("visual_texto");
const visualPaso      = document.getElementById("visual_paso");
const visualAnterior  = document.getElementById("visual_anterior");
const visualSiguiente = document.getElementById("visual_siguiente");

let indiceVisual = 0;
let visualEnExtra = false;
let tutorialVisualActivo = false;

function iniciarTutorialVisual(){
    indiceVisual = 0;
    visualEnExtra = false;
    tutorialVisualActivo = true;
    capaVisual.hidden = false;
    pintarPasoVisual();
    window.addEventListener("resize", reubicarVisual);
    window.addEventListener("scroll", reubicarVisual, true);
}

function pasoVisualActual(){
    return visualEnExtra
        ? PASOS_TUTORIAL.find(p => p.id === "extra")
        : PASOS_PRINCIPALES[indiceVisual];
}

function pintarPasoVisual(){
    const paso = pasoVisualActual();

    visualTexto.innerHTML = paso.html;
    visualPaso.textContent = visualEnExtra
        ? "información extra"
        : (indiceVisual + 1) + " / " + PASOS_PRINCIPALES.length;

    visualAnterior.hidden = (!visualEnExtra && indiceVisual === 0);

    const botonExtra = visualTexto.querySelector("[data-extra]");
    if(botonExtra){
        botonExtra.addEventListener("click", () => {
            visualEnExtra = true;
            pintarPasoVisual();
        });
    }

    foco.classList.remove("entrando");
    void foco.offsetWidth;
    foco.classList.add("entrando");

    reubicarVisual();
}

function reubicarVisual(){
    if(!tutorialVisualActivo) return;

    const paso = pasoVisualActual();
    const objetivo = paso.selector ? document.querySelector(paso.selector) : null;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if(!objetivo){
        // paso sin elemento resaltado: globo grande al centro, pantalla oscurecida
        foco.classList.add("sin_foco");
        globo.classList.add("centrado");
        foco.style.top = (vh / 2) + "px";
        foco.style.left = (vw / 2) + "px";
        foco.style.width = "0px";
        foco.style.height = "0px";

        const g = globo.getBoundingClientRect();
        globo.style.top  = Math.max(12, (vh - g.height) / 2) + "px";
        globo.style.left = Math.max(12, (vw - g.width) / 2) + "px";
        return;
    }

    foco.classList.remove("sin_foco");
    globo.classList.remove("centrado");

    const r = objetivo.getBoundingClientRect();
    const margen = 10;
    const top    = Math.max(4, r.top - margen);
    const left   = Math.max(4, r.left - margen);
    const ancho  = Math.min(vw - left - 4, r.width + margen * 2);
    const alto   = Math.min(vh - top - 4, r.height + margen * 2);

    foco.style.top    = top + "px";
    foco.style.left   = left + "px";
    foco.style.width  = ancho + "px";
    foco.style.height = alto + "px";

    // el globo se ubica en el lado con más espacio libre
    const g = globo.getBoundingClientRect();
    const gw = g.width || 430;
    const gh = g.height || 300;
    const hueco = 16;

    let gLeft, gTop;

    const espacioDerecha = vw - (left + ancho);
    const espacioIzquierda = left;
    const espacioAbajo = vh - (top + alto);
    const espacioArriba = top;

    if(espacioDerecha >= gw + hueco){
        gLeft = left + ancho + hueco;
        gTop  = top + alto / 2 - gh / 2;
    }else if(espacioIzquierda >= gw + hueco){
        gLeft = left - gw - hueco;
        gTop  = top + alto / 2 - gh / 2;
    }else if(espacioAbajo >= gh + hueco){
        gLeft = left + ancho / 2 - gw / 2;
        gTop  = top + alto + hueco;
    }else if(espacioArriba >= gh + hueco){
        gLeft = left + ancho / 2 - gw / 2;
        gTop  = top - gh - hueco;
    }else{
        gLeft = (vw - gw) / 2;
        gTop  = (vh - gh) / 2;
    }

    globo.style.left = Math.round(Math.min(Math.max(12, gLeft), Math.max(12, vw - gw - 12))) + "px";
    globo.style.top  = Math.round(Math.min(Math.max(12, gTop),  Math.max(12, vh - gh - 12))) + "px";
}

visualSiguiente.addEventListener("click", function(){
    if(visualEnExtra){
        visualEnExtra = false;
        indiceVisual = PASOS_PRINCIPALES.findIndex(p => p.id === "5");
        pintarPasoVisual();
        return;
    }
    if(indiceVisual < PASOS_PRINCIPALES.length - 1){
        indiceVisual++;
        pintarPasoVisual();
    }else{
        cerrarTutorialVisual(true);
    }
});

visualAnterior.addEventListener("click", function(){
    if(visualEnExtra){
        visualEnExtra = false;
        indiceVisual = PASOS_PRINCIPALES.findIndex(p => p.id === "4");
        pintarPasoVisual();
        return;
    }
    if(indiceVisual > 0){
        indiceVisual--;
        pintarPasoVisual();
    }
});

document.getElementById("visual_saltar").addEventListener("click", () => cerrarTutorialVisual(true));

function cerrarTutorialVisual(terminado){
    tutorialVisualActivo = false;
    capaVisual.hidden = true;
    window.removeEventListener("resize", reubicarVisual);
    window.removeEventListener("scroll", reubicarVisual, true);

    if(!terminado || !estado) return;

    estado.tutorialVisto = true;
    guardarEstado();

    if(mascotaPendienteDeRevelar && !estado.mascotaRevelada){
        mascotaPendienteDeRevelar = false;
        revelarMascota();
    }
}

/* ---------------------------------------------------------
   11. VENTANA DE MASCOTA ASIGNADA (una sola vez)
   --------------------------------------------------------- */

const dialogRevelada = document.getElementById("mascota_revelada");

function revelarMascota(){
    const m = mascotaDelUsuario();
    document.getElementById("gif_revelada").src = m.gif;
    document.getElementById("gif_revelada").alt = m.nombre;
    document.getElementById("nombre_revelada").textContent = m.nombre;
    document.getElementById("texto_revelada").textContent =
        m.descripcion + ". Cuidala, alimentala con tus tareas realizadas y llevala al nivel más alto posible.";

    estado.mascotaRevelada = true;
    guardarEstado();
    dialogRevelada.showModal();
}

document.getElementById("boton_revelada").addEventListener("click", function(){
    dialogRevelada.close();
});

/* ---------------------------------------------------------
   12. VARIOS
   --------------------------------------------------------- */

window.addEventListener("beforeunload", guardarEstado);

document.addEventListener("keydown", function(e){
    if(e.key === "Escape") cerrarConfirms();
});
