/* ---------------------------------------------------- Menú FAB Móvil ------------------------------------------------ */

function setupMobileFab() {
    const fabContainer = document.querySelector('.fab-menu-container');
    const mainFabToggle = document.getElementById('mainFabToggle');

    if (!fabContainer || !mainFabToggle) return;

    // Abrir/Cerrar menú al tocar el botón principal (+)
    mainFabToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se cierre instantáneamente
        fabContainer.classList.toggle('open');
    });

    const fabLinks = fabContainer.querySelectorAll('.nav-fab-link');
    fabLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                fabContainer.classList.remove('open');
            }, 200);
        });
    });

    const themePill = fabContainer.querySelector('.theme-toggle-trigger');
    if (themePill) {
        themePill.addEventListener('click', () => {
            setTimeout(() => {
                fabContainer.classList.remove('open');
            }, 300);
        });
    }

    document.addEventListener('click', (e) => {
        if (!fabContainer.contains(e.target) && fabContainer.classList.contains('open')) {
            fabContainer.classList.remove('open');
        }
    });
}

// Inicializar cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    setupMobileFab();
});


/* ------------------------------------------------------------- Efecto Menú ------------------------------------------- */
const links = document.querySelectorAll(".nav__link");
const indicator = document.querySelector(".nav__indicator");

function moveIndicator(element) {
    const itemRect = element.getBoundingClientRect();
    const listRect = element.parentElement.parentElement.getBoundingClientRect();
    const leftPosition = itemRect.left - listRect.left;
    
    indicator.style.width = `${itemRect.width + 20}px`;
    indicator.style.left = `${leftPosition - 10}px`;
}

links.forEach((link) => {
    link.addEventListener("click", (e) => {
        const currentItem = link.parentElement; // El li correspondiente
        const allItems = document.querySelectorAll(".nav__item");
        let foundCurrent = false;

        // 1. Gestión de clases activas y movimiento de burbuja
        links.forEach(l => l.classList.remove("active-link"));
        link.classList.add("active-link");
        moveIndicator(link);

        // 2. Lógica de "Empuje" para los hermanos
        allItems.forEach((item) => {
            // Limpiamos animaciones previas para poder repetir el efecto
            item.classList.remove("push-left", "push-right");
            
            if (item === currentItem) {
                foundCurrent = true; // Encontramos el pulsado
                return;
            }

            // Forzamos un reflow para que la animación se reinicie si se pulsa rápido
            void item.offsetWidth; 

            if (!foundCurrent) {
                // Los que están antes del pulsado se empujan a la izquierda
                item.classList.add("push-left");
            } else {
                // Los que están después se empujan a la derecha
                item.classList.add("push-right");
            }
        });

        // Opcional: Limpiar las clases después de que termine la animación (0.5s)
        setTimeout(() => {
            allItems.forEach(item => item.classList.remove("push-left", "push-right"));
        }, 500);
    });
});

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    const activeLink = document.querySelector('.active-link') || links[0];
    if(activeLink) {
        activeLink.classList.add("active-link");
        moveIndicator(activeLink);
    }
});

