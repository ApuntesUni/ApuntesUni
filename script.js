// script.js

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

// 5. Funciones de Renderizado
function renderDesarrolloView() {
    const data = GUTS_DATA[activeTab];
    
    const derivativesHtml = data.derivatives.map(item => `
        <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-2 flex-shrink-0"></div>
            <span class="text-slate-700 font-medium">${item}</span>
        </li>
    `).join('');

    const buttonsHtml = Object.values(GUTS_DATA).map(gut => {
        const isActive = activeTab === gut.id;
        return `
            <button onclick="setActiveTab('${gut.id}')" class="flex items-center justify-between p-3 rounded-xl border transition-all w-full text-left ${isActive ? `border-[${gut.colorHex}] bg-white/60 shadow-md backdrop-blur-sm` : 'border-white/50 hover:border-white/80 bg-white/30 backdrop-blur-sm'}">
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full mr-3 ${gut.color}"></div>
                    <span class="font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}">${gut.title}</span>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500'}"></i>
            </button>
        `;
    }).join('');

    contentDiv.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div class="space-y-6">
                <!-- Modelo de Maqueta (PrimitiveGutModel) -->
                <div class="w-full h-64 bg-slate-800 rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center p-4">
                    <div class="absolute inset-0 opacity-20 pointer-events-none pattern-grid"></div>
                    <div class="relative w-full max-w-sm h-full flex flex-col items-center justify-center space-y-2">
                        <!-- Anterior -->
                        <div class="transition-all duration-500 rounded-t-3xl w-16 flex flex-col items-center justify-start relative ${activeTab === 'anterior' ? 'bg-blue-400 h-24 scale-110 z-10 shadow-[0_0_15px_rgba(96,165,250,0.7)]' : 'bg-blue-900/50 h-16 opacity-50'}">
                            <div class="text-[10px] font-bold text-white mt-1 absolute -right-24">I. Anterior</div>
                            <div class="w-4 h-4 rounded-full bg-red-400 absolute bottom-0 -right-2 transition-opacity ${activeTab === 'anterior' ? 'opacity-100' : 'opacity-0'}"></div>
                            <div class="w-8 h-10 rounded-full bg-blue-300 absolute top-4 -left-4 transform rotate-12 transition-opacity ${activeTab === 'anterior' ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>
                        <!-- Medio -->
                        <div class="transition-all duration-500 w-12 flex flex-col items-center justify-center relative ${activeTab === 'medio' ? 'bg-yellow-400 h-24 scale-110 z-10 shadow-[0_0_15px_rgba(250,204,21,0.7)]' : 'bg-yellow-900/50 h-16 opacity-50'}">
                            <div class="text-[10px] font-bold text-white absolute -right-24">I. Medio</div>
                            ${activeTab === 'medio' ? `
                                <svg class="absolute -left-12 top-4 w-24 h-16 overflow-visible" viewBox="0 0 100 50">
                                    <path d="M 50,0 C 10,0 10,50 50,50" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round" />
                                    <line x1="15" y1="25" x2="-10" y2="25" stroke="#facc15" stroke-width="4" />
                                </svg>
                            ` : ''}
                        </div>
                        <!-- Posterior -->
                        <div class="transition-all duration-500 rounded-b-3xl w-16 flex flex-col items-end justify-end relative ${activeTab === 'posterior' ? 'bg-green-400 h-20 scale-110 z-10 shadow-[0_0_15px_rgba(74,222,128,0.7)]' : 'bg-green-900/50 h-12 opacity-50'}">
                            <div class="text-[10px] font-bold text-white mb-2 absolute -right-28">I. Posterior</div>
                            <div class="w-20 h-8 rounded-b-3xl bg-green-300 absolute -bottom-2 -left-2 transition-opacity ${activeTab === 'posterior' ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col space-y-2">
                    <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Selecciona un segmento:</h3>
                    ${buttonsHtml}
                </div>
            </div>

            <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 h-full">
                <div class="flex items-center mb-4">
                    <div class="w-6 h-6 rounded-full mr-3 shadow-md ${data.color}"></div>
                    <h2 class="text-2xl font-bold text-slate-800">${data.title}</h2>
                </div>
                <p class="text-slate-600 mb-6 leading-relaxed">${data.description}</p>
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                        <i data-lucide="arrow-right" class="w-4 h-4 mr-2 text-indigo-500"></i>
                        Derivados Principales
                    </h3>
                    <ul class="grid grid-cols-1 gap-2">${derivativesHtml}</ul>
                </div>
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h3 class="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-2">Detalles del Desarrollo</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${data.details}</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderMalformacionesView() {
    const malformationsHtml = MALFORMATIONS.map((section, sIdx) => `
        <div class="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div class="bg-white/30 px-4 py-3 border-b border-white/50">
                <h3 class="font-bold text-slate-800">${section.region}</h3>
            </div>
            <div class="p-4 flex-grow grid grid-cols-1 gap-4">
                ${section.anomalies.map((anomaly, aIdx) => `
                    <div class="group border border-white/50 p-3 rounded-xl anomaly-card-hover bg-white/50 shadow-sm hover:shadow-md backdrop-blur-sm" onclick="openModal(${sIdx}, ${aIdx})">
                        <div class="flex items-start gap-4">
                            <div class="w-16 h-16 rounded-lg bg-white/40 border border-white/60 overflow-hidden flex-shrink-0 shadow-inner">
                                <img src="${anomaly.img}" alt="${anomaly.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                            </div>
                            <div>
                                <h4 class="text-rose-600 font-semibold text-sm mb-1 group-hover:text-rose-700 transition-colors flex items-center gap-1">
                                    ${anomaly.name} <i data-lucide="expand" class="w-3 h-3 opacity-50 group-hover:opacity-100"></i>
                                </h4>
                                <p class="text-slate-700 text-sm line-clamp-2">
                                    ${anomaly.description}
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    contentDiv.innerHTML = `
        <div class="space-y-8 animate-fade-in">
            <div class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg mb-4 flex items-start gap-3">
                <i data-lucide="info" class="w-5 h-5 text-rose-600 mt-0.5"></i>
                <p class="text-rose-800 text-sm font-medium">
                    Haz clic en cualquier patología para abrir el visor interactivo y el modelo 3D representativo.
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${malformationsHtml}
            </div>
        </div>
    `;
    lucide.createIcons();
}

// 6. Lógica del Modal y Three.js
let currentAnimationId = null;
let currentScene = null;
let currentRenderer = null;

window.openModal = function(sectionIdx, anomalyIdx) {
    const anomaly = MALFORMATIONS[sectionIdx].anomalies[anomalyIdx];
    
    // Rellenar datos del modal
    document.getElementById('modal-title').innerText = anomaly.name;
    document.getElementById('modal-desc').innerText = anomaly.description;
    document.getElementById('modal-img').src = anomaly.img;
    
    // Mostrar modal con animación
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
        // Limpiar Three.js para liberar memoria
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
    
    // Configuración básica de la escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b); // slate-800

    // Cámara
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    // Renderizador
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
    if (viewMode === 'desarrollo') {
        btnDesarrollo.className = "flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center transition-colors bg-white text-indigo-700 border-b-2 border-indigo-700";
        btnMalformaciones.className = "flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700 hover:bg-slate-100";
        renderDesarrolloView();
    } else {
        btnMalformaciones.className = "flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center transition-colors bg-white text-rose-600 border-b-2 border-rose-600";
        btnDesarrollo.className = "flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700 hover:bg-slate-100";
        renderMalformacionesView();
    }
}

window.setActiveTab = function(tabId) {
    activeTab = tabId;
    if (viewMode === 'desarrollo') renderDesarrolloView();
};

btnDesarrollo.addEventListener('click', () => {
    viewMode = 'desarrollo';
    updateNavUI();
});

btnMalformaciones.addEventListener('click', () => {
    viewMode = 'malformaciones';
    updateNavUI();
});

// 8. Inicialización
updateNavUI();
lucide.createIcons();