/* ------------------------------------------------------------- Menú Desplegable (Cápsulas) ------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const fisioLink = document.getElementById('fisio-link');
    const fisioSubmenu = document.getElementById('fisio-submenu');

    if (fisioLink && fisioSubmenu) {
        fisioLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            fisioSubmenu.classList.toggle('active');
            
            links.forEach(l => l.classList.remove("active-link"));
            fisioLink.classList.add("active-link");
            if (typeof moveIndicator === "function") {
                moveIndicator(fisioLink);
            }
        });

        document.addEventListener('click', (e) => {
            if (!fisioLink.contains(e.target) && !fisioSubmenu.contains(e.target)) {
                fisioSubmenu.classList.remove('active');
            }
        });
        
        const capsules = fisioSubmenu.querySelectorAll('.capsule-item');
        capsules.forEach(capsule => {
            capsule.addEventListener('click', () => {
                fisioSubmenu.classList.remove('active');
            });
        });
    }
});

// 1. Datos Originales de Desarrollo
const GUTS_DATA = {
    anterior: {
        id: 'anterior',
        title: 'Intestino Anterior',
        color: 'bg-blue-500',
        colorHex: '#3b82f6',
        description: 'El intestino anterior se sitúa en la parte cefálica del embrión. Se extiende desde la membrana bucofaríngea hasta la evaginación del hígado.',
        derivatives: [
            'Faringe y glándulas relacionadas', 'Esófago', 'Tráquea y yemas pulmonares',
            'Estómago', 'Duodeno (proximal a la entrada del colédoco)', 'Hígado, páncreas y vías biliares'
        ],
        details: 'El estómago surge como una dilatación fusiforme en la cuarta semana. Su aspecto cambia por su crecimiento diferencial y la rotación que sufre: 90° en el eje longitudinal y también en el eje anteroposterior. El duodeno adopta su forma de "C" y se fija al retroperitoneo.'
    },
    medio: {
        id: 'medio',
        title: 'Intestino Medio',
        color: 'bg-yellow-500',
        colorHex: '#eab308',
        description: 'Comienza caudalmente con la yema hepática y se extiende hasta la unión de los dos tercios derechos y el tercio izquierdo del colon transverso.',
        derivatives: [
            'Duodeno (distal a la entrada del colédoco)', 'Yeyuno e Íleon', 'Ciego y apéndice',
            'Colon ascendente', 'Dos tercios proximales del colon transverso'
        ],
        details: 'Se caracteriza por un alargamiento rápido formando el asa intestinal primaria. Durante la 6ta semana, las asas se hernian hacia el cordón umbilical (hernia fisiológica). En la 10ma semana regresan a la cavidad abdominal. Durante este proceso, el asa gira un total de 270° en sentido antihorario alrededor de la arteria mesentérica superior.'
    },
    posterior: {
        id: 'posterior',
        title: 'Intestino Posterior',
        color: 'bg-green-500',
        colorHex: '#22c55e',
        description: 'Se extiende desde el tercio izquierdo del colon transverso hasta la membrana cloacal.',
        derivatives: [
            'Tercio distal del colon transverso', 'Colon descendente', 'Colon sigmoide',
            'Recto', 'Parte superior del conducto anal'
        ],
        details: 'La porción terminal del intestino posterior entra en la cloaca (futuro conducto anorrectal). El tabique urorrectal separa esta porción del seno urogenital. La membrana cloacal se rompe al final de la 7ma semana creando la abertura anal.'
    }
};

// 2. Datos de Malformaciones con Imágenes y Tipo de Modelo 3D
const MALFORMATIONS = [
    {
        region: 'Esófago',
        anomalies: [
            { name: 'Atresia Esofágica y Fístula Traqueoesofágica', description: 'Desviación posterior del tabique traqueoesofágico. Impide el paso normal del líquido amniótico (polihidramnios).', img: 'https://escolasalut.sjdhospitalbarcelona.org/sites/default/files/inline-images/atresia_esofago_atresia%20de%20esofago_ESP-06.jpg', modelType: 'atresia' }
        ]
    },
    {
        region: 'Estómago',
        anomalies: [
            { name: 'Estenosis Pilórica', description: 'Hipertrofia de la musculatura circular del píloro. Causa obstrucción y vómitos en proyectil. Ocurre a menudo días después del nacimiento.', img: 'https://cdn.lecturio.com/assets/Hypertrophic-pyloric-stenosis-1.png', modelType: 'estenosis_pilorica' }
        ]
    },
    {
        region: 'Hígado y Vías Biliares',
        anomalies: [
            { name: 'Atresia Biliar Extrahepática', description: 'Falta de recanalización de los conductos biliares. Requiere trasplante en la mayoría de los casos no corregibles.', img: 'https://www.stanfordchildrens.org/content-public/webmd/topic/images/90/494060.webp', modelType: 'atresia_biliar' }
        ]
    },
    {
        region: 'Páncreas',
        anomalies: [
            { name: 'Páncreas Anular', description: 'La yema pancreática ventral se divide y migra en direcciones opuestas, formando un anillo que rodea y puede obstruir el duodeno.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMwhBF29_Oyau2Bb9wVGjc-4AaIrLJlyMo-hln6TR3vvzS_gZv_fe8O38&s=10', modelType: 'pancreas_anular' }
        ]
    },
    {
        region: 'Intestino Medio',
        anomalies: [
            { name: 'Onfalocele', description: 'Falta de retorno de las asas intestinales tras la hernia fisiológica. Las vísceras están cubiertas por amnios.', img: 'https://cdn.lecturio.com/assets/Omphalocele-1.jpg', modelType: 'onfalocele' },
            { name: 'Gastrosquisis', description: 'Protrusión de contenidos abdominales a través de la pared corporal (generalmente derecha). No están cubiertos por amnios.', img: 'https://www.cdc.gov/birth-defects/media/images/gastroschisis_1.jpg?_=45913', modelType: 'gastrosquisis' },
            { name: 'Divertículo de Meckel (Ileal)', description: 'Persistencia de una pequeña porción del conducto vitelino formando un divertículo. Puede contener mucosa gástrica o pancreática heterotópica.', img: 'https://medlineplus.gov/spanish/ency/images/ency/fullsize/10270.jpg', modelType: 'diverticulo_meckel' },
            { name: 'Rotación Anómala / Vólvulo', description: 'El intestino gira de forma incompleta o inversa, pudiendo causar estrangulamiento e isquemia del intestino.', img: 'https://cdn.lecturio.com/assets/Ladds-procedure.png', modelType: 'volvulo_a' },
            { name: 'Atresias / Estenosis Intestinales', description: 'Falta de formación del tubo digestivo (atresia) o estrechamiento (estenosis), frecuentemente en duodeno e íleon, a menudo por accidentes vasculares o fallas en genes.', img: 'https://www.infogen.org.mx/wp-content/uploads/2023/07/Captura-de-pantalla-2016-07-20-a-las-7.33.48-p.m.png', modelType: 'atresia_intestinal' }
        ]
    },
    {
        region: 'Intestino Posterior',
        anomalies: [
            { name: 'Fístulas Urorrectales/Rectovaginales', description: 'Anomalías en la formación de la cloaca o tabique urorrectal.', img: 'https://cdn.lecturio.com/assets/Recto-bladder-neck-fistula.png', modelType: 'fistula_urorrectal' },
            { name: 'Ano Imperforado', description: 'Falta de ruptura de la membrana anal.', img: 'https://medlineplus.gov/spanish/ency/images/ency/fullsize/7135.jpg', modelType: 'ano_imperforado' },
            { name: 'Megacolon Congénito (Enfermedad de Hirschsprung)', description: 'Ausencia de ganglios parasimpáticos (células de la cresta neural) en la pared intestinal, impidiendo el peristaltismo.', img: 'https://nurseslabs.com/wp-content/uploads/2018/06/Aganglionic-Megacolon.jpg', modelType: 'megacolon' }
        ]
    }
];

// 3. Estado de la aplicación
let activeTab = 'anterior';
let viewMode = 'desarrollo';

// 4. Referencias al DOM
const contentDiv = document.getElementById('app-content');
const btnDesarrollo = document.getElementById('btn-desarrollo');
const btnMalformaciones = document.getElementById('btn-malformaciones');

const btnToggleEmbrio = document.getElementById('btn-toggle-embrio');
const btnPrevEmbrio = document.getElementById('btn-prev-embrio');
const btnNextEmbrio = document.getElementById('btn-next-embrio');

// 5. Funciones de Renderizado
function renderDesarrolloView() {
    const data = GUTS_DATA[activeTab];
    
    // Lista de derivados con bullets personalizados
    const derivativesHtml = data.derivatives.map(item => `
        <li class="flex items-start gap-3 text-slate-700 font-medium mb-3">
            <div class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style="background-color: ${data.colorHex}"></div>
            <span class="text-[1.05rem] leading-relaxed opacity-90">${item}</span>
        </li>
    `).join('');

    // Botones selectores estilo píldora glassmorphism
    const buttonsHtml = Object.values(GUTS_DATA).map(gut => {
        const isActive = activeTab === gut.id;
        return `
            <button onclick="setActiveTab('${gut.id}')" class="embrio-segment-btn ${isActive ? 'active' : ''}">
                <div class="flex items-center gap-4 w-full">
                    <div class="w-6 h-6 rounded-full shadow-sm" style="background-color: ${gut.colorHex}"></div>
                    <span class="font-bold text-lg ${isActive ? 'text-slate-800' : 'text-slate-500'}">${gut.title}</span>
                    <i data-lucide="chevron-right" class="w-5 h-5 ml-auto ${isActive ? 'text-slate-800' : 'text-slate-400'}"></i>
                </div>
            </button>
        `;
    }).join('');

    contentDiv.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in items-start mt-4">
            
            <!-- Columna Izquierda (Visualizador y Botones) -->
            <div class="lg:col-span-5 flex flex-col gap-8">
                
                <!-- Contenedor del Modelo 3D / Gráfico -->
                <div class="embrio-model-container">
                    <div class="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold z-10">
                        <span class="material-symbols-outlined text-[16px]">fullscreen</span>
                        Vista Frontal
                    </div>
                    
                    <div class="absolute inset-0 opacity-20 pointer-events-none pattern-grid"></div>
                    <div class="relative w-full h-full flex flex-col items-center justify-center space-y-1">
                        <!-- Anterior -->
                        <div class="transition-all duration-500 rounded-t-3xl w-24 flex flex-col items-center justify-start relative ${activeTab === 'anterior' ? 'bg-[#5b9cf6] h-32 scale-105 z-10 shadow-[0_0_30px_rgba(91,156,246,0.6)]' : 'bg-[#5b9cf6]/40 h-24 opacity-60'}">
                            <div class="text-[13px] font-bold text-white mt-4 absolute -right-28 flex items-center gap-2">
                                <div class="w-8 border-t border-white/50"></div> I. Anterior
                            </div>
                            <div class="w-6 h-6 rounded-full bg-[#f96b6b] absolute bottom-0 -right-3 shadow-lg transition-opacity ${activeTab === 'anterior' ? 'opacity-100' : 'opacity-0'}"></div>
                            <div class="w-12 h-14 rounded-full bg-[#9bc5ff] absolute top-6 -left-6 transform rotate-12 transition-opacity ${activeTab === 'anterior' ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>
                        <!-- Medio -->
                        <div class="transition-all duration-500 w-16 flex flex-col items-center justify-center relative ${activeTab === 'medio' ? 'bg-[#7c6352] h-20 scale-105 z-10 shadow-[0_0_20px_rgba(124,99,82,0.6)]' : 'bg-[#7c6352]/40 h-16 opacity-60'}">
                            <div class="text-[13px] font-bold text-white absolute -right-28 flex items-center gap-2">
                                <div class="w-8 border-t border-white/50"></div> I. Medio
                            </div>
                        </div>
                        <!-- Posterior -->
                        <div class="transition-all duration-500 rounded-b-3xl w-20 flex flex-col items-end justify-end relative ${activeTab === 'posterior' ? 'bg-[#3b8765] h-20 scale-105 z-10 shadow-[0_0_30px_rgba(59,135,101,0.6)]' : 'bg-[#3b8765]/40 h-14 opacity-60'}">
                            <div class="text-[13px] font-bold text-white mb-3 absolute -right-32 flex items-center gap-2">
                                <div class="w-8 border-t border-white/50"></div> I. Posterior
                            </div>
                            <div class="w-24 h-10 rounded-b-3xl bg-[#61b88e] absolute -bottom-2 -left-2 transition-opacity ${activeTab === 'posterior' ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>
                    </div>
                </div>

                <!-- Selector de Segmentos -->
                <div class="flex flex-col gap-4">
                    <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-2">Selecciona un segmento</h3>
                    ${buttonsHtml}
                </div>
            </div>

            <!-- Columna Derecha (Información del Segmento) -->
            <div class="lg:col-span-7 embrio-info-card">
                
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-5">
                        <div class="w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm border border-white/40" style="background-color: ${data.colorHex}20; color: ${data.colorHex}">
                            <span class="material-symbols-outlined text-[36px]">gastroenterology</span>
                        </div>
                        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">${data.title}</h2>
                    </div>
                    <button class="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center border border-white/60 hover:bg-white/70 transition-colors shadow-sm">
                        <span class="material-symbols-outlined text-slate-600">more_horiz</span>
                    </button>
                </div>

                <!-- Descripción General -->
                <p class="text-slate-600 text-[1.1rem] leading-relaxed mb-10 font-medium opacity-90">
                    ${data.description}
                </p>

                <!-- Derivados Principales -->
                <div class="mb-10">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-9 h-9 rounded-full bg-[#e8ecf8] flex items-center justify-center text-[#5b73d6]">
                            <i data-lucide="arrow-right" class="w-5 h-5"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-800">Derivados Principales</h3>
                    </div>
                    <ul class="flex flex-col ml-4">
                        ${derivativesHtml}
                    </ul>
                </div>

                <!-- Detalles del Desarrollo (Caja Flotante) -->
                <div class="embrio-details-box">
                    <div class="absolute -top-6 -left-6 w-12 h-12 rounded-[1.2rem] bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white">
                        <span class="material-symbols-outlined text-[24px]">lightbulb</span>
                    </div>
                    <h3 class="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3 ml-6">Detalles del Desarrollo</h3>
                    <p class="text-slate-600 text-[1.05rem] leading-relaxed font-medium opacity-90">
                        ${data.details}
                    </p>
                </div>

            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderMalformacionesView() {
    // Paleta de colores e iconos asignados a cada región
    const sectionStyles = [
        { icon: 'route', colorHex: '#ec4899' },            
        { icon: 'gastroenterology', colorHex: '#f59e0b' }, 
        { icon: 'hematology', colorHex: '#10b981' },       
        { icon: 'water_drop', colorHex: '#8b5cf6' },       
        { icon: 'all_inclusive', colorHex: '#3b82f6' },    
        { icon: 'airline_stops', colorHex: '#d946ef' }     
    ];

    const malformationsHtml = MALFORMATIONS.map((section, sIdx) => {
        // Si hay más secciones que estilos, se reciclan los colores
        const style = sectionStyles[sIdx] || sectionStyles[0];
        
        return `
        <div class="malf-card">
            <!-- Header de la tarjeta -->
            <div class="malf-card-header">
                <div class="flex items-center gap-4">
                    <div class="malf-icon-box" style="background-color: ${style.colorHex}20; color: ${style.colorHex}">
                        <span class="material-symbols-outlined text-[28px]">${style.icon}</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 tracking-tight">${section.region}</h3>
                </div>
                <div class="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-400 shadow-sm border border-white/40">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </div>
            </div>
            
            <!-- Cuerpo de la tarjeta (Lista de patologías) -->
            <div class="malf-card-body flex flex-col">
                ${section.anomalies.map((anomaly, aIdx) => `
                    <div class="malf-item group" onclick="openModal(${sIdx},${aIdx})">
                        <!-- Imagen miniatura -->
                        <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-white/60">
                            <img src="${anomaly.img}" alt="${anomaly.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                        </div>
                        
                        <!-- Información textual -->
                        <div class="flex-1 min-w-0 pr-2">
                            <h4 class="font-semibold text-[0.95rem] mb-1 truncate transition-colors" style="color: ${style.colorHex}">
                                ${anomaly.name}
                            </h4>
                            <p class="text-slate-500 text-[0.85rem] leading-snug line-clamp-2">
                                ${anomaly.description}
                            </p>
                        </div>
                        
                        <!-- Icono de acción al hacer hover -->
                        <div class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                            <i data-lucide="chevron-right" class="w-5 h-5" style="color: ${style.colorHex}"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }).join('');

    contentDiv.innerHTML = `
        <div class="space-y-6 animate-fade-in mt-4">
            
            <!-- Banner de Alerta Superior -->
            <div class="malf-alert-box">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner shrink-0">
                        <span class="material-symbols-outlined text-[18px]">radio_button_checked</span>
                    </div>
                    <p class="text-rose-800/80 text-[0.95rem] font-semibold tracking-wide">
                        Haz clic en cualquier patología para abrir el visor interactivo y el modelo 3D representativo.
                    </p>
                </div>
            </div>

            <!-- Grid a 2 columnas para las tarjetas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${malformationsHtml}
            </div>
            
        </div>
    `;
    
    lucide.createIcons();
}

let currentAnimationId = null;
let currentScene = null;
let currentRenderer = null;

window.openModal = function(sectionIdx, anomalyIdx) {
    const anomaly = MALFORMATIONS[sectionIdx].anomalies[anomalyIdx];
    
    document.getElementById('modal-title').innerText = anomaly.name;
    document.getElementById('modal-desc').innerText = anomaly.description;
    document.getElementById('modal-img').src = anomaly.img;
    
    const modal = document.getElementById('anomaly-modal');
    modal.classList.add('modal-active');
    setTimeout(() => modal.classList.add('modal-show'), 10);
    
    lucide.createIcons();
    init3DModel(anomaly.modelType);
};

window.closeModal = function() {
    const modal = document.getElementById('anomaly-modal');
    modal.classList.remove('modal-show');
    
    setTimeout(() => {
        modal.classList.remove('modal-active');
        if (currentAnimationId) cancelAnimationFrame(currentAnimationId);
        if (currentRenderer) {
            document.getElementById('canvas-container').removeChild(currentRenderer.domElement);
            currentRenderer.dispose();
            currentRenderer = null;
        }
    }, 300);
};

function init3DModel(type) {
    const container = document.getElementById('canvas-container');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b); 

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    currentRenderer = renderer;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Controles Orbitales (Interacción con el mouse)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Material representativo (Tono rosado/carnoso)
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xf43f5e, // rose-500
        shininess: 80,
        specular: 0x444444
    });

    // Construcción de modelos
    let mesh;
    
    if (type === 'atresia') {
        // Materiales diferenciados
        const matEsophagus = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Tubo digestivo)
            shininess: 80,
            specular: 0x444444
        });
        const matTrachea = new THREE.MeshPhongMaterial({ 
            color: 0x60a5fa, // blue-400 (Vía respiratoria)
            shininess: 50,
            transparent: true,
            opacity: 0.85
        });

        const group = new THREE.Group();

        // 1. Tráquea (Vía respiratoria central)
        const geoTrachea = new THREE.CylinderGeometry(0.8, 0.8, 9, 32);
        const trachea = new THREE.Mesh(geoTrachea, matTrachea);
        trachea.position.set(0, 0, 0);
        group.add(trachea);

        // 2. Esófago Proximal (Saco ciego / Atresia superior)
        const geoUpperEso = new THREE.CylinderGeometry(0.6, 0.6, 3.5, 32);
        const upperEso = new THREE.Mesh(geoUpperEso, matEsophagus);
        upperEso.position.set(-1.8, 2.5, 0);
        
        // Punta redondeada para cerrar el saco ciego superior
        const geoBlindEnd = new THREE.SphereGeometry(0.6, 32, 16);
        const blindEnd = new THREE.Mesh(geoBlindEnd, matEsophagus);
        blindEnd.position.set(-1.8, 0.75, 0); // Justo debajo del cilindro superior
        
        group.add(upperEso);
        group.add(blindEnd);

        // 3. Esófago Distal (Inferior)
        const geoLowerEso = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
        const lowerEso = new THREE.Mesh(geoLowerEso, matEsophagus);
        lowerEso.position.set(-1.8, -2.5, 0);

        // 4. Fístula Traqueoesofágica (Conexión diagonal)
        const geoFistula = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
        const fistula = new THREE.Mesh(geoFistula, matEsophagus);
        // Posicionada entre la tráquea inferior y el esófago distal
        fistula.position.set(-0.9, -1.2, 0);
        fistula.rotation.z = Math.PI / 3; // Inclinación para conectar ambos tubos

        group.add(lowerEso);
        group.add(fistula);

        // 5. Estómago (Contexto anatómico inferior)
        const geoStomach = new THREE.SphereGeometry(1.8, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matEsophagus);
        stomach.scale.set(1, 0.8, 0.6); // Escalar para dar forma de "J" o frijol
        stomach.position.set(-1.8, -4.5, 0);
        stomach.rotation.z = Math.PI / 6;

        group.add(stomach);

        // Ajuste de posición general para centrar el modelo en la cámara
        group.position.y = 0.5;
        group.scale.set(0.8, 0.8, 0.8);
        
        mesh = group;
        
    } else if (type === 'estenosis_pilorica') {
        // Materiales diferenciados: Estómago normal y píloro hipertrofiado (más oscuro/destacado)
        const matStomach = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500
            shininess: 80,
            specular: 0x444444
        });
        const matHypertrophy = new THREE.MeshPhongMaterial({ 
            color: 0xbe123c, // rose-700 (Músculo engrosado/hipertrofiado)
            shininess: 90,
            specular: 0x666666
        });

        const group = new THREE.Group();

        // 1. Cuerpo principal del estómago (Esfera achatada)
        const geoStomach = new THREE.SphereGeometry(2.5, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matStomach);
        stomach.scale.set(1.2, 1, 0.9);
        stomach.position.set(0, 0, 0);
        group.add(stomach);

        // 2. Esófago superior (Tubo de salida superior)
        const geoEso = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
        const esophagus = new THREE.Mesh(geoEso, matStomach);
        esophagus.position.set(-0.8, 3, 0);
        group.add(esophagus);

        // 3. Píloro Hipertrofiado (Anillo muscular engrosado característico)
        const geoPylorus = new THREE.TorusGeometry(0.8, 0.45, 16, 32);
        const pylorus = new THREE.Mesh(geoPylorus, matHypertrophy);
        pylorus.position.set(2.2, -1.2, 0);
        pylorus.rotation.z = Math.PI / 4;
        group.add(pylorus);

        // 4. Duodeno saliente (Tubo inferior conectado tras la obstrucción)
        const geoDuodenum = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 32);
        const duodenum = new THREE.Mesh(geoDuodenum, matStomach);
        duodenum.position.set(3.5, -2, 0);
        duodenum.rotation.z = Math.PI / 3;
        group.add(duodenum);

        // Ajuste general del grupo
        group.position.set(0, 0, 0);
        group.scale.set(0.9, 0.9, 0.9);
        
        mesh = group; 

    } else if (type === 'atresia_biliar') {
        // Materiales para los órganos principales
        const matLiver = new THREE.MeshPhongMaterial({ 
            color: 0x8b0000, // Rojo oscuro simulando tejido hepático
            shininess: 40,
            specular: 0x333333
        });
        const matStomach = new THREE.MeshPhongMaterial({ 
            color: 0xfbcfe8, // pink-200 claro
            shininess: 70 
        });
        const matIntestine = new THREE.MeshPhongMaterial({ 
            color: 0xfcb900, // Tono anaranjado para el duodeno
            shininess: 50 
        });
        
        // Material punteado para los conductos biliares ausentes/atrésicos
        const matMissingDucts = new THREE.LineDashedMaterial({
            color: 0xffffff,
            linewidth: 2,
            scale: 1,
            dashSize: 0.3,
            gapSize: 0.3,
            transparent: true,
            opacity: 0.7
        });

        const group = new THREE.Group();

        // 1. Hígado (Lóbulo masivo superior)
        const geoLiver = new THREE.SphereGeometry(3.5, 32, 32);
        const liver = new THREE.Mesh(geoLiver, matLiver);
        liver.scale.set(1.4, 0.6, 0.8); // Achatado y alargado
        liver.position.set(-1, 3.5, 0);
        liver.rotation.z = Math.PI / 12;
        group.add(liver);

        // 2. Estómago (Masa lateral derecha)
        const geoStomach = new THREE.SphereGeometry(2.2, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matStomach);
        stomach.scale.set(1.2, 0.8, 0.8);
        stomach.position.set(2.5, 0.5, 0);
        stomach.rotation.z = -Math.PI / 5;
        group.add(stomach);

        // 3. Duodeno / Intestino Delgado (Tubo inferior)
        class DuodenumCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Curva paramétrica para simular la forma de "C" y el descenso
                const x = -1 + Math.cos(t * Math.PI * 1.5) * 3;
                const y = -1 - t * 4;
                const z = Math.sin(t * Math.PI * 1.5) * 1.5;
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new DuodenumCurve();
        const geoIntestine = new THREE.TubeGeometry(path, 64, 0.7, 16, false);
        const intestine = new THREE.Mesh(geoIntestine, matIntestine);
        group.add(intestine);

        // 4. Conductos Biliares Ausentes (Representación punteada)
        const ductPoints = [];
        ductPoints.push(new THREE.Vector3(-1, 2.5, 0.5));    // Origen teórico en el hígado
        ductPoints.push(new THREE.Vector3(-0.5, 1, 0.8));    // Trayecto intermedio
        ductPoints.push(new THREE.Vector3(0.5, -0.5, 0.5));  // Punto de inserción fallido en el duodeno

        const geoDucts = new THREE.BufferGeometry().setFromPoints(ductPoints);
        const missingDucts = new THREE.Line(geoDucts, matMissingDucts);
        missingDucts.computeLineDistances(); // Obligatorio para que el patrón punteado se renderice
        group.add(missingDucts);

        // Ajustes finales del grupo en la escena
        group.position.set(0, 0, 0);
        group.scale.set(0.65, 0.65, 0.65);
        
        mesh = group;
    
    } else if (type === 'pancreas_anular') {
        // Materiales: Distinción clara entre el tracto digestivo y el tejido glandular
        const matDigestive = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Estómago y Duodeno)
            shininess: 60,
            specular: 0x444444
        });
        const matPancreas = new THREE.MeshPhongMaterial({ 
            color: 0xfcd34d, // amber-300 (Tejido pancreático)
            shininess: 30, // Menos brillo para simular textura glandular
            specular: 0x222222
        });

        const group = new THREE.Group();

        // 1. Estómago (Masa superior)
        const geoStomach = new THREE.SphereGeometry(2.2, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matDigestive);
        stomach.scale.set(1.2, 0.9, 0.7);
        stomach.position.set(0.5, 2.5, 0);
        stomach.rotation.z = -Math.PI / 8;
        group.add(stomach);

        // 2. Duodeno (Tubo descendente en forma de curva)
        class DuodenumCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Genera la clásica forma en "C" del duodeno
                const x = 0.5 + Math.sin(t * Math.PI * 1.5) * -1.8;
                const y = 1 - t * 5;
                const z = Math.sin(t * Math.PI) * 0.5; // Ligera curvatura hacia el frente
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new DuodenumCurve();
        const geoDuodenum = new THREE.TubeGeometry(path, 64, 0.5, 16, false);
        const duodenum = new THREE.Mesh(geoDuodenum, matDigestive);
        group.add(duodenum);

        // 3. Cuerpo principal del Páncreas (Porción normal)
        // Usamos una cápsula alargada que se ubica detrás del estómago
        const geoPancreasBody = new THREE.CylinderGeometry(0.7, 0.7, 3.5, 32);
        const pancreasBody = new THREE.Mesh(geoPancreasBody, matPancreas);
        pancreasBody.rotation.z = Math.PI / 2.2;
        pancreasBody.position.set(1.8, -0.2, -0.5); 
        group.add(pancreasBody);

        // 4. Porción Anular del Páncreas (El anillo obstructivo)
        const geoAnnular = new THREE.TorusGeometry(0.7, 0.35, 16, 32);
        const annularRing = new THREE.Mesh(geoAnnular, matPancreas);
        // Coordenadas calculadas para coincidir exactamente con el paso del tubo duodenal
        annularRing.position.set(-1.25, -0.5, 0.2);
        annularRing.rotation.x = Math.PI / 2.5; 
        annularRing.rotation.y = Math.PI / 8;
        group.add(annularRing);

        // Ajustes globales de posición y escala
        group.position.set(-0.5, 0, 0);
        group.scale.set(0.7, 0.7, 0.7);
        
        mesh = group;
    } else if (type === 'onfalocele') {
        const group = new THREE.Group();

        // Materiales
        const matSkin = new THREE.MeshPhongMaterial({ 
            color: 0xfcdcb2, // Tono piel base para la pared abdominal
            shininess: 10 
        });
        const matLiver = new THREE.MeshPhongMaterial({ 
            color: 0x8b0000, // Rojo oscuro para el hígado
            shininess: 30 
        });
        const matIntestine = new THREE.MeshPhongMaterial({ 
            color: 0xd97757, // Tono rosado/terracota para las asas intestinales
            shininess: 20 
        });
        const matCord = new THREE.MeshPhongMaterial({ 
            color: 0x9ca3af, // Gris azulado para el cordón umbilical
            shininess: 10 
        });
        
        // Material del Saco (Translúcido, similar al Liquid Glass de tu interfaz)
        const matSac = new THREE.MeshPhongMaterial({
            color: 0xe0f2fe, // sky-100 tint
            transparent: true,
            opacity: 0.35,
            shininess: 100,
            depthWrite: false // Crucial para permitir ver los órganos en su interior
        });

        // 1. Pared Abdominal (Superficie base curvada)
        const geoWall = new THREE.CylinderGeometry(5, 5, 8, 32, 1, false, 0, Math.PI);
        const wall = new THREE.Mesh(geoWall, matSkin);
        wall.rotation.z = Math.PI / 2;
        wall.position.z = -2; // Lo empujamos hacia atrás para que sea el fondo
        group.add(wall);

        // 2. Órganos Herniados: Hígado (Masa superior sólida)
        const geoLiver = new THREE.SphereGeometry(1.3, 32, 32);
        const liver = new THREE.Mesh(geoLiver, matLiver);
        liver.scale.set(1, 0.7, 0.6);
        liver.position.set(-0.6, 0.6, 0.5);
        liver.rotation.z = Math.PI / 4;
        group.add(liver);

        // 3. Órganos Herniados: Asas Intestinales (Tubo enrollado)
        const geoIntestine = new THREE.TorusKnotGeometry(0.8, 0.3, 64, 16);
        const intestine = new THREE.Mesh(geoIntestine, matIntestine);
        intestine.position.set(0.6, -0.3, 0.6);
        intestine.scale.set(0.9, 0.9, 0.9);
        group.add(intestine);

        // 4. Saco Amniótico (Cubierta protectora translúcida)
        const geoSac = new THREE.SphereGeometry(2.4, 32, 32);
        const sac = new THREE.Mesh(geoSac, matSac);
        sac.scale.set(1, 0.95, 0.8);
        sac.position.set(0, 0, 0.4);
        group.add(sac);

        // 5. Cordón Umbilical (Saliendo del ápice del saco)
        class CordCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = Math.sin(t * Math.PI) * 0.5;
                const y = t * 3.5;
                const z = 2.2 + Math.sin(t * Math.PI) * 0.5; 
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new CordCurve();
        const geoCord = new THREE.TubeGeometry(path, 32, 0.15, 8, false);
        const cord = new THREE.Mesh(geoCord, matCord);
        cord.rotation.z = -Math.PI / 4;
        cord.position.set(0, 0.5, 0);
        group.add(cord);

        // Ajustes globales de cámara para el grupo
        group.rotation.x = -Math.PI / 6; // Inclinación para apreciar mejor el volumen
        group.scale.set(0.8, 0.8, 0.8);
        
        mesh = group;
    } else if (type === 'gastrosquisis') {
        const group = new THREE.Group();

        // Materiales
        const matSkin = new THREE.MeshPhongMaterial({ 
            color: 0x8b5a2b, // Tono de piel ajustado al contraste de la imagen
            shininess: 10 
        });
        const matIntestine = new THREE.MeshPhongMaterial({ 
            color: 0x9f1239, // rose-800: Más oscuro y rojizo para simular inflamación por exposición
            shininess: 40,
            specular: 0x444444
        });
        const matCord = new THREE.MeshPhongMaterial({ 
            color: 0xfde047, // yellow-300: Tono más amarillento para el cordón sano
            shininess: 10 
        });

        // 1. Pared Abdominal (Superficie base)
        const geoWall = new THREE.CylinderGeometry(5, 5, 8, 32, 1, false, 0, Math.PI);
        const wall = new THREE.Mesh(geoWall, matSkin);
        wall.rotation.z = Math.PI / 2;
        wall.position.z = -2; // Fondo
        group.add(wall);

        // 2. Asas Intestinales Expuestas (Sin saco protector)
        // Usamos un TorusKnot con parámetros (p=3, q=4) para crear un enredo más complejo y voluminoso
        const geoIntestine = new THREE.TorusKnotGeometry(1.3, 0.45, 120, 20, 3, 4);
        const intestine = new THREE.Mesh(geoIntestine, matIntestine);
        // Posicionado a la derecha del ombligo (anatómico) y extruido hacia el frente
        intestine.position.set(1.2, -0.5, 0.8);
        group.add(intestine);

        // 3. Cordón Umbilical (Intacto, desplazado a la izquierda del defecto)
        class CordCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = -1.2 + Math.sin(t * Math.PI) * 0.3; // Origen desplazado a la izquierda
                const y = t * 3.5;
                const z = Math.sin(t * Math.PI) * 0.5; 
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new CordCurve();
        const geoCord = new THREE.TubeGeometry(path, 32, 0.15, 8, false);
        const cord = new THREE.Mesh(geoCord, matCord);
        cord.rotation.z = -Math.PI / 12;
        group.add(cord);

        // 4. Base del cordón (Simulación visual del anillo umbilical normal a un lado)
        const geoUmbo = new THREE.TorusGeometry(0.25, 0.1, 16, 32);
        const umbo = new THREE.Mesh(geoUmbo, matSkin);
        umbo.position.set(-1.1, 0.2, 0.1);
        umbo.rotation.x = Math.PI / 2;
        group.add(umbo);

        // Ajustes globales de cámara para el grupo
        group.rotation.x = -Math.PI / 6; 
        group.scale.set(0.8, 0.8, 0.8);
        
        mesh = group;
    } else if (type === 'diverticulo_meckel') {
        const group = new THREE.Group();

        // Materiales
        const matIntestine = new THREE.MeshPhongMaterial({ 
            color: 0xcd5c5c, // Tono rojizo orgánico para el intestino principal
            shininess: 30,
            specular: 0x333333
        });
        const matDiverticulum = new THREE.MeshPhongMaterial({ 
            color: 0xffb6c1, // Rosado pálido para destacar la anomalía (como en la imagen)
            shininess: 40,
            specular: 0x555555
        });
        const matBackground = new THREE.MeshPhongMaterial({
            color: 0x8f4a4a, // Tono más oscuro y desaturado para el fondo
            shininess: 10,
            transparent: true,
            opacity: 0.4 // Efecto de profundidad
        });

        // 1. Asa intestinal principal (Segmento del íleon)
        class IleumCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Curva suave para simular un segmento intestinal en primer plano
                const x = (t - 0.5) * 7; 
                const y = Math.sin(t * Math.PI) * 1.5; 
                const z = Math.sin(t * Math.PI * 2) * 0.5;
                return optionalTarget.set(x, y, z);
            }
        }
        const path = new IleumCurve();
        const geoIntestine = new THREE.TubeGeometry(path, 64, 0.7, 32, false);
        const intestine = new THREE.Mesh(geoIntestine, matIntestine);
        group.add(intestine);

        // 2. Divertículo de Meckel (El saco sobresaliente)
        // Lo posicionamos en la cresta de la curva del tubo (aproximadamente en x=0, y=1.5)
        const geoDiverticulum = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
        const diverticulum = new THREE.Mesh(geoDiverticulum, matDiverticulum);
        diverticulum.position.set(0, 1.8, 0.4); 
        diverticulum.rotation.x = Math.PI / 4;  
        diverticulum.rotation.z = -Math.PI / 8;
        group.add(diverticulum);

        // 3. Asas intestinales de contexto (Fondo desenfocado/transparente)
        const geoBg = new THREE.TorusKnotGeometry(2, 0.6, 64, 16, 2, 3);
        const bgIntestines = new THREE.Mesh(geoBg, matBackground);
        bgIntestines.position.set(0, -1, -2.5); // Desplazado hacia atrás
        group.add(bgIntestines);

        // Ajustes globales de cámara para el grupo
        group.scale.set(0.7, 0.7, 0.7);
        group.position.set(0, -0.5, 0);

        mesh = group;
    } else if (type === 'volvulo_a') {
        const group = new THREE.Group();

        // Materiales
        const matIntestine = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Tejido sano)
            shininess: 40,
            specular: 0x333333
        });
        const matIschemia = new THREE.MeshPhongMaterial({ 
            color: 0x831843, // rose-900 (Tono oscuro/purpúreo para simular isquemia por estrangulamiento)
            shininess: 20,
            specular: 0x111111
        });

        // 1. Estómago (Masa superior de referencia)
        const geoStomach = new THREE.SphereGeometry(1.8, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matIntestine);
        stomach.scale.set(1.2, 0.9, 0.7);
        stomach.position.set(0, 2.5, 0);
        stomach.rotation.z = -Math.PI / 6;
        group.add(stomach);

        // 2. El Vólvulo (Nudo intestinal central / Estrangulamiento)
        // Utilizamos un TorusKnot denso (p=2, q=5) para simular la torsión sobre el eje
        const geoTwist = new THREE.TorusKnotGeometry(0.7, 0.35, 128, 32, 2, 5);
        const twist = new THREE.Mesh(geoTwist, matIschemia); 
        twist.position.set(0, 0.5, 0.2);
        twist.rotation.x = Math.PI / 4;
        group.add(twist);

        // 3. Asas Intestinales Inferiores (Congestionadas)
        const geoBowels = new THREE.TorusKnotGeometry(1.6, 0.4, 128, 24, 3, 4);
        const bowels = new THREE.Mesh(geoBowels, matIntestine);
        bowels.position.set(0.2, -1.8, 0);
        group.add(bowels);

        // Ajustes globales de cámara para el grupo
        group.scale.set(0.75, 0.75, 0.75);
        group.position.set(0, -0.5, 0);

        mesh = group;
    } else if (type === 'atresia_intestinal') {
        const group = new THREE.Group();

        // Materiales
        const matStomach = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Estómago de referencia)
            shininess: 40 
        });
        const matDilated = new THREE.MeshPhongMaterial({ 
            color: 0xe11d48, // rose-600 (Intestino proximal, más oscuro e inflamado)
            shininess: 30 
        });
        const matAtrophic = new THREE.MeshPhongMaterial({ 
            color: 0xfca5a5, // red-300 (Intestino distal, más pálido y atrófico)
            shininess: 20 
        });
        const matFibrous = new THREE.LineDashedMaterial({ 
            color: 0xffffff, 
            dashSize: 0.2, 
            gapSize: 0.2, 
            transparent: true, 
            opacity: 0.6 
        });

        // 1. Estómago (Punto de referencia superior)
        const geoStomach = new THREE.SphereGeometry(1.6, 32, 32);
        const stomach = new THREE.Mesh(geoStomach, matStomach);
        stomach.scale.set(1.2, 0.8, 0.7);
        stomach.position.set(-0.5, 2.5, 0);
        stomach.rotation.z = -Math.PI / 6;
        group.add(stomach);

        // 2. Segmento Proximal (Dilatado y obstruido)
        class ProximalCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = 0.5 + Math.sin(t * Math.PI) * 1.5;
                const y = 1.5 - t * 2.5;
                const z = Math.cos(t * Math.PI) * 0.5;
                return optionalTarget.set(x, y, z);
            }
        }
        const pathProx = new ProximalCurve();
        const geoProx = new THREE.TubeGeometry(pathProx, 32, 0.65, 16, false); // Radio ancho
        const proxIntestine = new THREE.Mesh(geoProx, matDilated);
        group.add(proxIntestine);

        // Cierre del saco ciego proximal
        const endPointProx = pathProx.getPoint(1);
        const capProx = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), matDilated);
        capProx.position.copy(endPointProx);
        group.add(capProx);

        // 3. Segmento Distal (Atrófico y vacío)
        class DistalCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = 0.5 + Math.sin(t * Math.PI) * -1;
                const y = -1.8 - t * 2; // Inicia con una clara separación en el eje Y
                const z = Math.cos(t * Math.PI) * 0.2;
                return optionalTarget.set(x, y, z);
            }
        }
        const pathDist = new DistalCurve();
        const geoDist = new THREE.TubeGeometry(pathDist, 32, 0.25, 16, false); // Radio muy delgado
        const distIntestine = new THREE.Mesh(geoDist, matAtrophic);
        group.add(distIntestine);

        // Cierre del saco ciego distal
        const startPointDist = pathDist.getPoint(0);
        const capDist = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), matAtrophic);
        capDist.position.copy(startPointDist);
        group.add(capDist);

        // 4. Cordón fibroso (Conectando ambos sacos ciegos)
        const fibPoints = [endPointProx, startPointDist];
        const geoFib = new THREE.BufferGeometry().setFromPoints(fibPoints);
        const fibrous = new THREE.Line(geoFib, matFibrous);
        fibrous.computeLineDistances();
        group.add(fibrous);

        // Ajustes globales de cámara
        group.scale.set(0.75, 0.75, 0.75);
        group.position.set(0, -0.2, 0);

        mesh = group;
    } else if (type === 'fistula_urorrectal') {
        const group = new THREE.Group();

        // Materiales contrastantes para diferenciar los sistemas
        const matDigestive = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Recto y tejido digestivo)
            shininess: 40 
        });
        const matUrinary = new THREE.MeshPhongMaterial({ 
            color: 0x38bdf8, // sky-400 (Vejiga y uretra)
            shininess: 60,
            transparent: true,
            opacity: 0.85 // Ligera transparencia para simular las vías urinarias
        });

        // 1. Vejiga (Sistema urinario anterior)
        const geoBladder = new THREE.SphereGeometry(1.6, 32, 32);
        const bladder = new THREE.Mesh(geoBladder, matUrinary);
        bladder.position.set(1.5, 1, 0); // Desplazada hacia la parte anterior (derecha)
        bladder.scale.set(1, 0.9, 1);
        group.add(bladder);

        // 2. Uretra (Tubo de salida urinario)
        const geoUrethra = new THREE.CylinderGeometry(0.3, 0.3, 4, 32);
        const urethra = new THREE.Mesh(geoUrethra, matUrinary);
        urethra.position.set(1.5, -1.5, 0);
        group.add(urethra);

        // 3. Recto (Sistema digestivo posterior, terminado en saco ciego) - Sustituido por cilindro compatible
        const geoRectum = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32);
        const rectum = new THREE.Mesh(geoRectum, matDigestive);
        rectum.position.set(-1, 1.2, 0); // Desplazado hacia la parte posterior (izquierda)
        group.add(rectum);

        // 4. Fístula Urorrectal (El conducto anómalo que los une)
        const geoFistula = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32);
        const fistula = new THREE.Mesh(geoFistula, matDigestive);
        // Posicionada e inclinada para puentear el fondo del recto con la uretra
        fistula.position.set(0.25, -0.5, 0);
        fistula.rotation.z = -Math.PI / 4; 
        group.add(fistula);

        // Ajustes globales de cámara para encuadrar ambos sistemas
        group.scale.set(0.75, 0.75, 0.75);
        group.position.set(-0.2, 0, 0);

        mesh = group;
    } else if (type === 'ano_imperforado') {
        const group = new THREE.Group();

        // Materiales
        const matDigestive = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Tejido digestivo del recto)
            shininess: 40,
            specular: 0x333333
        });
        const matMuscle = new THREE.MeshPhongMaterial({ 
            color: 0xbe123c, // rose-700 (Complejo muscular/esfinteriano)
            shininess: 20 
        });
        const matSkin = new THREE.MeshPhongMaterial({ 
            color: 0xfcdcb2, // Tono de piel para el perineo
            shininess: 10 
        });

        // 1. Recto terminando en saco ciego - Sustituido por cilindro compatible r128
        const geoRectum = new THREE.CylinderGeometry(1, 1, 3.5, 32);
        const rectum = new THREE.Mesh(geoRectum, matDigestive);
        rectum.position.set(0, 1.5, 0); 
        group.add(rectum);

        // 2. Complejo muscular (Esfínter subdesarrollado o sin atravesar)
        const geoMuscle = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
        const muscle = new THREE.Mesh(geoMuscle, matMuscle);
        muscle.position.set(0, -0.6, 0);
        muscle.rotation.x = Math.PI / 2;
        group.add(muscle);

        // 3. Piel del perineo (Barrera sólida sin perforación)
        const geoSkin = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 32);
        const skin = new THREE.Mesh(geoSkin, matSkin);
        skin.position.set(0, -1.2, 0);
        group.add(skin);

        // Ajustes globales de cámara para el grupo
        group.scale.set(0.8, 0.8, 0.8);
        group.position.set(0, 0, 0);
        // Ligera inclinación para apreciar el saco ciego y la barrera inferior
        group.rotation.x = Math.PI / 12;

        mesh = group;
    } else if (type === 'megacolon') {
        const group = new THREE.Group();

        // Materiales
        const matSwollen = new THREE.MeshPhongMaterial({ 
            color: 0xf43f5e, // rose-500 (Colon sano pero masivamente dilatado)
            shininess: 30,
            specular: 0x222222
        });
        const matNarrow = new THREE.MeshPhongMaterial({ 
            color: 0x9f1239, // rose-800 (Segmento agangliónico: más oscuro y rígido)
            shininess: 10 
        });

        // 1. Segmento Proximal Dilatado (Megacolon)
        class SwollenCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Curva descendente simulando el colon descendente y sigmoide superior
                const x = -1.5 + Math.sin(t * Math.PI * 0.5) * 1.5;
                const y = 2 - t * 3;
                const z = Math.cos(t * Math.PI * 0.5) * 0.5;
                return optionalTarget.set(x, y, z);
            }
        }
        const pathSwollen = new SwollenCurve();
        // Radio ancho (0.9) para evidenciar la acumulación
        const geoSwollen = new THREE.TubeGeometry(pathSwollen, 64, 0.9, 16, false);
        const swollenColon = new THREE.Mesh(geoSwollen, matSwollen);
        group.add(swollenColon);

        // Añadir "Haustras" (Abultamientos anatómicos exagerados por la dilatación)
        for(let i = 0.1; i < 0.9; i += 0.15) {
            const pt = pathSwollen.getPoint(i);
            const haustra = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), matSwollen);
            haustra.position.copy(pt);
            group.add(haustra);
        }

        // 2. Segmento Distal Agangliónico (Estrecho)
        class NarrowCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Continúa desde el cuello de botella hacia el recto
                const x = Math.sin(t * Math.PI) * 0.3;
                const y = -1.0 - t * 2.5;
                const z = -t * 0.3;
                return optionalTarget.set(x, y, z);
            }
        }
        const pathNarrow = new NarrowCurve();
        // Radio muy delgado (0.25) ilustrando la constricción
        const geoNarrow = new THREE.TubeGeometry(pathNarrow, 32, 0.25, 16, false);
        const narrowColon = new THREE.Mesh(geoNarrow, matNarrow);
        group.add(narrowColon);

        // 3. Zona de Transición (Cuello de botella en forma de embudo)
        const geoTransition = new THREE.CylinderGeometry(0.9, 0.25, 0.6, 16);
        const transition = new THREE.Mesh(geoTransition, matSwollen);
        transition.position.set(0, -1.0, 0);
        transition.rotation.z = -Math.PI / 8; // Inclinación para suavizar la unión
        group.add(transition);

        // Ajustes globales de cámara para el grupo
        group.scale.set(0.7, 0.7, 0.7);
        group.position.set(0, 0.5, 0);

        mesh = group;
    } else {
        // Genérico: Tubo curvado
        class CustomCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.sin(t * Math.PI * 2) * 2;
                const ty = Math.cos(t * Math.PI * 2) * 2;
                const tz = t * 4 - 2;
                return optionalTarget.set(tx, ty, tz);
            }
        }
        const path = new CustomCurve();
        const geometry = new THREE.TubeGeometry(path, 64, 1, 16, false);
        mesh = new THREE.Mesh(geometry, material);
    }

    scene.add(mesh);

    // Animación y Render Loop
    function animate() {
        currentAnimationId = requestAnimationFrame(animate);
        
        if(mesh.rotation) {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.005;
        } else if (mesh.children) {
            mesh.rotation.y += 0.005;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();

    // Redimensionamiento dinámico
    window.addEventListener('resize', () => {
        if(currentRenderer && container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            currentRenderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// 7. Manejo de la Navegación y Eventos
function updateNavUI() {
    if (!btnToggleEmbrio) return;

    if (viewMode === 'desarrollo') {
        btnToggleEmbrio.innerHTML = '<span class="material-symbols-outlined text-[24px]">menu_book</span> Desarrollo Embrionario';
        btnToggleEmbrio.className = "flex-1 py-4 rounded-full bg-[var(--card-blue-color)] text-[var(--black-color)] font-semibold text-lg md:text-xl hover:scale-[1.02] transition-all shadow-sm duration-500 flex items-center justify-center gap-2";
        renderDesarrolloView();
    } else {
        btnToggleEmbrio.innerHTML = '<span class="material-symbols-outlined text-[24px]">warning</span> Malformaciones Clínicas';
        btnToggleEmbrio.className = "flex-1 py-4 rounded-full bg-[var(--card-pick-color)] text-[var(--black-color)] font-semibold text-lg md:text-xl hover:scale-[1.02] transition-all shadow-sm duration-500 flex items-center justify-center gap-2";
        renderMalformacionesView();
    }
}

window.setActiveTab = function(tabId) {
    activeTab = tabId;
    if (viewMode === 'desarrollo') renderDesarrolloView();
};

function toggleEmbrioView() {
    viewMode = (viewMode === 'desarrollo') ? 'malformaciones' : 'desarrollo';
    updateNavUI();
}

// Asignación de eventos a los tres botones de la nueva barra
if (btnToggleEmbrio && btnPrevEmbrio && btnNextEmbrio) {
    btnToggleEmbrio.addEventListener('click', toggleEmbrioView);
    btnPrevEmbrio.addEventListener('click', toggleEmbrioView);
    btnNextEmbrio.addEventListener('click', toggleEmbrioView);
}

// 8. Inicialización
updateNavUI();
lucide.createIcons();

/* ---------------------------------------------------- Efecto Parallax en el Hero Banner ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-banner');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (heroSection && parallaxLayers.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1025) return;

            const x = e.clientX;
            const y = e.clientY;
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                
                const moveX = (x - centerX) * speed;
                const moveY = (y - centerY) * speed;
                
                layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            parallaxLayers.forEach(layer => {
                layer.style.transform = `translate(0px, 0px)`;
                layer.style.transition = `transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)`;
            });
        });

        heroSection.addEventListener('mouseenter', () => {
            parallaxLayers.forEach(layer => {
                layer.style.transition = 'none';
            });
        });
    }
});

/* ---------------------------------------------------- Modal de Anatomía Dinámico ------------------------------------------------ */

// 1. Base de datos de Anatomía
const ANATOMY_DATA = {
    lengua: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQmedkAMVXCPBDPQI8bvyRHjLJ-pfriFG5sjfKINeZrI3kTzLtThJB6yfNjwEwhDiMMFJBbEXDidImnpThWtqEJzKQZLmWIv1TmNjwg5k6yJgbAed5W-tlqHTkSHxfCChrcRqP1SWwWf1Ncg38rYkX2OjhT1UGyqO6CrdrVmB8PjVbnMjUhV6DY_0faBM/w458-h354/ChatGPT%20Image%205%20sept%202026,%2015_43_20.png", 
        terms: [
            "<strong>Raíz:</strong> Porción <strong>posterior</strong>. Funciones: <strong>deglución, masticación, gusto y lenguaje</strong>. Conexión: <strong>hioides, mandíbula, apófisis estiloides, faringe y paladar</strong>.",
            "<strong>Cuerpo:</strong> Porción <strong>media</strong>. Funciones: <strong>deglución, masticación, gusto y lenguaje</strong>.",
            "<strong>Epiglotis:</strong> Conectada a la raíz por <strong>pliegues glosoepiglóticos</strong>. Función: <strong>sostener</strong> la epiglotis a la lengua.",
            "<strong>Agujero ciego:</strong> <strong>Depresión central</strong> donde converge el surco terminal.",
            "<strong>Surco terminal:</strong> Hendidura en <strong>\"V\"</strong>. Función: <strong>separar la raíz del cuerpo</strong>.",
            "<strong>Papilas circunvaladas:</strong> Alineadas <strong>delante del surco terminal</strong>. Función: <strong>gustativa</strong>.",
            "<strong>Papilas foliadas:</strong> En los <strong>márgenes laterales</strong>. Función: <strong>gustativa</strong>.",
            "<strong>Papilas filiformes:</strong> Distribuidas en la región <strong>anterior</strong>. Función: <strong>gustativa</strong>.",
            "<strong>Papilas fungiformes:</strong> Dispersas en el <strong>dorso</strong>. Función: <strong>gustativa</strong>.",
            "<strong>Surco de la línea media:</strong> <strong>Hendidura longitudinal</strong> en el centro del cuerpo.",
            "<strong>Dorso de la lengua:</strong> Superficie <strong>superior expuesta</strong>. Base para papilas y la <strong>tonsila lingual</strong> (cuya función es <strong>linfoidea</strong>).",
            "<strong>Músculos intrínsecos</strong> (Longitudinal superior/inferior, Vertical, Transverso): 4 músculos divididos por un <strong>septum central</strong>. Función: modificar <strong>forma y tamaño</strong>. Inervación/Conexión: <strong>nervio hipogloso (XII)</strong>."
        ]
    },
    craneo: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYQyOkGecVscqDyK4B-OOcoRGHoGLcW6cEHNr2-KoF0e8kiRutDJ1U9CC0NjtBAoqAbpZTomYvG_H_MgvU0TQ4KdtXqmh84ojlj3SSuOBtkmqAg2fzfr_VFYpmTesSpQYMR2ZDeMcw9m4NNr9MiqRc7O-fK6rCcKUZyfHX7XZH7K29tXoq4s0BDLm-iE4/w419-h526/Gemini_Generated_Image_5sgarp5sgarp5sga.jpg",
        terms: [
            "<strong>Hueso frontal:</strong> Presenta estructuras anatómicas como la <strong>glabela</strong>, la <strong>escotadura (agujero) supraorbitaria</strong> y la <strong>cara orbitaria</strong>. Articula en su parte posterior con el hueso parietal a través de la <strong>sutura coronal</strong>.",
            "<strong>Hueso etmoides:</strong> Contiene la <strong>lámina orbitaria</strong>, la <strong>lámina perpendicular</strong> y la <strong>concha nasal media</strong>. Sus agujeros etmoidales anterior y posterior se relacionan con la órbita.",
            "<strong>Hueso esfenoides:</strong> Presenta un <strong>ala menor</strong> y un <strong>ala mayor</strong>, además de la <strong>apófisis pterigoides</strong> (con sus láminas medial, lateral y gancho). Contiene orificios importantes como el <strong>agujero oval</strong> y el <strong>agujero espinoso</strong>.",
            "<strong>Hueso parietal:</strong> Se ubica en la parte superior y lateral del cráneo, uniéndose anatómicamente al hueso frontal mediante la <strong>sutura coronal</strong>.",
            "<strong>Hueso temporal:</strong> Posee la <strong>apófisis cigomática</strong>, <strong>apófisis estiloides</strong>, <strong>apófisis mastoides</strong> y el <strong>conducto auditivo externo</strong>. Contiene la <strong>fosa mandibular</strong> y el <strong>tubérculo articular</strong>, fundamentales para formar la <strong>articulación temporomandibular</strong> con la mandíbula.",
            "<strong>Hueso occipital:</strong> El documento lo muestra brevemente en su porción inferior, señalando el <strong>surco occipital</strong> (destinado a la arteria occipital).",
            "<strong>Huesos nasales:</strong> Se esquematizan articulando medialmente con el <strong>maxilar</strong> y superiormente con el <strong>hueso frontal</strong> para formar la estructura de la nariz.",
            "<strong>Huesos lagrimales:</strong> Se ubican en la cara medial de la órbita, donde presentan la <strong>fosa del saco lagrimal</strong>. Articulan con la cara orbitaria del maxilar y la lámina orbitaria del etmoides.",
            "<strong>Huesos palatinos:</strong> Cuentan con una <strong>lámina horizontal</strong>, <strong>agujeros palatinos</strong> (mayor y menores) y una <strong>apófisis piramidal</strong>. Se unen a la apófisis palatina del maxilar mediante la <strong>sutura palatina transversa</strong> para formar el techo de la boca o <strong>paladar duro</strong>.",
            "<strong>Huesos cigomáticos:</strong> Presentan la <strong>apófisis frontal</strong>, la <strong>apófisis temporal</strong>, la <strong>cara orbitaria</strong> y el <strong>agujero cigomaticofacial</strong>. Articulan directamente con la <strong>apófisis cigomática (o malar)</strong> del maxilar.",
            "<strong>Sutura coronal:</strong> Es la línea de unión anatómica visible entre el <strong>hueso frontal</strong> y el <strong>hueso parietal</strong>."
        ]
    },
    cara: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjFSuE486ptpz23qenUqT1a2TxJK2wzXkap5EgmXuc8e5R3xQe9xycBs8ZNAbP8t5Fdm8z8D4TmZXJFfOHXtQsfrWF3MgLLmn7dUcrvc57_4i0UaZgy-DLsX_9VcHpG8QInPR0ypXq2G4PylVWggHKQLb5qC3-baHMz46sF1vApH8wy9yIh_IaV7AC5ZMk/w463-h399/Gemini_Generated_Image_xm1ij3xm1ij3xm1i.jpg",
        terms: [
            "<strong>Músculo buccinador:</strong> Origen: <strong>Procesos alveolares</strong> (maxilar/mandibular) y <strong>rafe pterigomandibular</strong>. Inserción: Fibras del <strong>orbicular de la boca</strong>. Función: Mantiene el <strong>tono muscular</strong> de la mejilla. Inervación: <strong>Nervio Facial</strong>.",
            "<strong>Músculo orbicular de los labios:</strong> Origen: Ambas <strong>comisuras labiales</strong>. Inserción: <strong>Piel</strong> de ambos labios. Función: <strong>Cierra la cavidad</strong>, mueve y <strong>frunce los labios</strong>.",
            "<strong>Músculo elevador del labio superior y del ala de la nariz:</strong> Origen: <strong>Maxilar superior</strong>. Inserción: <strong>Ala nasal y labio superior</strong>. Función: <strong>Eleva</strong> ambas estructuras.",
            "<strong>Músculo elevador propio del labio superior:</strong> Origen: <strong>Maxilar superior</strong>. Inserción: <strong>Labio superior</strong>. Función: <strong>Eleva</strong> el labio superior.",
            "<strong>Músculo elevador del ángulo de la boca:</strong> Origen: <strong>Fosa canina</strong> del maxilar superior. Inserción: <strong>Ángulo de la boca</strong>. Función: <strong>Eleva la comisura labial</strong> de forma transversal.",
            "<strong>Músculo risorio:</strong> Origen: Tejido celular de la <strong>región parotídea</strong>. Inserción: <strong>Ángulo de la boca</strong> y labio superior. Función: <strong>Retrae la comisura</strong> labial y ayuda en la <strong>sonrisa</strong>.",
            "<strong>Músculo cigomático mayor:</strong> Origen: Hueso <strong>cigomático</strong>. Inserción: <strong>Ángulo de la boca</strong> y labio superior. Función: Retrae <strong>hacia arriba y hacia fuera</strong> la comisura labial.",
            "<strong>Músculo cigomático menor:</strong> Origen: Hueso <strong>cigomático</strong>. Inserción: <strong>Ángulo de la boca</strong> y labio superior. Función: Retrae <strong>hacia arriba y hacia fuera</strong> la comisura labial.",
            "<strong>Músculo mentoniano:</strong> Origen: <strong>Mandíbula</strong>. Inserción: <strong>Tejido subcutáneo</strong> del mentón. Función: <strong>Incierta</strong>.",
            "<strong>Músculo depresor del labio inferior:</strong> Origen: <strong>Mandíbula</strong>. Inserción: <strong>Labio inferior</strong>. Función: <strong>Desciende la comisura</strong> labial.",
            "<strong>Músculo depresor del ángulo de la boca:</strong> Origen: <strong>Mandíbula</strong>. Inserción: <strong>Ángulo de la boca</strong>. Función: <strong>Desciende la comisura</strong> labial."
        ]
    },
    boca: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAGX-_OqnQLIfj2mDzvVyIIBDkzYNQTU-T5agnJEKH1b5_40T_WR9WZJSLpLau1I4NRwbvhMb7qlVHI5UI-WXSmIac1IfHLzU8GhVpEm9qztpR-9Uu9UlQ3qX6YyFYonQ4SG3otPEDEum-rcXbMMrJ75j5j6n1-lyH0pOo8MqHJYeaGlVp4EuMy1Tg8w4/w435-h386/Gemini_Generated_Image_lpd51ylpd51ylpd5.jpg",
        terms: [
            "<strong>Músculo de la úvula:</strong> Origen: <strong>Aponeurosis palatina</strong>. Inserción: <strong>Mucosa propia</strong>. Función: <strong>Elevar la úvula</strong>.",
            "<strong>Músculo palatofaríngeo:</strong> Origen: <strong>Aponeurosis palatina</strong> y <strong>paladar óseo</strong>. Inserción: Pared lateral de la <strong>faringe</strong> y en el <strong>cartílago tiroides</strong>.",
            "<strong>Músculo palatogloso:</strong> Origen: <strong>Aponeurosis palatina</strong>. Inserción: Pared lateral y <strong>ampliamente a través de la lengua</strong>. Función: <strong>Eleva el aspecto posterior</strong> de la lengua y <strong>aproxima los pilares</strong> anteriores para la deglución.",
            "<strong>Músculo elevador del velo del paladar:</strong> Origen: <strong>Peñasco del temporal</strong> y <strong>trompa de Eustaquio</strong>. Inserción: <strong>Aponeurosis palatina</strong> y su <strong>músculo contralateral</strong>. Función: <strong>Elevar el velo</strong> del paladar.",
            "<strong>Músculo tensor del velo del paladar:</strong> Origen: <strong>Lámina pterigoidea</strong> y <strong>espina del esfenoides</strong>. Inserción: <strong>Aponeurosis palatina</strong>. Función: <strong>Tensar el paladar</strong> y <strong>abrir la trompa de Eustaquio</strong>."
        ]
    },
    masticacion: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGM-TKTt4hSopjCNOzlCccCzuuDjrj_oV-EDw8RqHGB-o2IbL09qKGh62XkStADUlGvdRCSSZB_rjLGzQxGx_ke393CwGAcKTCjHe94qHr7V0LU0aWYetV9OmCXceYivaq-aOfuuCPcNIw5zvu_ENOvhsND9c6NtmPnnOdUyK6iWOCcsOfGwbbRAJhyphenhyphenfk/w463-h395/Gemini_Generated_Image_ylwvg0ylwvg0ylwv.jpg",
        terms: [
            "<strong>Músculo masetero:</strong> Origen: <strong>Arco cigomático</strong>. Inserción: <strong>Mandíbula</strong>. Función: <strong>Elevar</strong> a la mandíbula. Inervación: <strong>Nervio maseterino (V3)</strong>.",
            "<strong>Músculo temporal:</strong> Origen: <strong>Fosa temporal</strong>. Inserción: <strong>Apófisis coronoides</strong> y borde anterior de la rama ascendente. Función: <strong>Elevar</strong> a la mandíbula. Inervación: <strong>Nervio temporal (V3)</strong>.",
            "<strong>Músculo pterigoideo medial:</strong> Origen: (Porción profunda) <strong>Lámina pterigoidea lateral</strong> en su cara interna y hueso palatino; (Porción superior) <strong>Hueso palatino</strong> y maxilar superior. Inserción: Cara interna de la rama de la mandíbula en la <strong>tuberosidad pterigoidea</strong>. Función: <strong>Eleva la mandíbula</strong> y permite la <strong>protrusión</strong>. Inervación: <strong>Nervio maxilar inferior (V3)</strong>.",
            "<strong>Músculo pterigoideo lateral:</strong> Origen: (Porción superior) <strong>Cresta del ala mayor</strong> del esfenoides; (Porción inferior) <strong>Lámina pterigoidea lateral</strong> en su cara externa. Inserción: <strong>Cápsula articular temporomandibular</strong> y <strong>fosita pterigoidea</strong>. Función: <strong>Abrir la boca, protrusión</strong> y <strong>estabilidad de la articulación</strong> temporomandibular. Inervación: <strong>Nervio maxilar inferior (V3)</strong>."
        ]
    },
    faringe: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLlvR6nOCL8QDckGyFyQOPRKDOag3yTHwgzXucwtcWVhf7y5eOwYyzxxB7OX9bulF9VIVXYsziMbgw5A8wCIkrL6ViisvNSMmpZs_ch9N58N-eK3vPhgQs19IvOx5gH7yzhZUhtdNgrBOBqkTe2DwFq30mG-ohLgSZ9LYOzev3GGbRDmJyFRKJkVysdaU/s320/Faringe.jpg",
        terms: [
            "<strong>Faringe:</strong> Estructura anatómica que se extiende desde la <strong>base del cráneo hasta C6</strong>. Sirve de comunicación con la <strong>cavidad nasal, bucal, laríngea</strong> y el <strong>esófago</strong>.",
            "<strong>Capa mucosa:</strong> Es la primera de las <strong>4 capas</strong> anatómicas que conforman la estructura de la faringe.",
            "<strong>Capa fibrosa:</strong> Corresponde a otra de las <strong>4 capas</strong> que estructuran la faringe.",
            "<strong>Capa muscular:</strong> Es la capa que aloja a los músculos faríngeos y constituye una de las <strong>4 capas</strong> de este órgano.",
            "<strong>Músculo constrictor superior de la faringe:</strong> Origen: <strong>Gancho pterigoides</strong> del hueso esfenoides, <strong>mandíbula</strong> y <strong>rafe pterigomandibular</strong>. Inserción: <strong>Rafe faríngeo</strong>, <strong>fascia faringobasilar</strong> y <strong>tubérculo faríngeo</strong> del hueso occipital.",
            "<strong>Músculo constrictor medio de la faringe:</strong> Origen: <strong>Hueso hioides</strong> y <strong>ligamento estilohioideo</strong>. Inserción: <strong>Rafe faríngeo</strong> y <strong>tubérculo faríngeo</strong> del hueso occipital.",
            "<strong>Músculo constrictor inferior de la faringe:</strong> Origen: <strong>Cartílago cricoides</strong>, mediante su porción <strong>tirofaríngea</strong> y <strong>cricofaríngea</strong>. Inserción: <strong>Rafe faríngeo</strong>; además, su porción cricofaríngea se inserta en el esófago para formar el <strong>esfínter esofágico superior</strong>.",
            "<strong>Músculo palatofaríngeo:</strong> Origen: Dorso del <strong>paladar óseo</strong>. Inserción: <strong>Pared lateral</strong> de la faringe y en el <strong>cartílago tiroides</strong>.",
            "<strong>Músculo salpingofaríngeo:</strong> Origen: <strong>Trompa faringotimpánica</strong>. Inserción: <strong>Pared lateral</strong> de la faringe.",
            "<strong>Músculo estilofaríngeo:</strong> Origen: <strong>Apófisis estiloides</strong> del hueso temporal, introduciéndose entre los constrictores superior y medio. Inserción: <strong>Cartílago tiroides</strong> y <strong>paredes laterales</strong> de la faringe.",
            "<strong>Capa adventicia:</strong> Es la última de las <strong>4 capas</strong> estructurales que conforman la pared de la faringe."
        ]
    },
    esofago: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5fh2dW-ehnnE-tlv4l7yd7fyivX9nYVZpIiIe4pSwGn2afiZewzxuz-Hy89UIX80v-LDLOisuBFuY6JTyigemtc42eTOkj4mseElruozagBjdQfZuDK-ou5dtAV39Iqi-xl-YBUGz6J1G6fPPQeeWNsbHLv-gcVDdzZBf7TKCqm99lW6xvFbTMlWLcVA/s320/Esofago.jpg",
        terms: [
            "<strong>Esófago:</strong> Es un conducto que <strong>continúa de la laringofaringe</strong> y se divide anatómicamente en tres porciones: <strong>cervical, torácica y abdominal</strong>.",
            "<strong>Medida:</strong> Tiene una longitud aproximada de <strong>25 a 30 centímetros</strong>.",
            "<strong>Estrechamientos:</strong> Presenta <strong>tres</strong> zonas anatómicas de reducción a lo largo de su trayecto:",
            "<strong>Cricofaríngea:</strong> Es el primer estrechamiento; está formado por la porción cricofaríngea del <strong>músculo constrictor inferior</strong> de la faringe, la cual conforma el <strong>primer esfínter faríngeo</strong>.",
            "<strong>Aortobraquial</strong> (o torácico): Es el estrechamiento medio, ubicado a la altura del arco de la <strong>aorta</strong> y el <strong>bronquio</strong> principal.",
            "<strong>Diafragmático:</strong> Es el estrechamiento final ubicado a nivel del diafragma, el cual funciona como el <strong>esfínter esofágico inferior</strong>."
        ]
    },
    estomago: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2OtjCdrzyhgwwFhSpbLbZo05cS0gG1fPmUgOy7rPNCaWFy82GjYTpEgu8EbeWHk1x-MiEupXbccRAt-EPp72fg2nXVwedHN6Ch2bC0SLFFfv9ZmWI6BBTDlOI6jyKqitEL-C74LHw3A2z2iZf1sPVzQfgMI_rtPDSwKFoqAAfnlTHHHO1eSMDJzDHbYM/s320/estomago.jpg",
        terms: [
            "<strong>Porciones del estómago:</strong> Estructura dividida en <strong>4 porciones</strong> con base en su composición histológica: <strong>cardias, fundus, cuerpo y porción pilórica.</strong>",
            "<strong>Cardias:</strong> Es la <strong>porción cardíaca</strong> inicial que contiene el <strong>orificio del cardias</strong> y la <strong>escotadura cardíaca</strong>, la cual corresponde a la <strong>desembocadura del esófago.</strong>",
            "<strong>Fundus:</strong> Constituye la porción <strong>superior</strong> del estómago, ubicada topográficamente por encima de la unión con el esófago.",
            "<strong>Cuerpo:</strong> Es la porción central y principal del estómago, ubicada debajo del fundus y delimitada por las <strong>curvaturas mayor y menor.</strong>",
            "<strong>Píloro</strong> (Porción pilórica): Segmento terminal del estómago que se subdivide en <strong>antro pilórico</strong> y <strong>conducto pilórico</strong>. Su inicio está marcado por la <strong>escotadura pilórica (o incisura angular)</strong> y desemboca a través del <strong>esfínter pilórico.</strong>"
        ]
    },
    abdominales: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjiY6xSp2FYEJjtWc6Lbf6YuDDfoSyEiII7NwbhX-F5NrOXVa5Xjiu10gBhBaNslCmpF_Zywl66SUf1_1dY6xOrmyfAbJFgeaz9YI4FlFSJjNiubYbWolvTZr7GU5Bhj7ODDllkhKVYriXabSig6NEuu49NTdU32f4oU4-Od0BkCOeFZ2eh45MkpCiANPQ/s320/abdomen.jpg",
        terms: [
            "<strong>Cuadrantes abdominales:</strong> Sistema topográfico que divide la <strong>pared abdominal anterior</strong> en <strong>9 regiones</strong> delimitadas por líneas y planos (como la línea <strong>medioclavicular</strong>, el plano <strong>subcostal</strong> y el plano <strong>intertubercular</strong>).",
            "<strong>Hipocondrio derecho</strong> (o región hipocondríaca derecha): Cuadrante ubicado en la zona <strong>superior derecha</strong> del abdomen.",
            "<strong>Epigastrio</strong> (o región epigástrica): Cuadrante ubicado en la zona <strong>superior central</strong>.",
            "<strong>Hipocondrio izquierdo</strong> (o región hipocondríaca izquierda): Cuadrante ubicado en la zona <strong>superior izquierda</strong>.",
            "<strong>Flanco derecho</strong> (o región lumbar derecha): Cuadrante ubicado en la zona <strong>media lateral derecha</strong>.",
            "<strong>Mesogastrio</strong> (o región umbilical): Cuadrante ubicado en la zona <strong>central</strong> del abdomen.",
            "<strong>Flanco izquierdo</strong> (o región lumbar izquierda): Cuadrante ubicado en la zona <strong>media lateral izquierda</strong>.",
            "<strong>Fosa iliaca derecha</strong> (o ingle / región inguinal derecha): Cuadrante ubicado en la zona <strong>inferior derecha</strong>.",
            "<strong>Hipogastrio</strong> (o región púbica): Cuadrante ubicado en la zona <strong>inferior central</strong>.",
            "<strong>Fosa iliaca izquierda</strong> (o ingle / región inguinal izquierda): Cuadrante ubicado en la zona <strong>inferior izquierda</strong>."
        ]
    },
    intestino_d: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjkpukH5ZWw5neh11p9b10tuyyZp41bk9S_sHBmAgdbGZr51NwMlOYY43KoW4ZnyGsWAgrh6YKscVUNO_m3_M2CW0GqBHASSdhiBigls497_RA2VGc7pY9la_CgpomUjFsZB9VW1G4nwldwmVmhErMU0Hsomeg5NdYehMhMvFioFds2FzBErqek2skLMjM/s320/intestino_delgado.jpg",
        terms: [
            "<strong>Partes del intestino delgado:</strong> Se extiende desde el <strong>píloro hasta el orificio ileal</strong> (válvula ileocecal). Mide de <strong>6 a 8 metros</strong> (en una persona viva) y se divide en <strong>3 partes:</strong> Duodeno, yeyuno e íleon.",
            "<strong>Duodeno:</strong> Es la porción <strong>más corta</strong> (mide de <strong>25 a 30 cm</strong>). Es tanto <strong>retro como intraperitoneal</strong> y termina en la <strong>unión duodenoyeyunal (ángulo de Treitz)</strong>. Presenta cuatro partes: porción <strong>superior, descendente, inferior (horizontal) y ascendente.</strong>",
            "<strong>Yeyuno:</strong> Constituye las <strong>2/5 partes proximales</strong> del intestino formando <strong>asas horizontales</strong>. Su pared es <strong>gruesa y fuerte</strong>, de color <strong>rojo oscuro</strong> debido a que está <strong>más vascularizado</strong>. Es <strong>más ancho</strong> (diámetro de 2 a 4 cm) y en su interior presenta pliegues circulares <strong>grandes, altos y numerosos.</strong>",
            "<strong>Íleon:</strong> Representa las <strong>2/5 partes distales</strong> y forma <strong>asas oblicuas y verticales</strong>. Su pared es <strong>delgada y ligera</strong>, de color <strong>rosa pálido</strong> por estar <strong>menos vascularizado</strong>. Es <strong>más estrecho</strong> (diámetro de 2 a 3 cm), presenta <strong>más grasa</strong> en el mesenterio y contiene los <strong>nodulillos linfáticos agregados (placas de Peyer).</strong>"
        ]
    },
    intestino_g: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8OzXQjTXutZcFMcdUA9zlDIDm_so1VhMq19FqbDdZlbVFAzSqvRZd2BWzOlz-LGe1VZaD4OOC0zTeCxuL65oeiun4K8n6-CRHYtT9g-oR-7I28bG9hhsrdgfPMOGQadno_Z1oJf913ukBW7SjfZU68pvn1MzwplI1yfNTVOWk0SiNBJEVhVvwGQiUW8c/s320/intestino_grueso.jpg",
        terms: [
            "<strong>Partes del intestino grueso:</strong> Está conformado secuencialmente por el <strong>ciego</strong>, el <strong>colon</strong>, el <strong>recto</strong> y el conducto <strong>anal (ano)</strong>. A lo largo de su estructura presenta características distintivas como la <strong>tenia del colon</strong> (o tenia libre) y los <strong>apéndices omentales (epiploicos)</strong>.",
            "<strong>Ciego:</strong> Es la porción inicial del intestino grueso, donde desemboca el íleon a través del <strong>orificio ileal</strong> y la <strong>valva ileocecal</strong>. En esta región también se encuentra el <strong>orificio del apéndice vermiforme</strong>.",
            "<strong>Colon:</strong> Se divide topográficamente en cuatro segmentos: <strong>ascendente, transverso, descendente y sigmoide</strong>. Presenta dos curvaturas importantes: la <strong>flexura cólica derecha (hepática)</strong> y la <strong>flexura cólica izquierda (esplénica)</strong>.",
            "<strong>Recto:</strong> Comienza a partir de la <strong>unión rectosigmoidea</strong>. En su pared interna presenta los <strong>pliegues transversos del recto (válvulas de Houston)</strong>, divididos en superior, medio e inferior.",
            "<strong>Ano (Conducto anal):</strong> Es la porción terminal, la cual se divide en un conducto anal <strong>quirúrgico</strong> y uno <strong>anatómico</strong>. Presenta una anatomía interna compleja con <strong>columnas anales (de Morgagni)</strong>, <strong>criptas anales</strong> y la <strong>línea pectinada (dentada)</strong>. Su apertura está regulada por el <strong>músculo esfínter interno</strong> y el <strong>músculo esfínter externo del ano</strong> (que tiene porciones profunda, superficial y subcutánea)."
        ]
    },
    higado: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgKbe9UA2HEpi-FxhnsLnZz4DcjURQPzcF_6zE0YdQ8WUJlxgYjZBMWG3h6qEjXQmNBVklKFvuMQ39t26sgsXyiprNt-ZfcFx_PO7cZyIAi3e7BcVHbUN-8XrclbXrd1ed1eSzHiBJ_s6o6GghL0z-sNkeBxMY22n7-ZKVI8IfwxjZSkPX7oc7MX1kbkBU/s320/hidado.jpg",
        terms: [
            "<strong>Lóbulos del hígado:</strong> El hígado presenta <strong>4 lóbulos anatómicos</strong> principales, los cuales se identifican claramente al observar su cara <strong>visceral (vista posteroinferior)</strong>.",
            "<strong>Lóbulo derecho:</strong> Es uno de los <strong>4 lóbulos anatómicos</strong> y se encuentra delimitado en su cara inferior por la <strong>fisura sagital derecha</strong>.",
            "<strong>Lóbulo izquierdo:</strong> Constituye otro de los <strong>4 lóbulos anatómicos</strong>, separado de las porciones centrales por la <strong>fisura umbilical (sagital izquierda)</strong> y delimitado superiormente en la cara diafragmática por el <strong>ligamento falciforme</strong>.",
            "<strong>Lóbulo caudado:</strong> Es un lóbulo central visible en la cara visceral que se ubica superiormente al <strong>porta hepático</strong> y puede ser observado a través del <strong>omento (epiplón) menor</strong> (específicamente el ligamento hepatogástrico).",
            "<strong>Lóbulo cuadrado:</strong> Es el cuarto lóbulo anatómico central; se ubica inferiormente al <strong>porta hepático</strong> y mantiene una estrecha relación anatómica con la <strong>vesícula biliar</strong>."
        ]
    },
    nariz: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSE7EPXaNIUgZLiq8uWK8uy0x3GzWguoyeNkPAm4dVW1p6g0FaQqEAIM5zp69oVUC3KtjLPJyB3bQrfgBoaTs1-WFxxQYACUME9XbtcL6S1zRNvrGj9HIfIG3YYTEYS3riBY-zJeohhbhzfC_jre5fSGrGo_6FLHi1G2XnKH4LSD44JjE_fAw95bIJ-TM/s320/nariz.jpg",
        terms: [
            "<strong>Morfología:</strong> Exterior conformado por <strong>raíz, dorso, puente, vértice, alas</strong> y <strong>narinas</strong>; interior dividido por el <strong>tabique nasal</strong>.",
            "<strong>Esqueleto:</strong> Estructura ósea (<strong>frontal, nasales, maxilar, etmoides, vómer</strong>) y cartilaginosa (<strong>tabique, alares, laterales y accesorios</strong>).",
            "<strong>Músculos:</strong> <strong>Prócer</strong> (arruga glabela), <strong>Nasal</strong> (dilata narinas y arruga dorso) y <strong>Depresor del tabique</strong> (estrecha orificios nasales).",
            "<strong>Límites:</strong> Techo (<strong>lámina cribosa</strong>), piso (<strong>paladar duro</strong>), pared medial (<strong>tabique</strong>) y lateral (<strong>conchas o cornetes</strong>). Las <strong>coanas</strong> son la vía de comunicación posterior.",
            "<strong>Irrigación:</strong> Redes de las carótidas externa e interna forman los plexos de <strong>Kiesselbach</strong> (anterior) y <strong>Woodruff</strong> (posterior), claves en el control de la <strong>epistaxis</strong>.",
            "<strong>Inervación:</strong> Sensitiva a cargo del <strong>Trigémino (V1 y V2)</strong>, motora por el <strong>Facial (VII)</strong> y sensorial especial por el <strong>Olfatorio (I)</strong>."
        ]
    },
    senos_para: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzbfFUbNI1aczGEjUaNwzB_tFdRcXZyzKp4E5A2MV_jH2AM0EmzCRbPjyLArbkcw8Aq2GUDl2V0waY2ZV_tICvhGT0XHDalvTHxQdNu5mnycBfJMmKBOgV4DrmSOMmrITEUPzRCVPVFYg1NttUG42wWsa4vV_XttOC2tC8jJmZv1Y2UZiC8pSLyUzo0Ew/s320/senos_paranasales.jpg",
        terms: [
            "<strong>Clasificación anatómica:</strong> Los senos paranasales son cavidades pares. Los <strong>maxilares</strong> son los más grandes y su techo forma la órbita; los <strong>frontales</strong> y <strong>esfenoidales</strong> (relacionados con la silla turca) están divididos por un tabique central; y las <strong>celdillas etmoidales</strong> (aproximadamente 17) se dividen espacialmente en <strong>anteriores, medias y posteriores</strong>.",
            "<strong>Drenaje y ventilación:</strong> Todos desembocan en la cavidad nasal. Los senos maxilares, frontales y las celdillas etmoidales anteriores y medias drenan en el <strong>meato medio</strong>. Las celdillas etmoidales posteriores drenan en el <strong>meato superior</strong>, el seno esfenoidal desemboca en el <strong>receso esfenoetmoidal</strong> y el conducto nasolagrimal drena en el <strong>meato inferior</strong>.",
            "<strong>Correlación estructural:</strong> Están inervados por las ramas oftálmica (V1) y maxilar (V2) del <strong>Nervio Trigémino</strong>. La inflamación de estas cavidades (<strong>sinusitis</strong>) produce <strong>rinorrea purulenta, congestión</strong> y una marcada sensación de <strong>presión y dolor facial</strong> (cefalea frontal, dolor maxilar e interescapular/retroocular)."
        ]
    },
    pulmones: {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2LuhHKNawR4TJPQ3igndEZ0rzGF7hH41GF4yLch1boyejirRLzEnMB2lpjaggD_idL6qhtvUaiWJ89hPgjwXvLnaElW4eldlZjeEXZceug5nw4g9qZGpliDKrPgNq9qzLSS0tkpZ8l-weC_3LOt9cLIeM8e3WQTuVAFm17tVfRhfhVPfzFuTGs4qSeCE/s320/pulmones.jpg",
        terms: [
            "<strong>Tráquea y Bronquios principales:</strong> Forman parte de las <strong>vías respiratorias inferiores</strong> (vía aérea intratorácica) y se encargan de conducir el aire desde la laringe hacia los pulmones.",
            "<strong>Árbol bronquial:</strong> De acuerdo con los esquemas, se ramifica dentro de los pulmones en <strong>bronquios principales, bronquios lobulares</strong> y <strong>bronquios segmentarios</strong>.",
            "<strong>Pulmones:</strong> Órganos esenciales para el <strong>intercambio de oxígeno y dióxido de carbono</strong>. Además de la respiración, tienen funciones sistémicas como <strong>filtrar pequeños coágulos</strong> sanguíneos para disolverlos y participar en la síntesis de <strong>angiotensina II</strong> (un vasoconstrictor que ayuda a regular la presión arterial).",
            "<strong>Pleura:</strong> Es la capa que envuelve a los pulmones y delimita la <strong>cavidad pleural</strong> dentro del tórax."
        ]
    }
};

window.openAnatomyModal = function(sectionId) {
    
    const data = ANATOMY_DATA[sectionId];
    if (!data) return; // Si no hay datos, no hace nada

    
    document.getElementById('anatomy-modal-img').src = data.image;

    
    const listContainer = document.getElementById('anatomy-modal-list');
    listContainer.innerHTML = data.terms.map(term => `<li>${term}</li>`).join('');

    const modal = document.getElementById('anatomy-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modal.classList.add('opacity-100');
        document.getElementById('anatomy-modal-content').classList.remove('scale-95');
        document.getElementById('anatomy-modal-content').classList.add('scale-100');
    }, 10);
};

window.closeAnatomyModal = function() {
    const modal = document.getElementById('anatomy-modal');
    
    modal.classList.remove('opacity-100');
    document.getElementById('anatomy-modal-content').classList.remove('scale-100');
    document.getElementById('anatomy-modal-content').classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        toggleSizeAnatomy(false);
    }, 300);
};

window.toggleSizeAnatomy = function(isExpanding) {
    const content = document.getElementById('anatomy-modal-content');
    const btnExpand = document.getElementById('btn-expand-anatomy');
    const btnCollapse = document.getElementById('btn-collapse-anatomy');

    if (isExpanding) {
        // Expandir a pantalla casi completa
        content.classList.remove('max-w-6xl', 'h-[70vh]');
        content.classList.add('max-w-[95vw]', 'h-[90vh]');
        
        // Intercambiar botones
        btnExpand.classList.add('hidden');
        btnCollapse.classList.remove('hidden');
    } else {
        // Regresar a tamaño compacto
        content.classList.remove('max-w-[95vw]', 'h-[90vh]');
        content.classList.add('max-w-6xl', 'h-[70vh]');
        
        // Intercambiar botones
        btnCollapse.classList.add('hidden');
        btnExpand.classList.remove('hidden');
    }
};

/* ---------------------------------------------------- Animaciones Lottie de Fondo ------------------------------------------------ */

function initBackgroundLotties() {
    const container = document.getElementById('lottie-bg-container');
    if (!container) return;

    const lottieFiles = [
        'sangre.json',
        'celula.json',
        'cerebro.json'
    ]; 

    const zones = [
        { topMin: 5, topMax: 20, leftMin: 2, leftMax: 15 },    
        { topMin: 5, topMax: 20, leftMin: 75, leftMax: 90 },   
        { topMin: 45, topMax: 60, leftMin: -5, leftMax: 5 },   
        { topMin: 75, topMax: 90, leftMin: 5, leftMax: 20 },   
        { topMin: 75, topMax: 90, leftMin: 75, leftMax: 90 }   
    ];

    for (let i = 0; i < zones.length; i++) {
        const lottieDiv = document.createElement('div');
        lottieDiv.classList.add('lottie-item');

        const size = Math.floor(Math.random() * 200) + 150;
        lottieDiv.style.width = `${size}px`;
        lottieDiv.style.height = `${size}px`;

        const zone = zones[i];
        const topPos = Math.floor(Math.random() * (zone.topMax - zone.topMin + 1)) + zone.topMin;
        const leftPos = Math.floor(Math.random() * (zone.leftMax - zone.leftMin + 1)) + zone.leftMin;

        lottieDiv.style.top = `${topPos}%`;
        lottieDiv.style.left = `${leftPos}%`;
        
        lottieDiv.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2); 

        container.appendChild(lottieDiv);

        const randomFile = lottieFiles[Math.floor(Math.random() * lottieFiles.length)];

        lottie.loadAnimation({
            container: lottieDiv,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: randomFile 
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundLotties();
});

/* ---------------------------------------------------- Animación Tarjeta Audio ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const lottieContainer = document.getElementById('lottie-sound-wave');
    const audioCard = document.getElementById('audio-lottie-card');

    if (lottieContainer && audioCard) {
        const soundWaveAnim = lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true, 
            autoplay: false, 
            path: 'ayuda_inteligente.json' 
        });

        const voiceAudio = new Audio('anatomia_audio.m4a'); 
        let isPlaying = false;
        const cardText = audioCard.querySelector('span');

        audioCard.addEventListener('click', () => {
            if (isPlaying) {
                
                voiceAudio.pause();
                soundWaveAnim.pause(); 
                
                
                document.body.classList.remove('is-speaking');
                audioCard.classList.remove('is-playing-audio'); 
                cardText.textContent = "Presiona para escucharme";
            } else {
                
                voiceAudio.play();
                soundWaveAnim.play(); 
                
                document.body.classList.add('is-speaking');
                audioCard.classList.add('is-playing-audio'); 
                cardText.textContent = "Escuchando...";
            }
            
            isPlaying = !isPlaying;
        });

        voiceAudio.addEventListener('ended', () => {
            soundWaveAnim.stop(); 
            document.body.classList.remove('is-speaking');
            audioCard.classList.remove('is-playing-audio'); 
            cardText.textContent = "Presiona para escucharme";
            isPlaying = false;
        });
    }

    // --- Tarjeta de Audio Histología ---
    const lottieContainerHisto = document.getElementById('lottie-sound-wave-histo');
    const audioCardHisto = document.getElementById('audio-lottie-card-histo');

    if (lottieContainerHisto && audioCardHisto) {
        const soundWaveAnimHisto = lottie.loadAnimation({
            container: lottieContainerHisto,
            renderer: 'svg',
            loop: true, 
            autoplay: false, 
            path: 'ayuda_inteligente.json' 
        });

        const voiceAudioHisto = new Audio('cancion_histo.mp3'); 
        let isPlayingHisto = false;
        const cardTextHisto = audioCardHisto.querySelector('span');

        audioCardHisto.addEventListener('click', () => {
            if (isPlayingHisto) {
                voiceAudioHisto.pause();
                soundWaveAnimHisto.pause(); 
                document.body.classList.remove('is-speaking');
                audioCardHisto.classList.remove('is-playing-audio'); 
                cardTextHisto.textContent = "Presiona para escucharme";
            } else {
                voiceAudioHisto.play();
                soundWaveAnimHisto.play(); 
                document.body.classList.add('is-speaking');
                audioCardHisto.classList.add('is-playing-audio'); 
                cardTextHisto.textContent = "Escuchando...";
            }
            isPlayingHisto = !isPlayingHisto;
        });

        voiceAudioHisto.addEventListener('ended', () => {
            soundWaveAnimHisto.stop(); 
            document.body.classList.remove('is-speaking');
            audioCardHisto.classList.remove('is-playing-audio'); 
            cardTextHisto.textContent = "Presiona para escucharme";
            isPlayingHisto = false;
        });
    }
});

/* ---------------------------------------------------- Efecto de Empuje Material You (Hermanos) ------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos interactivos que reaccionarán al empuje
    const interactiveElements = document.querySelectorAll('button, .fab-pill-option, .footer__social-icon, .desktop-theme-fab, .nav-btn, .action-btn, .timeline__card, .skill-card, .filter-option, #Anato .grid > div');

    interactiveElements.forEach(el => {
        el.addEventListener('click', function(e) {
            // 1. Animación de expansión para el elemento que recibe el clic
            this.classList.remove('material-click-expand');
            void this.offsetWidth; // Forzar reflow para reiniciar la animación si se hace clic rápido
            this.classList.add('material-click-expand');

            setTimeout(() => this.classList.remove('material-click-expand'), 500);

            // 2. Lógica para identificar y empujar a los elementos vecinos (Hermanos)
            const parent = this.parentElement;
            if (!parent) return;

            const siblings = Array.from(parent.children);
            const rectClicked = this.getBoundingClientRect();

            siblings.forEach(sibling => {
                if (sibling === this) return; // Ignoramos el elemento que acabamos de clickear

                const rectSibling = sibling.getBoundingClientRect();
                
                // Determinar si los vecinos están en la misma fila (horizontal) o apilados (vertical)
                const isHorizontal = Math.abs(rectClicked.top - rectSibling.top) < (rectClicked.height / 2);

                // Limpiar animaciones previas de los vecinos
                sibling.classList.remove('push-left', 'push-right', 'push-up', 'push-down');
                void sibling.offsetWidth;

                // Aplicar el empuje en la dirección correcta según la posición del vecino
                if (isHorizontal) {
                    if (rectSibling.left < rectClicked.left) {
                        sibling.classList.add('push-left');  // El vecino está a la izquierda, lo empujamos a la izquierda
                    } else {
                        sibling.classList.add('push-right'); // El vecino está a la derecha, lo empujamos a la derecha
                    }
                } else {
                    if (rectSibling.top < rectClicked.top) {
                        sibling.classList.add('push-up');    // El vecino está arriba, lo empujamos hacia arriba
                    } else {
                        sibling.classList.add('push-down');  // El vecino está abajo, lo empujamos hacia abajo
                    }
                }

                // Limpiar la clase del vecino al terminar el rebote
                setTimeout(() => {
                    sibling.classList.remove('push-left', 'push-right', 'push-up', 'push-down');
                }, 500);
            });
        });
    });
});

/* ---------------------------------------------------- Sección Histología Dinámica ------------------------------------------------ */

const TEJIDOS_DATA = [
    
    {
        id: 'epitelial',
        title: 'Epitelial',
        layout: 'tejido',
        bgColor: 'var(--card-pick-color)',
        iconBg: 'bg-[#b673a9]',
        mainIcon: 'grid_view', 
        sections: [
            { icon: 'format_list_bulleted', name: 'Tipos de tejido', items: ['De revestimiento (simple o estratificado)', 'Glandular (exocrino o endocrino)', 'Sensorial'] },
            { icon: 'auto_awesome', name: 'Características', items: ['Células muy unidas entre sí.', 'Poca matriz extracelular.', 'Alta capacidad de renovación.', 'Polaridad (apical y basal).'] },
            { icon: 'settings', name: 'Función', items: ['Protección', 'Absorción', 'Secreción', 'Intercambio de sustancias', 'Percepción sensorial'] },
            { icon: 'location_on', name: 'Localización', items: ['Piel (epidermis)', 'Revestimiento de órganos', 'Glándulas'] },
            { icon: 'layers', name: 'Origen embrionario', items: ['Ectodermo', 'Endodermo', 'Mesodermo'] }
        ],
        imgName: 'Epitelio de revestimiento'
    },
    {
        id: 'conectivo',
        title: 'Conectivo',
        layout: 'tejido',
        bgColor: 'var(--card-blue-color)',
        iconBg: 'bg-[#6ca4d8]',
        mainIcon: 'waves',
        sections: [
            { icon: 'format_list_bulleted', name: 'Tipos de tejido', items: ['Conjuntivo propiamente dicho', 'Adiposo', 'Cartilaginoso', 'Óseo', 'Sanguíneo y linfático'] },
            { icon: 'auto_awesome', name: 'Características', items: ['Abundante matriz extracelular.', 'Células variadas.', 'Generalmente bien vascularizado.'] },
            { icon: 'settings', name: 'Función', items: ['Sostén y unión de tejidos', 'Almacenamiento de energía', 'Defensa inmunológica', 'Transporte', 'Reparación y cicatrización'] },
            { icon: 'location_on', name: 'Localización', items: ['Debajo de epitelios', 'Entre órganos', 'En la piel, huesos, cartílagos, sangre'] },
            { icon: 'layers', name: 'Origen embrionario', items: ['Mesodermo'] }
        ],
        imgName: 'Tejido conectivo laxo'
    },
    {
        id: 'muscular',
        title: 'Muscular',
        layout: 'tejido',
        bgColor: 'var(--card-brown-color)',
        iconBg: 'bg-[#d87c6c]',
        mainIcon: 'fitness_center', 
        sections: [
            { icon: 'format_list_bulleted', name: 'Tipos de tejido', items: ['Esquelético (voluntario)', 'Cardíaco (involuntario)', 'Liso (involuntario)'] },
            { icon: 'auto_awesome', name: 'Características', items: ['Fibras alargadas (miocitos).', 'Contiene actina y miosina.', 'Alta capacidad de contracción.'] },
            { icon: 'settings', name: 'Función', items: ['Movimiento voluntario e involuntario', 'Producción de calor', 'Bombeo de sangre'] },
            { icon: 'location_on', name: 'Localización', items: ['Músculos esqueléticos', 'Miocardio', 'Paredes de vísceras y vasos'] },
            { icon: 'layers', name: 'Origen embrionario', items: ['Mesodermo'] }
        ],
        imgName: 'Músculo esquelético'
    },
    {
        id: 'nervioso',
        title: 'Nervioso',
        layout: 'tejido',
        bgColor: 'var(--card-green-color)',
        iconBg: 'bg-[#7c7cd8]',
        mainIcon: 'psychology', 
        sections: [
            { icon: 'format_list_bulleted', name: 'Tipos de tejido', items: ['Neuronas', 'Células gliales'] },
            { icon: 'auto_awesome', name: 'Características', items: ['Alta excitabilidad eléctrica y química.', 'Conexiones especializadas (sinapsis).', 'Poco matriz extracelular.'] },
            { icon: 'settings', name: 'Función', items: ['Recepción de estímulos', 'Procesamiento de información', 'Respuesta y coordinación'] },
            { icon: 'location_on', name: 'Localización', items: ['Encéfalo', 'Médula espinal', 'Nervios periféricos', 'Ganglios nerviosos'] },
            { icon: 'layers', name: 'Origen embrionario', items: ['Ectodermo', 'Cresta neural'] }
        ],
        imgName: 'Neuronas y sinapsis'
    },

    
    {
        id: 'rinon',
        title: 'Riñón',
        layout: 'organo',
        bgColor: 'var(--card-pick-color)',
        iconBg: 'bg-[#d94a6e]',
        mainIcon: 'nephrology', 
        sections: [
            { icon: 'track_changes', name: 'Órgano / Porción', items: ['Riñón (Corteza general)'] },
            { icon: 'layers', name: 'Tipo de Epitelio Dominante', items: ['Cúbico simple (túbulos)', 'Plano simple (cápsula de Bowman)'] },
            { icon: 'biotech', name: 'Componente Extracelular Crítico', items: ['Matriz mesangial y lámina basal (colágeno tipo IV).'] },
            { icon: 'settings', name: 'Función Principal', items: ['Filtración del plasma sanguíneo.', 'Reabsorción y secreción de solutos.'] }
        ],
        imgName: 'Corpúsculo renal'
    },
    {
        id: 'asa_henle',
        title: 'Asa de Henle',
        layout: 'organo',
        bgColor: 'var(--card-blue-color)',
        iconBg: 'bg-[#4a8cd9]',
        mainIcon: 'water_drop',
        sections: [
            { icon: 'track_changes', name: 'Órgano / Porción', items: ['Asa de Henle'] },
            { icon: 'layers', name: 'Tipo de Epitelio Dominante', items: ['Plano simple (ramas delgadas)', 'Cúbico simple (rama gruesa ascendente)'] },
            { icon: 'biotech', name: 'Componente Extracelular Crítico', items: ['Intersticio medular hiperosmótico (alta concentración de sodio y urea).'] },
            { icon: 'settings', name: 'Función Principal', items: ['Crear un gradiente de concentración (multiplicador de contracorriente) para recuperar agua.'] }
        ],
        imgName: 'Túbulo en forma de U'
    },
    {
        id: 'ureter',
        title: 'Uréter',
        layout: 'organo',
        bgColor: 'var(--card-brown-color)',
        iconBg: 'bg-[#d98b4a]',
        mainIcon: 'route',
        sections: [
            { icon: 'track_changes', name: 'Órgano / Porción', items: ['Uréter'] },
            { icon: 'layers', name: 'Tipo de Epitelio Dominante', items: ['Urotelio (epitelio de transición)'] },
            { icon: 'biotech', name: 'Componente Extracelular Crítico', items: ['Lámina propia muy rica en fibras elásticas y colágeno.'] },
            { icon: 'settings', name: 'Función Principal', items: ['Conducir la orina hacia la vejiga mediante peristaltismo.'] }
        ],
        imgName: 'Conducto transversal'
    },
    {
        id: 'vejiga',
        title: 'Vejiga',
        layout: 'organo',
        bgColor: 'var(--card-green-color)',
        iconBg: 'bg-[#4ad98f]',
        mainIcon: 'storage',
        sections: [
            { icon: 'track_changes', name: 'Órgano / Porción', items: ['Vejiga'] },
            { icon: 'layers', name: 'Tipo de Epitelio Dominante', items: ['Urotelio (epitelio de transición)'] },
            { icon: 'biotech', name: 'Componente Extracelular Crítico', items: ['Uroplaquinas (membrana apical).', 'Abundante tejido conectivo fibroelástico.'] },
            { icon: 'settings', name: 'Función Principal', items: ['Almacenamiento temporal de la orina y su posterior expulsión.'] }
        ],
        imgName: 'Pared epitelial transicional'
    },
    {
        id: 'uretra',
        title: 'Uretra',
        layout: 'organo',
        bgColor: 'var(--card-twoblue-color)',
        iconBg: 'bg-[#8b4ad9]',
        mainIcon: 'opacity',
        sections: [
            { icon: 'track_changes', name: 'Órgano / Porción', items: ['Uretra'] },
            { icon: 'layers', name: 'Tipo de Epitelio Dominante', items: ['Varía: de Urotelio a Cilíndrico/Pseudoestratificado, terminando en Plano Estratificado No Queratinizado.'] },
            { icon: 'biotech', name: 'Componente Extracelular Crítico', items: ['Glándulas mucosas (ej. glándulas de Littré en hombres) que lubrican la luz.'] },
            { icon: 'settings', name: 'Función Principal', items: ['Vía de excreción final de la orina hacia el exterior del cuerpo.'] }
        ],
        imgName: 'Corte transversal y glándulas'
    }
];

let currentTejidoIdx = 0;
let isShowingAllTejidos = false;

function buildTejidoCard(data) {
    const isOrgano = data.layout === 'organo';

    const sectionsHtml = data.sections.map((sec, index) => {
        let gridClass = '';
        let isCentrado = false;

        if (isOrgano) {
            if (index === 0) gridClass = 'md:col-span-3 rounded-[30px]'; 
            else if (index === 1) gridClass = 'md:col-span-3 rounded-[30px]'; 
            else if (index === 2) { gridClass = 'md:col-span-6 rounded-[40px] items-center text-center'; isCentrado = true; } 
            else if (index === 3) gridClass = 'md:col-span-3 rounded-[30px]'; 
        } else {
            if (index === 0) gridClass = 'md:col-span-3 rounded-[30px]';
            else if (index === 1) gridClass = 'md:col-span-3 rounded-[30px]';
            else if (index === 2) { gridClass = 'md:col-span-6 rounded-[40px] items-center text-center'; isCentrado = true; }
            else if (index === 3) gridClass = 'md:col-span-2 rounded-[30px]';
            else if (index === 4) gridClass = 'md:col-span-2 rounded-[30px]';
        }

        const listClasses = isCentrado 
            ? 'flex flex-wrap justify-center gap-x-3 gap-y-2 mt-2' 
            : 'space-y-1 ml-1 text-xs md:text-sm';
        
        const liClasses = isCentrado 
            ? 'bg-white/40 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-white/30' 
            : 'list-disc list-inside';

        return `
            <div class="${gridClass} flex flex-col justify-center histologia-inner-bg p-4 md:p-5 hover:scale-[1.01] transition-transform duration-300 shadow-sm border border-white/30">
                <div class="flex items-center gap-2 text-[var(--black-color)] mb-2 ${isCentrado ? 'justify-center w-full' : ''}">
                    <!-- Aquí se inyecta el Material Symbol -->
                    <span class="material-symbols-outlined text-[24px] font-medium leading-none">${sec.icon}</span>
                    <h4 class="font-bold text-base leading-tight">${sec.name}</h4>
                </div>
                <ul class="text-[var(--black-color)] opacity-85 ${listClasses}">
                    ${sec.items.map(item => `<li class="${liClasses}">${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }).join('');

    const esquemaGridClass = isOrgano ? 'md:col-span-3' : 'md:col-span-2';

    const esquemaHtml = `
        <div class="${esquemaGridClass} rounded-[30px] flex flex-col histologia-inner-bg p-4 md:p-5 hover:scale-[1.01] transition-transform duration-300 shadow-sm border border-white/30">
            <div class="flex items-center gap-2 text-[var(--black-color)] mb-2">
                <!-- Icono de imagen de Material Symbols -->
                <span class="material-symbols-outlined text-[24px] font-medium leading-none">image</span>
                <h4 class="font-bold text-base leading-tight">Esquema</h4>
            </div>
            <div class="w-full flex-grow min-h-[90px] rounded-2xl flex items-center justify-center text-[var(--black-color)] opacity-70 text-xs font-medium border border-current shadow-inner text-center px-2" style="background: rgba(128,128,128,0.1);">
                [${data.imgName}]
            </div>
        </div>
    `;

    return `
        <div class="backdrop-blur-md rounded-[40px] border border-white/20 p-5 md:p-6 shadow-md flex flex-col gap-4 animate-fade-in transition-colors duration-500" style="background-color: ${data.bgColor}">
            <!-- Encabezado -->
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-[22px] ${data.iconBg} flex items-center justify-center text-white shadow-inner flex-shrink-0">
                    <!-- Icono principal de Material Symbols -->
                    <span class="material-symbols-outlined text-[32px] font-medium">${data.mainIcon}</span>
                </div>
                <div>
                    <h3 class="text-2xl md:text-3xl font-extrabold text-[var(--black-color)] tracking-tight">${data.title}</h3>
                    <p class="text-[var(--black-color)] opacity-60 font-medium text-sm">
                        ${isOrgano ? 'Histología de Sistemas' : 'Análisis tisular general'}
                    </p>
                </div>
            </div>
            
            <!-- Grid Bento Interno Responsivo -->
            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                ${sectionsHtml}
                ${esquemaHtml}
            </div>
        </div>
    `;
}

function renderHistologiaView() {
    const container = document.getElementById('histologia-grid');
    const btnToggle = document.getElementById('btn-toggle-tejidos');
    const btnPrev = document.getElementById('btn-prev-tejido');
    const btnNext = document.getElementById('btn-next-tejido');

    if (!container) return;

    container.innerHTML = '';

    if (isShowingAllTejidos) {
        
        container.className = 'grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-500 max-w-7xl mx-auto';
        TEJIDOS_DATA.forEach(tejido => {
            container.innerHTML += buildTejidoCard(tejido);
        });
        btnToggle.innerText = 'Mostrar tejido individual';
        btnPrev.classList.add('opacity-50', 'pointer-events-none');
        btnNext.classList.add('opacity-50', 'pointer-events-none');
    } else {
        
        container.className = 'grid grid-cols-1 max-w-5xl mx-auto transition-all duration-500';
        container.innerHTML = buildTejidoCard(TEJIDOS_DATA[currentTejidoIdx]);
        btnToggle.innerText = 'Mostrar todos los tejidos';
        btnPrev.classList.remove('opacity-50', 'pointer-events-none');
        btnNext.classList.remove('opacity-50', 'pointer-events-none');
    }

    
    lucide.createIcons();
}

// Configuración de Eventos para la botonera
document.addEventListener('DOMContentLoaded', () => {
    const btnPrev = document.getElementById('btn-prev-tejido');
    const btnNext = document.getElementById('btn-next-tejido');
    const btnToggle = document.getElementById('btn-toggle-tejidos');

    if (btnPrev && btnNext && btnToggle) {
        btnPrev.addEventListener('click', () => {
            currentTejidoIdx = (currentTejidoIdx - 1 + TEJIDOS_DATA.length) % TEJIDOS_DATA.length;
            renderHistologiaView();
        });

        btnNext.addEventListener('click', () => {
            currentTejidoIdx = (currentTejidoIdx + 1) % TEJIDOS_DATA.length;
            renderHistologiaView();
        });

        btnToggle.addEventListener('click', () => {
            isShowingAllTejidos = !isShowingAllTejidos;
            renderHistologiaView();
        });

        renderHistologiaView();
    }
});

/* ------------------------------------------------------------ Bioquimica ------------------------------------------------------------- */

function showBioMessage(text, type = 'info') {
    const box = document.getElementById('bio-message-box');
    if(!box) return;
    box.textContent = text;
    box.className = `bio-msg-box show msg-${type}`;
    setTimeout(() => { box.classList.remove('show'); }, 3000);
}

// Navegación de sección Bioquímica
function hideAllBio() {
    document.getElementById('bio-main-menu').classList.add('hidden');
    document.getElementById('bio-main-menu').classList.remove('grid');
    for(let i = 1; i <= 5; i++) {
        const gameContainer = document.getElementById(`game${i}-container`);
        if(gameContainer) {
            gameContainer.classList.add('hidden');
            gameContainer.classList.remove('flex');
        }
    }

    document.getElementById('btn-back-bio-menu').classList.remove('hidden');
}

window.showBioMainMenu = function() {
    document.getElementById('bio-main-menu').classList.remove('hidden');
    document.getElementById('bio-main-menu').classList.add('grid');
    document.getElementById('btn-back-bio-menu').classList.add('hidden');
    
    for(let i = 1; i <= 5; i++) {
        const gameContainer = document.getElementById(`game${i}-container`);
        if(gameContainer) {
            gameContainer.classList.add('hidden');
            gameContainer.classList.remove('flex');
        }
    }
    
    document.getElementById('g1-victory').classList.add('hidden');
    document.getElementById('g2-end-modal').classList.add('hidden');
    document.getElementById('g3-end-modal').classList.add('hidden');
    document.getElementById('g4-end-modal').classList.add('hidden');
    document.getElementById('g5-end-modal').classList.add('hidden');

    if (typeof window.stopGame5 === 'function') {
        window.stopGame5();
    }
};

/* --- JUEGO 1: CONSTRUCTOR DE COMPUESTOS --- */
const g1Targets = [
    { name: "Agua", formula: "H₂O", elements: { 'H': 2, 'O': 1 } },
    { name: "Dióxido de Carbono", formula: "CO₂", elements: { 'C': 1, 'O': 2 } },
    { name: "Metano", formula: "CH₄", elements: { 'C': 1, 'H': 4 } },
    { name: "Amoníaco", formula: "NH₃", elements: { 'N': 1, 'H': 3 } },
    { name: "Glucosa", formula: "C₆H₁₂O₆", elements: { 'C': 6, 'H': 12, 'O': 6 } }
];

let currentG1Level = 0;
let currentReaction = {}; 

window.startGame1 = function() {
    hideAllBio();
    document.getElementById('game1-container').classList.remove('hidden');
    document.getElementById('game1-container').classList.add('flex');
    document.getElementById('g1-victory').classList.add('hidden');
    currentG1Level = 0;
    loadG1Level();
};

function loadG1Level() {
    if (currentG1Level >= g1Targets.length) {
        document.getElementById('g1-victory').classList.remove('hidden');
        document.getElementById('g1-victory').classList.add('flex');
        triggerGameEffect('win');
        return;
    }
    const target = g1Targets[currentG1Level];
    document.getElementById('g1-target-name').textContent = target.name;
    document.getElementById('g1-target-formula').textContent = target.formula;
    document.getElementById('g1-level').textContent = `${currentG1Level + 1} / ${g1Targets.length}`;
    clearReactionZone();
}

// Lógica Drag and Drop
document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.element-draggable');
    const dropZone = document.getElementById('reaction-zone');
    
    if(!dropZone) return;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', draggable.dataset.element);
            draggable.style.opacity = '0.5';
        });
        draggable.addEventListener('dragend', () => { draggable.style.opacity = '1'; });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const element = e.dataTransfer.getData('text/plain');
        if(element) addElementToZone(element);
    });
});

function addElementToZone(elName) {
    document.getElementById('drop-placeholder').style.display = 'none';
    currentReaction[elName] = (currentReaction[elName] || 0) + 1;

    // Asignar colores fijos a los elementos para mantener la identidad visual del juego
    const colorMap = { 'C': '#374151', 'H': '#ef4444', 'O': '#3b82f6', 'N': '#10b981' };
    
    const div = document.createElement('div');
    div.className = 'dropped-element';
    div.style.backgroundColor = colorMap[elName];
    div.textContent = elName;
    div.dataset.element = elName;
    div.onclick = function() { removeElementFromZone(this, elName); };
    
    document.getElementById('reaction-zone').appendChild(div);
}

function removeElementFromZone(domElement, elName) {
    document.getElementById('reaction-zone').removeChild(domElement);
    currentReaction[elName]--;
    if (currentReaction[elName] <= 0) delete currentReaction[elName];
    if(Object.keys(currentReaction).length === 0) {
        document.getElementById('drop-placeholder').style.display = 'block';
    }
}

window.clearReactionZone = function() {
    const elements = document.getElementById('reaction-zone').querySelectorAll('.dropped-element');
    elements.forEach(el => el.remove());
    currentReaction = {};
    document.getElementById('drop-placeholder').style.display = 'block';
};

window.checkCompound = function() {
    const target = g1Targets[currentG1Level].elements;
    let isCorrect = true;
    let targetKeys = Object.keys(target);
    let currentKeys = Object.keys(currentReaction);

    if (targetKeys.length !== currentKeys.length) isCorrect = false;
    else {
        for (let key of targetKeys) {
            if (target[key] !== currentReaction[key]) { isCorrect = false; break; }
        }
    }

    if (isCorrect) {
        showBioMessage('¡Síntesis Exitosa!', 'success');
        setTimeout(() => { currentG1Level++; loadG1Level(); }, 1000);
    } else {
        if(Object.keys(currentReaction).length === 0) showBioMessage('Agrega elementos a la zona.', 'error');
        else showBioMessage('Fórmula incorrecta. Revisa las proporciones.', 'error');
    }
};

/* --- JUEGO 2: EL CAMINO DE LA ENERGÍA --- */
const pathwayStory = {
    start: {
        text: "Tienes una molécula de Glucosa (6C) en el citoplasma. ¿Qué proceso inicia su degradación?",
        options: [
            { text: "Ciclo de Krebs", next: "fail_krebs", isCorrect: false },
            { text: "Glucólisis", next: "step2_pyruvate", isCorrect: true, addNode: {title: "Glucólisis", desc: "Produce 2 ATP y 2 NADH"} }
        ]
    },
    step2_pyruvate: {
        text: "La Glucólisis ha dividido la glucosa. ¿Cuál es el producto final de esta vía?",
        options: [
            { text: "Ácido Láctico", next: "fail_lactic", isCorrect: false },
            { text: "Piruvato", next: "step3_oxygen_check", isCorrect: true, addNode: {title: "2 Piruvatos (3C)", desc: "Listos para el siguiente paso"} }
        ]
    },
    step3_oxygen_check: {
        text: "Tienes Piruvato. El camino depende de un elemento crucial. ¿Hay oxígeno disponible en la célula?",
        options: [
            { text: "Sí (Aerobio)", next: "step4_aerobic", isCorrect: true, style: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300" },
            { text: "No (Anaerobio)", next: "step4_anaerobic", isCorrect: true, style: "bg-red-100 hover:bg-red-200 text-red-800 border-red-300" }
        ]
    },
    step4_aerobic: {
        text: "Hay oxígeno. El piruvato ingresa a la mitocondria y pierde un carbono. ¿En qué se convierte?",
        options: [
            { text: "Citrato", next: "fail_citrate", isCorrect: false },
            { text: "Acetil-CoA", next: "step5_krebs", isCorrect: true, addNode: {title: "Acetil-CoA (2C)", desc: "Libera CO2 en la matriz"} }
        ]
    },
    step5_krebs: {
        text: "El Acetil-CoA entra al Ciclo de Krebs. ¿Cuál es su principal propósito funcional?",
        options: [
            { text: "Producir toneladas de ATP", next: "fail_atp", isCorrect: false },
            { text: "Generar transportadores (NADH, FADH2)", next: "step6_etc", isCorrect: true, addNode: {title: "Ciclo de Krebs", desc: "Produce NADH y FADH2"} }
        ]
    },
    step6_etc: {
        text: "Los NADH/FADH2 llevan electrones a la cadena. ¿Quién es el aceptor FINAL de electrones?",
        options: [
            { text: "Oxígeno (O2)", next: "win_aerobic", isCorrect: true, addNode: {title: "Fosforilación Oxidativa", desc: "Gran producción de ATP"} },
            { text: "Dióxido de Carbono (CO2)", next: "fail_co2", isCorrect: false }
        ]
    },
    step4_anaerobic: {
        text: "No hay oxígeno. La célula necesita reciclar el NAD+. ¿Qué proceso realiza (en músculo humano)?",
        options: [
            { text: "Fermentación Láctica", next: "win_anaerobic", isCorrect: true, addNode: {title: "Fermentación Láctica", desc: "Produce Láctico, recicla NAD+"} },
            { text: "Fermentación Alcohólica", next: "fail_alcohol", isCorrect: false }
        ]
    },
    fail_krebs: { error: true, text: "Error metabólico: La glucólisis siempre es el primer paso." },
    fail_lactic: { error: true, text: "El ácido láctico solo se forma sin oxígeno, después del piruvato." },
    fail_citrate: { error: true, text: "El piruvato debe convertirse en Acetil-CoA primero." },
    fail_atp: { error: true, text: "El ciclo de Krebs extrae electrones, casi no produce ATP directo." },
    fail_co2: { error: true, text: "Sin oxígeno, la cadena de transporte colapsa." },
    fail_alcohol: { error: true, text: "Los humanos realizan fermentación láctica, no alcohólica." },
    win_aerobic: { win: true, type: "aerobic", text: "Has completado la ruta eficiente, generando máximo ATP." },
    win_anaerobic: { win: true, type: "anaerobic", text: "Sobreviviste sin oxígeno produciendo ácido láctico." }
};

window.startGame2 = function() {
    hideAllBio();
    document.getElementById('game2-container').classList.remove('hidden');
    document.getElementById('game2-container').classList.add('flex');
    document.getElementById('g2-end-modal').classList.add('hidden');
    document.getElementById('g2-end-modal').classList.remove('flex');
    document.getElementById('g2-history').innerHTML = '';
    updateG2Progress(10);
    loadG2Step('start');
};

function loadG2Step(stepId) {
    const stepData = pathwayStory[stepId];
    if (stepData.error) { endG2Game(false, stepData.text); return; }
    if (stepData.win) { endG2Game(true, stepData.text, stepData.type); return; }

    document.getElementById('g2-question-title').textContent = stepData.text;
    const optionsContainer = document.getElementById('g2-options');
    optionsContainer.innerHTML = '';

    stepData.options.forEach((opt) => {
        const btn = document.createElement('button');
        const defaultStyle = "bg-white/50 backdrop-blur-sm border border-slate-300 hover:bg-green-50 text-[var(--black-color)] hover:border-green-400";
        btn.className = `bio-pathway-option w-full p-4 rounded-[15px] font-bold text-left shadow-sm ${opt.style || defaultStyle}`;
        btn.textContent = opt.text;
        btn.onclick = () => handleG2Option(opt);
        optionsContainer.appendChild(btn);
    });
}

function handleG2Option(option) {
    if (!option.isCorrect) {
        showBioMessage("Decisión incorrecta metabólicamente.", "error");
        loadG2Step(option.next);
        return;
    }
    if (option.addNode) addG2HistoryNode(option.addNode.title, option.addNode.desc);
    
    let currentProg = parseInt(document.getElementById('g2-progress-bar').style.width) || 10;
    updateG2Progress(Math.min(currentProg + 20, 100));
    loadG2Step(option.next);
}

function addG2HistoryNode(title, desc) {
    const historyContainer = document.getElementById('g2-history');
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'w-full flex flex-col items-center animate-fade-in';
    nodeDiv.innerHTML = `
        <div class="bio-connection-arrow"></div>
        <div class="bio-pathway-node completed-node w-64">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white">${title}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300">${desc}</p>
        </div>
    `;
    historyContainer.appendChild(nodeDiv);
}

function updateG2Progress(percent) {
    document.getElementById('g2-progress-bar').style.width = `${percent}%`;
}

function endG2Game(isWin, message, type = null) {
    const modal = document.getElementById('g2-end-modal');
    const icon = document.getElementById('g2-end-icon');
    const title = document.getElementById('g2-end-title');
    const msg = document.getElementById('g2-end-msg');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (isWin) {
        updateG2Progress(100);
        title.textContent = "¡Ruta Completada!";
        title.className = "text-4xl font-black mb-3 text-green-600";
        msg.textContent = message;
        icon.textContent = type === 'aerobic' ? "bolt" : "water_drop";
        icon.className = `material-symbols-outlined text-[80px] mb-4 ${type === 'aerobic' ? 'text-yellow-500' : 'text-blue-500'}`;
        triggerGameEffect('win');
    } else {
        title.textContent = "Fallo Metabólico";
        title.className = "text-4xl font-black mb-3 text-red-500";
        msg.textContent = message;
        icon.textContent = "skull";
        icon.className = "material-symbols-outlined text-[80px] mb-4 text-red-500";
        triggerGameEffect('lose');
    }
}

/* --- JUEGO 3: DETECTIVE METABÓLICO --- */
const g3Cases = [
    {
        patient: "Ana S., 12 años",
        symptoms: "Fatiga extrema, sed constante, pérdida de peso, aliento con olor frutal.",
        labs: ["Glucosa en sangre: 350 mg/dL (Alto)", "Cuerpos cetónicos: Positivo", "pH sanguíneo: 7.2 (Bajo)"],
        options: [
            { name: "Diabetes Mellitus Tipo 1", correct: true },
            { name: "Hipoglucemia Severa", correct: false, feedback: "La glucosa está muy alta, no baja." },
            { name: "Intolerancia a la Lactosa", correct: false, feedback: "No explica la hiperglucemia ni la cetosis." }
        ],
        explanation: "Falta de insulina. El cuerpo usa grasas, generando cuerpos cetónicos que acidifican la sangre."
    },
    {
        patient: "Carlos M., Neonato",
        symptoms: "Letargo, vómitos, olor a 'ratón' en orina.",
        labs: ["Fenilalanina en sangre: > 20 mg/dL (Alto)", "Niveles de Tirosina: Bajos"],
        options: [
            { name: "Galactosemia", correct: false, feedback: "Afectaría metabolismo de galactosa." },
            { name: "Fenilcetonuria (PKU)", correct: true },
            { name: "Diabetes Tipo 2", correct: false, feedback: "Rara en neonatos." }
        ],
        explanation: "Deficiencia de fenilalanina hidroxilasa. Requiere dieta estricta."
    }
];

let currentG3CaseIndex = 0;

window.startGame3 = function() {
    hideAllBio();
    document.getElementById('game3-container').classList.remove('hidden');
    document.getElementById('game3-container').classList.add('flex');
    document.getElementById('g3-end-modal').classList.add('hidden');
    currentG3CaseIndex = 0;
    loadG3Case();
};

function loadG3Case() {
    if (currentG3CaseIndex >= g3Cases.length) {
        document.getElementById('g3-end-modal').classList.remove('hidden');
        document.getElementById('g3-end-modal').classList.add('flex');
        triggerGameEffect('win');
        return;
    }

    const currentCase = g3Cases[currentG3CaseIndex];
    document.getElementById('g3-patient-name').textContent = `Paciente: ${currentCase.patient}`;
    document.getElementById('g3-symptoms').textContent = `Síntomas: ${currentCase.symptoms}`;
    
    const labsList = document.getElementById('g3-lab-results');
    labsList.innerHTML = '';
    currentCase.labs.forEach(lab => {
        const li = document.createElement('li');
        li.textContent = lab;
        labsList.appendChild(li);
    });

    const diagnosesContainer = document.getElementById('g3-diagnoses');
    diagnosesContainer.innerHTML = '';
    
    currentCase.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "bio-diagnosis-btn bg-white/60 p-4 rounded-[20px] text-left font-bold text-slate-700 shadow-sm w-full";
        btn.textContent = opt.name;
        btn.onclick = () => checkDiagnosisG3(opt, btn);
        diagnosesContainer.appendChild(btn);
    });

    document.getElementById('g3-feedback').classList.add('hidden');
    document.getElementById('g3-next-btn').classList.add('hidden');
}

function checkDiagnosisG3(option, btn) {
    const buttons = document.getElementById('g3-diagnoses').querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);
    const feedbackDiv = document.getElementById('g3-feedback');
    feedbackDiv.classList.remove('hidden');

    if (option.correct) {
        btn.classList.add('bg-green-100', 'border-green-400', 'text-green-800');
        feedbackDiv.className = 'mt-6 p-4 rounded-2xl font-bold text-center bg-green-100 text-green-800 border border-green-400 shadow-sm';
        feedbackDiv.innerHTML = `¡Diagnóstico Correcto!<br><span class="font-medium text-sm block mt-2 opacity-80">${g3Cases[currentG3CaseIndex].explanation}</span>`;
        document.getElementById('g3-next-btn').classList.remove('hidden');
    } else {
        btn.classList.add('bg-red-100', 'border-red-400', 'text-red-800');
        feedbackDiv.className = 'mt-6 p-4 rounded-2xl font-bold text-center bg-red-100 text-red-800 border border-red-400 shadow-sm';
        feedbackDiv.innerHTML = `Incorrecto.<br><span class="font-medium text-sm block mt-2 opacity-80">${option.feedback}</span>`;
        
        setTimeout(() => {
            feedbackDiv.classList.add('hidden');
            btn.classList.remove('bg-red-100', 'border-red-400', 'text-red-800');
            buttons.forEach(b => b.disabled = false);
        }, 2500);
    }
}

window.nextCaseG3 = function() {
    currentG3CaseIndex++;
    loadG3Case();
};

/* --- JUEGO 4: RUTAS METABÓLICAS (CONEXIÓN) --- */
const g4Pathways = [
    {
        name: "Glucólisis (Preparatoria)",
        sequence: ["Glucosa", "Glucosa-6-P", "Fructosa-6-P", "Fructosa-1,6-biP"]
    }
];

let currentG4PathwayIndex = 0;
let expectedIndexG4 = 0;

window.startGame4 = function() {
    hideAllBio();
    document.getElementById('game4-container').classList.remove('hidden');
    document.getElementById('game4-container').classList.add('flex');
    document.getElementById('g4-end-modal').classList.add('hidden');
    currentG4PathwayIndex = 0;
    loadG4Pathway();
};

function loadG4Pathway() {
    if (currentG4PathwayIndex >= g4Pathways.length) {
        document.getElementById('g4-end-modal').classList.remove('hidden');
        document.getElementById('g4-end-modal').classList.add('flex');
        document.getElementById('g4-end-msg').textContent = "¡Dominaste las rutas metabólicas!";
        document.getElementById('g4-next-btn-modal').classList.add('hidden');
        triggerGameEffect('win');
        return;
    }

    expectedIndexG4 = 0;
    const currentPathway = g4Pathways[currentG4PathwayIndex];
    document.getElementById('g4-pathway-name').textContent = currentPathway.name;
    document.getElementById('g4-ordered-list').innerHTML = '';
    
    const bankContainer = document.getElementById('g4-bank');
    bankContainer.innerHTML = '';

    let shuffled = [...currentPathway.sequence].sort(() => Math.random() - 0.5);

    shuffled.forEach(metabolite => {
        const btn = document.createElement('button');
        btn.className = "bio-metabolite-btn px-5 py-2.5 bg-white/70 border border-white/80 rounded-full shadow-sm text-[0.95rem] font-bold text-slate-700 hover:bg-white";
        btn.textContent = metabolite;
        btn.onclick = () => selectMetaboliteG4(metabolite, btn);
        bankContainer.appendChild(btn);
    });
}

function selectMetaboliteG4(metaboliteName, btn) {
    if (btn.classList.contains('correct')) return; 

    const currentPathway = g4Pathways[currentG4PathwayIndex];
    const expectedMetabolite = currentPathway.sequence[expectedIndexG4];

    if (metaboliteName === expectedMetabolite) {
        btn.classList.add('correct');
        btn.disabled = true;

        const list = document.getElementById('g4-ordered-list');
        if (expectedIndexG4 > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'text-white font-bold my-1 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/40 shadow-sm';
            arrow.innerHTML = '↓';
            list.appendChild(arrow);
        }

        const node = document.createElement('div');
        node.className = 'w-full max-w-xs bg-white/80 border border-white text-slate-800 font-bold p-3.5 rounded-[20px] text-center shadow-md animate-fade-in';
        node.textContent = metaboliteName;
        list.appendChild(node);

        expectedIndexG4++;
        if (expectedIndexG4 === currentPathway.sequence.length) {
            setTimeout(() => {
                document.getElementById('g4-end-modal').classList.remove('hidden');
                document.getElementById('g4-end-modal').classList.add('flex');
                triggerGameEffect('win');
            }, 500);
        }
    } else {
        btn.classList.add('incorrect');
        setTimeout(() => btn.classList.remove('incorrect'), 500);
    }
}

window.resetPathwayG4 = function() { loadG4Pathway(); };
window.nextPathwayG4 = function() {
    document.getElementById('g4-end-modal').classList.add('hidden');
    currentG4PathwayIndex++;
    loadG4Pathway();
};

/* --- JUEGO 5: SIMULADOR DE HOMEOSTASIS --- */
let g5Interval, g5TimerInterval;
let g5TimeElapsed = 0;
let g5IsPlaying = false;

let parameters = {
    glucose: { val: 90, min: 20, max: 200, drift: 0 },
    ph: { val: 7.4, min: 7.0, max: 7.8, drift: 0 },
    o2: { val: 98, min: 50, max: 100, drift: 0 }
};

const g5Events = [
    { text: "El paciente comió pastel (alto en carbohidratos).", effect: () => parameters.glucose.drift = 2.5 },
    { text: "El paciente está hiperventilando (pánico).", effect: () => { parameters.ph.drift = 0.02; parameters.o2.drift = 0.5; } },
    { text: "Ataque de asma severo.", effect: () => parameters.o2.drift = -3 }
];

window.startGame5 = function() {
    hideAllBio();
    document.getElementById('game5-container').classList.remove('hidden');
    document.getElementById('game5-container').classList.add('flex');
    document.getElementById('g5-end-modal').classList.add('hidden');
    
    parameters.glucose = { val: 90, min: 20, max: 200, drift: -0.1 }; 
    parameters.ph = { val: 7.4, min: 7.0, max: 7.8, drift: 0 };
    parameters.o2 = { val: 98, min: 50, max: 100, drift: -0.2 };

    g5TimeElapsed = 0;
    updateG5UI();
    document.getElementById('g5-event-text').textContent = "Paciente estable.";
    
    g5IsPlaying = true;
    g5Interval = setInterval(game5Loop, 1000);
    
    g5TimerInterval = setInterval(() => {
        if(g5IsPlaying) {
            g5TimeElapsed++;
            const mins = Math.floor(g5TimeElapsed / 60).toString().padStart(2, '0');
            const secs = (g5TimeElapsed % 60).toString().padStart(2, '0');
            document.getElementById('g5-timer').textContent = `Tiempo: ${mins}:${secs}`;
        }
    }, 1000);

    setTimeout(triggerRandomEventG5, 5000);
};

window.stopGame5 = function() {
    g5IsPlaying = false;
    clearInterval(g5Interval);
    clearInterval(g5TimerInterval);
};

function triggerRandomEventG5() {
    if (!g5IsPlaying) return;
    
    parameters.glucose.drift = -0.2;
    parameters.ph.drift = 0;
    parameters.o2.drift = -0.1;

    const ev = g5Events[Math.floor(Math.random() * g5Events.length)];
    document.getElementById('g5-event-text').textContent = ev.text;
    
    ev.effect();
    setTimeout(triggerRandomEventG5, 10000 + Math.random() * 10000);
}

function game5Loop() {
    if (!g5IsPlaying) return;
    parameters.glucose.val += parameters.glucose.drift;
    parameters.ph.val += parameters.ph.drift;
    parameters.o2.val += parameters.o2.drift;

    parameters.glucose.val = Math.max(parameters.glucose.min, Math.min(parameters.glucose.max, parameters.glucose.val));
    parameters.ph.val = Math.max(parameters.ph.min, Math.min(parameters.ph.max, parameters.ph.val));
    parameters.o2.val = Math.max(parameters.o2.min, Math.min(parameters.o2.max, parameters.o2.val));

    updateG5UI();
    checkG5Defeat();
}

function updateG5UI() {
    const gVal = parameters.glucose.val;
    document.getElementById('g5-val-glucose').textContent = `${Math.round(gVal)}`;
    document.getElementById('g5-bar-glucose').style.width = `${(gVal / parameters.glucose.max) * 100}%`;
    setBarColor(document.getElementById('g5-bar-glucose'), gVal, 70, 140);

    const pVal = parameters.ph.val;
    document.getElementById('g5-val-ph').textContent = pVal.toFixed(2);
    document.getElementById('g5-bar-ph').style.width = `${((pVal - 7.0) / 0.8) * 100}%`;
    setBarColor(document.getElementById('g5-bar-ph'), pVal, 7.35, 7.45);

    const oVal = parameters.o2.val;
    document.getElementById('g5-val-o2').textContent = `${Math.round(oVal)}%`;
    document.getElementById('g5-bar-o2').style.width = `${((oVal - 50) / 50) * 100}%`;
    setBarColor(document.getElementById('g5-bar-o2'), oVal, 90, 100);
}

function setBarColor(bar, val, min, max) {
    bar.className = 'bio-meter-fill'; 
    if (val < min || val > max) bar.classList.add(val < min - (min*0.1) || val > max + (max*0.1) ? 'bg-red-500' : 'bg-yellow-500');
    else bar.classList.add('bg-green-500');
}

window.applyTreatmentG5 = function(type) {
    if (!g5IsPlaying) return;
    if(type === 'insulina') { parameters.glucose.val -= 15; parameters.glucose.drift = -1.5; }
    if(type === 'glucagon') { parameters.glucose.val += 20; parameters.glucose.drift = 1; }
    if(type === 'bicarbonato') { parameters.ph.val += 0.05; parameters.ph.drift = 0.01; }
    if(type === 'oxigeno') { parameters.o2.val += 10; parameters.o2.drift = 1; }
    updateG5UI();
};

function checkG5Defeat() {
    if (parameters.glucose.val <= parameters.glucose.min || parameters.glucose.val >= parameters.glucose.max ||
        parameters.ph.val <= parameters.ph.min || parameters.ph.val >= parameters.ph.max ||
        parameters.o2.val <= parameters.o2.min) {
        
        stopGame5();
        triggerGameEffect('lose');
        const modal = document.getElementById('g5-end-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        const mins = Math.floor(g5TimeElapsed / 60).toString().padStart(2, '0');
        const secs = (g5TimeElapsed % 60).toString().padStart(2, '0');
        document.getElementById('g5-end-time').textContent = `${mins}:${secs}`;
        document.getElementById('g5-end-msg').textContent = "Pérdida crítica de homeostasis.";
    }
}

window.triggerGameEffect = function(type) {
    const effectClass = type === 'win' ? 'body-win-effect' : 'body-lose-effect';
    
    document.body.classList.remove('body-win-effect', 'body-lose-effect');
    
    void document.body.offsetWidth;
    
    document.body.classList.add(effectClass);
    
    setTimeout(() => {
        document.body.classList.remove(effectClass);
    }, 5000);
};

/* ---------------------------------------------------- Tarjetas de Preguntas Dinámicas ------------------------------------------------ */

const PREGUNTAS_DATA = [
    {
        pregunta: '¿Qué estructuras especializadas utilizan las sinapsis eléctricas para crear conexiones físicas directas entre las membranas presináptica y posináptica permitiendo un flujo rápido de iones?',
        respuesta: 'Utilizan las uniones en hendidura'
    },
    {
        pregunta: '¿Cuál es el epitelio especializado que recubre las vías urinarias y tiene la capacidad de distenderse?',
        respuesta: 'El urotelio o epitelio de transición'
    },
    {
        pregunta: '¿Qué tipo de colágeno es el componente principal de la lámina basal en el corpúsculo renal?',
        respuesta: 'Colágeno tipo IV'
    }
];

let currentPreguntaIdx = 0;

function renderPreguntaCard() {
    const container = document.getElementById('preguntas-dinamicas-container');
    if (!container) return;

    const data = PREGUNTAS_DATA[currentPreguntaIdx];

    // Se utiliza flex-row para alinear la tarjeta de texto y el botón lateral
    container.innerHTML = `
        <div class="flex items-stretch gap-3 md:gap-4 w-full h-full animate-fade-in">
            
            <!-- Bloque de Texto (Pregunta y Respuesta) -->
            <div class="flex-1 histologia-inner-bg rounded-[30px] p-6 md:p-8 flex flex-col justify-center shadow-sm border border-white/30 transition-colors duration-500">
                <p class="text-base md:text-lg font-bold text-[var(--black-color)] leading-snug mb-4 transition-colors duration-500">
                    ${data.pregunta}
                </p>
                <p class="text-sm md:text-base text-[var(--black-color)] opacity-85 font-medium transition-colors duration-500">
                    ${data.respuesta}
                </p>
            </div>
            
            <!-- Botón de Siguiente -->
            <button onclick="nextPregunta()" class="w-16 md:w-24 shrink-0 bg-[var(--card-blue-color)] rounded-[35px] md:rounded-[40px] flex items-center justify-center hover:scale-[1.03] transition-all shadow-sm border border-white/20 duration-500 group">
                <span class="material-symbols-outlined text-[32px] md:text-[40px] text-[var(--black-color)] group-hover:translate-x-1 transition-transform duration-300">
                    chevron_right
                </span>
            </button>
            
        </div>
    `;
}

// Función global para avanzar a la siguiente pregunta
window.nextPregunta = function() {
    currentPreguntaIdx = (currentPreguntaIdx + 1) % PREGUNTAS_DATA.length;
    renderPreguntaCard();
};

// Inicializar la primera pregunta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderPreguntaCard();
});

/* ---------------------------------------------------- Switch (Píldoras de Tema Multiplataforma) ------------------------------------------------ */
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.body.classList.add('alt-theme');
    updateThemeColor();
}

function enableLightMode() {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('alt-theme');
    updateThemeColor();
}

function saveUserPreference(isDarkMode) {
    localStorage.setItem('isDarkMode', isDarkMode);
}

function loadUserPreference() {
    return localStorage.getItem('isDarkMode') === 'true';
}

function applySystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    if (loadUserPreference() === null) { 
        const isDark = e.matches;
        if (isDark) enableDarkMode(); else enableLightMode();
        updateThemeIcons(isDark);
    }
});

// ACTUALIZA TODOS LOS ICONOS AUTOMÁTICAMENTE (MÓVIL Y DESKTOP)
function updateThemeIcons(isDark) {
    const themeIcons = document.querySelectorAll(".theme-icon");
    themeIcons.forEach(icon => {
        if (isDark) {
            icon.className = "theme-icon ri-moon-clear-fill"; // Cambia a Luna
            icon.style.transform = "rotate(360deg)";         // Efecto de giro
        } else {
            icon.className = "theme-icon ri-sun-fill";        // Cambia a Sol
            icon.style.transform = "rotate(0deg)";
        }
    });
}

// ESCUCHA EL CLIC EN CUALQUIERA DE LAS DOS PÍLDORAS
function setupThemeButtons() {
    const themeButtons = document.querySelectorAll(".theme-toggle-trigger");

    themeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const isDark = document.body.classList.contains('dark-mode');
            
            if (isDark) {
                enableLightMode();
                saveUserPreference(false);
                updateThemeIcons(false);
            } else {
                enableDarkMode();
                saveUserPreference(true);
                updateThemeIcons(true);
            }

            if (typeof updatePDFThumbnails === "function") {
                updatePDFThumbnails();
            }
        });
    });
}

function initializeMode() {
    const userPreference = loadUserPreference();

    if (userPreference !== null) {
        if (userPreference) {
            enableDarkMode();
            updateThemeIcons(true);
        } else {
            enableLightMode();
            updateThemeIcons(false);
        }
    } else {
        applySystemPreference();
        const isDarkSystem = document.body.classList.contains('dark-mode');
        updateThemeIcons(isDarkSystem);
    }
    
    setupThemeButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMode();
});

function updateThemeColor() {
    const statusBarColor = getComputedStyle(document.body)
        .getPropertyValue('--status-bar-color')
        .trim();

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor && statusBarColor) {
        metaThemeColor.setAttribute('content', statusBarColor);
    }
}