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

/* ---------------------------------------------------- Tarjetas Apiladas Dinámicas (Embriología) ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('embrio-multitask-deck');
    if (!deck) return;

    const embrioCardsData = [
        {
            frontBg: 'var(--card-blue-color)',
            iconBg: 'bg-blue-500',
            icon: 'biotech',
            badgeText: 'Ciclo Celular',
            cardNumber: 'Tarjeta #01',
            frontColorText: 'text-blue-600 dark:text-blue-400',
            titleFront: 'Puntos de Control ($G_{1}/S$)',
            objective: 'Regular la transición y síntesis de ADN.',
            frontFooterText: 'Toca para ver el mecanismo',
            frontFooterColor: 'text-blue-700 dark:text-blue-300',
            
            backBg: 'var(--card-green-color)',
            backBadgeColor: 'text-emerald-600 dark:text-emerald-400',
            backBadgeText: 'Mecanismo',
            titleBack: 'Proteína Rb y Factor E2F',
            backContentHtml: `
                <div>La proteína Retinoblastoma (Rb) en estado hipofosforilado inhibe al factor E2F.</div>
                <div class="text-emerald-700 dark:text-emerald-300 font-bold">Su hiperfosforilación por complejos Cdk4/6-Ciclina D libera a E2F.</div>
            `,
            backFooterHtml: 'Esto activa la transcripción de genes necesarios para entrar a la fase S.'
        },
        {
            frontBg: 'var(--card-pick-color)',
            iconBg: 'bg-fuchsia-500',
            icon: 'egg',
            badgeText: 'Fecundación',
            cardNumber: 'Tarjeta #02',
            frontColorText: 'text-fuchsia-600 dark:text-fuchsia-400',
            titleFront: 'Prevención de Polispermia',
            objective: null, // Si es null, no renderiza la caja de objetivo
            frontFooterText: 'Toca para ver los bloqueos',
            frontFooterColor: 'text-fuchsia-700 dark:text-fuchsia-300',
            
            backBg: 'var(--card-yellow-color)',
            backBadgeColor: 'text-amber-600 dark:text-amber-400',
            backBadgeText: 'Bloqueo Rápido y Lento',
            titleBack: 'Mecanismos Eléctricos y Corticales',
            backContentHtml: `
                <div><strong>Eléctrico:</strong> Despolarización rápida por influjo de Na+.</div>
                <div class="text-amber-700 dark:text-amber-300 font-bold"><strong>Reacción Cortical:</strong> Exocitosis inactiva receptores ZP2 y ZP3.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-blue-color)', iconBg: 'bg-blue-500', icon: 'biotech',
            badgeText: 'Ciclo Celular', cardNumber: 'Tarjeta #01',
            frontColorText: 'text-blue-600 dark:text-blue-400',
            titleFront: 'Puntos de Control ($G_{1}/S$)',
            objective: 'Regular la transición y síntesis de ADN.',
            frontFooterText: 'Toca para ver el mecanismo', frontFooterColor: 'text-blue-700 dark:text-blue-300',
            backBg: 'var(--card-green-color)', backBadgeColor: 'text-emerald-600 dark:text-emerald-400',
            backBadgeText: 'Mecanismo', titleBack: 'Proteína Rb y Factor E2F',
            backContentHtml: `
                <div>La proteína Retinoblastoma (Rb) en estado hipofosforilado inhibe al factor E2F.</div>
                <div class="text-emerald-700 dark:text-emerald-300 font-bold">Su hiperfosforilación por complejos Cdk4/6-Ciclina D libera a E2F.</div>
            `,
            backFooterHtml: 'Activa la transcripción de genes necesarios para la fase S.'
        },
        {
            frontBg: 'var(--card-pick-color)', iconBg: 'bg-fuchsia-500', icon: 'egg',
            badgeText: 'Fecundación', cardNumber: 'Tarjeta #02',
            frontColorText: 'text-fuchsia-600 dark:text-fuchsia-400',
            titleFront: 'Prevención de Polispermia',
            objective: 'Evitar la fecundación por múltiples espermatozoides.',
            frontFooterText: 'Toca para ver los bloqueos', frontFooterColor: 'text-fuchsia-700 dark:text-fuchsia-300',
            backBg: 'var(--card-yellow-color)', backBadgeColor: 'text-amber-600 dark:text-amber-400',
            backBadgeText: 'Bloqueo Rápido y Lento', titleBack: 'Mecanismos Eléctricos y Corticales',
            backContentHtml: `
                <div><strong>Eléctrico:</strong> Despolarización rápida por influjo de Na+.</div>
                <div class="text-amber-700 dark:text-amber-300 font-bold"><strong>Reacción Cortical:</strong> Exocitosis inactiva receptores ZP2 y ZP3.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-green-color)', iconBg: 'bg-emerald-500', icon: 'account_tree',
            badgeText: 'Desarrollo Placentario', cardNumber: 'Tarjeta #03',
            frontColorText: 'text-emerald-600 dark:text-emerald-400',
            titleFront: 'Diferenciación del Trofoblasto',
            objective: 'Comprender la formación inicial de la placenta y síntesis hormonal.',
            frontFooterText: 'Toca para ver el proceso', frontFooterColor: 'text-emerald-700 dark:text-emerald-300',
            backBg: 'var(--card-blue-color)', backBadgeColor: 'text-blue-600 dark:text-blue-400',
            backBadgeText: 'Proceso', titleBack: 'Cito y Sincitiotrofoblasto',
            backContentHtml: `
                <div><strong>Citotrofoblasto:</strong> Capa interna con alta tasa mitótica.</div>
                <div class="text-blue-700 dark:text-blue-300 font-bold"><strong>Sincitiotrofoblasto:</strong> Capa externa multinucleada; secreta metaloproteinasas y sintetiza la β-hCG.</div>
            `,
            backFooterHtml: 'Permite la invasión del endometrio y el mantenimiento del cuerpo lúteo.'
        },
        {
            frontBg: 'var(--card-yellow-color)', iconBg: 'bg-amber-500', icon: 'layers',
            badgeText: 'Organogénesis', cardNumber: 'Tarjeta #04',
            frontColorText: 'text-amber-600 dark:text-amber-400',
            titleFront: 'Derivados del Mesodermo',
            objective: 'Conocer el origen embrionario de los tejidos.',
            frontFooterText: 'Toca para ver la clasificación', frontFooterColor: 'text-amber-700 dark:text-amber-300',
            backBg: 'var(--card-pick-color)', backBadgeColor: 'text-fuchsia-600 dark:text-fuchsia-400',
            backBadgeText: 'Clasificación', titleBack: 'Axial, Paraxial, Intermedio y Lateral',
            backContentHtml: `
                <div><strong>Axial:</strong> Notocorda. <strong>Paraxial:</strong> Somitas (dermis, músculo, esqueleto).</div>
                <div class="text-fuchsia-700 dark:text-fuchsia-300 font-bold"><strong>Intermedio:</strong> Sist. urogenital. <strong>Lateral:</strong> Hoja somática (pared) y esplácnica (estroma visceral/cardiovascular).</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-blue-color)', iconBg: 'bg-blue-500', icon: 'pregnant_woman',
            badgeText: 'Patología Congénita', cardNumber: 'Tarjeta #05',
            frontColorText: 'text-blue-600 dark:text-blue-400',
            titleFront: 'Embriopatía por PKU Materna',
            objective: 'Identificar el impacto de niveles altos de fenilalanina en el desarrollo.',
            frontFooterText: 'Toca para ver el impacto fetal', frontFooterColor: 'text-blue-700 dark:text-blue-300',
            backBg: 'var(--card-green-color)', backBadgeColor: 'text-emerald-600 dark:text-emerald-400',
            backBadgeText: 'Impacto Fetal', titleBack: 'Daño Neurológico y Cardíaco',
            backContentHtml: `
                <div>Cruza la placenta por transporte activo, inhibiendo la síntesis de mielina fetal.</div>
                <div class="text-emerald-700 dark:text-emerald-300 font-bold">Causa microcefalia, restricción del crecimiento intrauterino (RCIU) y cardiopatías conotruncales.</div>
            `,
            backFooterHtml: 'Requiere control nutricional estricto materno previo y durante el embarazo.'
        },
        {
            frontBg: 'var(--card-pick-color)', iconBg: 'bg-fuchsia-500', icon: 'air',
            badgeText: 'Fisiología Neonatal', cardNumber: 'Tarjeta #06',
            frontColorText: 'text-fuchsia-600 dark:text-fuchsia-400',
            titleFront: 'Transición a Circulación Neonatal',
            objective: 'Entender los cambios vasculares al momento del nacimiento.',
            frontFooterText: 'Toca para ver los cambios', frontFooterColor: 'text-fuchsia-700 dark:text-fuchsia-300',
            backBg: 'var(--card-yellow-color)', backBadgeColor: 'text-amber-600 dark:text-amber-400',
            backBadgeText: 'Cambios Fisiológicos', titleBack: 'Cierre de Conductos',
            backContentHtml: `
                <div>La ventilación disminuye la resistencia vascular pulmonar.</div>
                <div class="text-amber-700 dark:text-amber-300 font-bold">El aumento del retorno venoso cierra el foramen oval. El aumento de O₂ y caída de prostaglandinas cierran el conducto arterioso.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-green-color)', iconBg: 'bg-emerald-500', icon: 'water_drop',
            badgeText: 'Desarrollo Renal', cardNumber: 'Tarjeta #07',
            frontColorText: 'text-emerald-600 dark:text-emerald-400',
            titleFront: 'Desarrollo del Metanefros',
            objective: 'Analizar la interacción epitelio-mesénquima renal.',
            frontFooterText: 'Toca para ver el proceso', frontFooterColor: 'text-emerald-700 dark:text-emerald-300',
            backBg: 'var(--card-blue-color)', backBadgeColor: 'text-blue-600 dark:text-blue-400',
            backBadgeText: 'Interacción', titleBack: 'Yema Ureteral y Blastema',
            backContentHtml: `
                <div><strong>Yema ureteral (RET+):</strong> Forma el sistema colector (uréter, pelvis, cálices).</div>
                <div class="text-blue-700 dark:text-blue-300 font-bold"><strong>Blastema metanéfrico:</strong> Inducido por la yema para formar las nefronas (del glomérulo al TCD).</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-yellow-color)', iconBg: 'bg-amber-500', icon: 'pulmonology',
            badgeText: 'Fisiología Respiratoria', cardNumber: 'Tarjeta #08',
            frontColorText: 'text-amber-600 dark:text-amber-400',
            titleFront: 'Factor Surfactante Pulmonar',
            objective: 'Comprender la biofísica que evita el colapso alveolar.',
            frontFooterText: 'Toca para ver la función', frontFooterColor: 'text-amber-700 dark:text-amber-300',
            backBg: 'var(--card-pick-color)', backBadgeColor: 'text-fuchsia-600 dark:text-fuchsia-400',
            backBadgeText: 'Función Biofísica', titleBack: 'Neumocitos II y Tensión Superficial',
            backContentHtml: `
                <div>Sintetizado por neumocitos tipo II (dipalmitoilfosfatidilcolina).</div>
                <div class="text-fuchsia-700 dark:text-fuchsia-300 font-bold">Reduce la tensión superficial impidiendo la atelectasia espiratoria (según la Ley de Laplace).</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-blue-color)', iconBg: 'bg-blue-500', icon: 'science',
            badgeText: 'Metabolismo', cardNumber: 'Tarjeta #09',
            frontColorText: 'text-blue-600 dark:text-blue-400',
            titleFront: 'Ciclo de la Urea',
            objective: 'Identificar el mecanismo de eliminación del nitrógeno.',
            frontFooterText: 'Toca para ver la enzima clave', frontFooterColor: 'text-blue-700 dark:text-blue-300',
            backBg: 'var(--card-green-color)', backBadgeColor: 'text-emerald-600 dark:text-emerald-400',
            backBadgeText: 'Enzima Marcapasos', titleBack: 'Carbamilfosfato Sintetasa I (CPS-I)',
            backContentHtml: `
                <div>Enzima mitocondrial activada por el efector alostérico N-acetilglutamato.</div>
                <div class="text-emerald-700 dark:text-emerald-300 font-bold">Cataliza la conversión del amoníaco tóxico en urea neutra para su excreción renal.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-pick-color)', iconBg: 'bg-fuchsia-500', icon: 'bloodtype',
            badgeText: 'Nutrición Clínica', cardNumber: 'Tarjeta #10',
            frontColorText: 'text-fuchsia-600 dark:text-fuchsia-400',
            titleFront: 'Deficiencia de Cobalamina (B12)',
            objective: 'Reconocer las manifestaciones hematológicas y neurológicas.',
            frontFooterText: 'Toca para ver los síntomas', frontFooterColor: 'text-fuchsia-700 dark:text-fuchsia-300',
            backBg: 'var(--card-yellow-color)', backBadgeColor: 'text-amber-600 dark:text-amber-400',
            backBadgeText: 'Clínica', titleBack: 'Anemia y Daño Neurológico',
            backContentHtml: `
                <div>Provoca anemia megaloblástica y Degeneración Combinada Subaguda de la médula espinal.</div>
                <div class="text-amber-700 dark:text-amber-300 font-bold">Ocurre desmielinización progresiva por alteración de la enzima metilmalonil-CoA mutasa.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-green-color)', iconBg: 'bg-emerald-500', icon: 'monitor_heart',
            badgeText: 'Diagnóstico Clínico', cardNumber: 'Tarjeta #11',
            frontColorText: 'text-emerald-600 dark:text-emerald-400',
            titleFront: 'Síndrome Metabólico',
            objective: 'Conocer los parámetros diagnósticos.',
            frontFooterText: 'Toca para ver los criterios', frontFooterColor: 'text-emerald-700 dark:text-emerald-300',
            backBg: 'var(--card-blue-color)', backBadgeColor: 'text-blue-600 dark:text-blue-400',
            backBadgeText: 'Parámetros', titleBack: 'Requiere ≥ 3 factores',
            backContentHtml: `
                <div><strong>Cintura:</strong> >90cm(H) / >80cm(M). <strong>Triglicéridos:</strong> ≥150 mg/dL.</div>
                <div class="text-blue-700 dark:text-blue-300 font-bold"><strong>HDL:</strong> <40(H) / <50(M). <strong>PA:</strong> ≥130/85 mmHg. <strong>Glucosa:</strong> ≥100 mg/dL.</div>
            `,
            backFooterHtml: null
        },
        {
            frontBg: 'var(--card-yellow-color)', iconBg: 'bg-amber-500', icon: 'nutrition',
            badgeText: 'Terapia Nutricional', cardNumber: 'Tarjeta #12',
            frontColorText: 'text-amber-600 dark:text-amber-400',
            titleFront: 'Nutrición en Diálisis',
            objective: 'Ajustar el requerimiento proteico en terapia de reemplazo renal.',
            frontFooterText: 'Toca para ver el ajuste', frontFooterColor: 'text-amber-700 dark:text-amber-300',
            backBg: 'var(--card-pick-color)', backBadgeColor: 'text-fuchsia-600 dark:text-fuchsia-400',
            backBadgeText: 'Ajuste Proteico', titleBack: 'Incremento de Proteínas',
            backContentHtml: `
                <div>En pacientes con hemodiálisis o diálisis peritoneal, incrementar aporte proteico a <strong>1.2 g/kg/día</strong>.</div>
                <div class="text-fuchsia-700 dark:text-fuchsia-300 font-bold">Esto compensa la pérdida de aminoácidos a través del efluente dialítico y combate el estado inflamatorio.</div>
            `,
            backFooterHtml: null
        }
        
    ];

    deck.innerHTML = ''; // Limpiar por si acaso
    embrioCardsData.forEach((data, index) => {
        
        // Bloque opcional de objetivo en el frente
        const objectiveHtml = data.objective ? `
            <div class="mt-5 space-y-2 text-xs text-[var(--color-text-inactive)]">
                <div class="p-2.5 rounded-2xl bg-[var(--background-navigation)] border border-[var(--border-navigation)]">
                    <strong>Objetivo:</strong> ${data.objective}
                </div>
            </div>
        ` : '';

        // Bloque opcional de texto final en el reverso
        const backFooterNode = data.backFooterHtml ? `
            <p class="text-[11px] text-[var(--color-text-inactive)] leading-tight">
                ${data.backFooterHtml}
            </p>
        ` : '';

        const cardHTML = `
            <div class="apple-card-container" data-card-idx="${index}">
                <div class="apple-card-inner">
                    <!-- FRENTE -->
                    <div class="apple-card-face fisio-glass-card flex flex-col justify-between" style="background-color: ${data.frontBg};">
                        <div>
                            <div class="apple-card-header">
                                <div class="apple-app-badge">
                                    <div class="apple-app-icon ${data.iconBg}">
                                        <span class="material-symbols-outlined text-lg text-white">${data.icon}</span>
                                    </div>
                                    <span class="text-xs font-bold text-[var(--black-color)]">${data.badgeText}</span>
                                </div>
                                <div class="apple-flip-pill text-[var(--black-color)]">
                                    <span class="material-symbols-outlined text-xs">3d_rotation</span> Girar
                                </div>
                            </div>
                            <span class="text-[10px] font-black uppercase tracking-wider ${data.frontColorText}">${data.cardNumber}</span>
                            <h3 class="text-xl md:text-2xl font-black text-[var(--black-color)] mt-1 leading-snug">
                                ${data.titleFront}
                            </h3>
                            ${objectiveHtml}
                        </div>
                        <div class="pt-3 border-t border-[var(--border-navigation)] flex items-center justify-between text-[11px] font-bold ${data.frontFooterColor}">
                            <span>${data.frontFooterText}</span>
                            <span class="material-symbols-outlined text-sm">touch_app</span>
                        </div>
                    </div>
                    <!-- REVERSO -->
                    <div class="apple-card-face apple-card-back fisio-glass-card flex flex-col" style="background-color: ${data.backBg};">
                        <div>
                            <div class="apple-card-header">
                                <span class="text-[10px] font-black uppercase tracking-wider ${data.backBadgeColor}">${data.backBadgeText}</span>
                                <div class="apple-flip-pill text-[var(--black-color)]">
                                    <span class="material-symbols-outlined text-xs">undo</span> Volver
                                </div>
                            </div>
                            <h4 class="font-black text-sm text-[var(--black-color)]">${data.titleBack}</h4>
                            <div class="w-full my-3 p-3 rounded-2xl bg-[var(--background-navigation)] border border-[var(--border-navigation)] text-[11px] space-y-1.5 font-medium">
                                ${data.backContentHtml}
                            </div>
                            ${backFooterNode}
                        </div>
                    </div>
                </div>
            </div>
        `;
        deck.insertAdjacentHTML('beforeend', cardHTML);
    });

    const cards = deck.querySelectorAll('.apple-card-container');
    const btnPrev = document.getElementById('embrio-stack-prev');
    const btnNext = document.getElementById('embrio-stack-next');
    const counter = document.getElementById('embrio-stack-counter');
    const flipBtn = document.getElementById('embrio-stack-flip-active');
    const dock     = document.getElementById('embrio-stack-dock');

    let currentIndex = 0;

    if (dock) {
        dock.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'apple-dock-pill' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToCard(i);
            });
            dock.appendChild(dot);
        });
    }

    function updateEmbrioDeck() {
        const isMobile = window.innerWidth < 768;
        const spacingX = isMobile ? 120 : 190;
        const baseZ = -70;

        cards.forEach((card, idx) => {
            const offset = idx - currentIndex;
            const absOffset = Math.abs(offset);

            let tx = 0, tz = 0, ry = 0, scale = 1, opacity = 1, zIndex = 30 - absOffset, blurPx = 0;

            if (offset === 0) {
                tx = 0; tz = 0; ry = 0; scale = 1; opacity = 1; zIndex = 35; blurPx = 0;
                card.style.pointerEvents = 'auto';
            } else if (offset > 0) {
                if (offset === 1) {
                    tx = spacingX; tz = baseZ; ry = -9; scale = 0.90; opacity = 0.88;
                } else if (offset === 2) {
                    tx = spacingX * 1.75; tz = baseZ * 2; ry = -14; scale = 0.80; opacity = 0.60; blurPx = 0.5;
                } else {
                    tx = spacingX * 1.75 + (offset - 2) * (isMobile ? 35 : 55);
                    tz = baseZ * 2 + (offset - 2) * -50;
                    ry = -18;
                    scale = Math.max(0.65, 0.80 - (offset - 2) * 0.05);
                    opacity = Math.max(0, 0.35 - (offset - 3) * 0.12);
                    blurPx = 1.5;
                }
            } else {
                const L = absOffset;
                if (L === 1) {
                    tx = -spacingX; tz = baseZ; ry = 9; scale = 0.90; opacity = 0.88;
                } else if (L === 2) {
                    tx = -spacingX * 1.75; tz = baseZ * 2; ry = 14; scale = 0.80; opacity = 0.60; blurPx = 0.5;
                } else {
                    tx = -spacingX * 1.75 - (L - 2) * (isMobile ? 35 : 55);
                    tz = baseZ * 2 + (L - 2) * -50;
                    ry = 18;
                    scale = Math.max(0.65, 0.80 - (L - 2) * 0.05);
                    opacity = Math.max(0, 0.35 - (L - 3) * 0.12);
                    blurPx = 1.5;
                }
            }

            card.style.transform = `translateX(${tx}px) translateZ(${tz}px) scale(${scale}) rotateY(${ry}deg)`;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
            card.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
            card.style.pointerEvents = 'auto';
        });

        if (counter) counter.textContent = `${currentIndex + 1} de ${cards.length}`;

        if (dock) {
            dock.querySelectorAll('.apple-dock-pill').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }
    }

    function goToCard(idx) {
        if (idx < 0) idx = 0;
        if (idx >= cards.length) idx = cards.length - 1;
        currentIndex = idx;
        updateEmbrioDeck();
    }

    function flipCard(cardEl) {
        if (!cardEl) return;
        const inner = cardEl.querySelector('.apple-card-inner');
        if (inner) inner.classList.toggle('is-flipped');
    }

    if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); goToCard(currentIndex - 1); });
    if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); goToCard(currentIndex + 1); });
    if (flipBtn) flipBtn.addEventListener('click', (e) => { e.stopPropagation(); flipCard(cards[currentIndex]); });

    cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.apple-flip-pill')) { flipCard(card); return; }
            if (idx === currentIndex) flipCard(card);
            else goToCard(idx);
        });
    });

    // Swipe táctil
    let sx = 0, dragging = false;
    deck.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; dragging = true; }, { passive: true });
    deck.addEventListener('touchend', (e) => {
        if (!dragging) return;
        const dx = e.changedTouches[0].clientX - sx;
        if (dx > 40) goToCard(currentIndex - 1);
        else if (dx < -40) goToCard(currentIndex + 1);
        dragging = false;
    }, { passive: true });

    window.addEventListener('resize', updateEmbrioDeck);

    // Iniciar
    if(cards.length > 0) updateEmbrioDeck();
});

/* ---------------------------------------------------- Cuadros comparativos -------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.comp-slide');
    const dots = document.querySelectorAll('.comp-indicators .dot');
    const prevBtn = document.getElementById('comp-prev-btn');
    const nextBtn = document.getElementById('comp-next-btn');

    if (slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;

        const showSlide = (index) => {
            // Wrap-around seguro
            if (index >= slides.length) index = 0;
            else if (index < 0) index = slides.length - 1;

            currentIndex = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (!isNaN(index)) showSlide(index);
            });
        });

        // Inicializar el primero
        showSlide(0);
    }
});

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


    const zones = [
        { topMin: 5, topMax: 20, leftMin: 2, leftMax: 15 },
        { topMin: 75, topMax: 90, leftMin: 75, leftMax: 90 }
    ];
    const lottieFiles = ['sangre.json', 'celula.json'];
    window.__bgLotties = [];

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

        const anim = lottie.loadAnimation({
            container: lottieDiv,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: randomFile 
        });
        window.__bgLotties.push(anim);
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

    window.initHistologia = function () {
        if (window.__histologiaInitDone) {
            if (typeof renderHistologiaView === 'function') renderHistologiaView();
            return;
        }
        window.__histologiaInitDone = true;

        const btnPrev   = document.getElementById('btn-prev-tejido');
        const btnNext   = document.getElementById('btn-next-tejido');
        const btnToggle = document.getElementById('btn-toggle-tejidos');

        if (!btnPrev || !btnNext || !btnToggle) return;

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
    };

    // Modo legacy (sin SPA) → inicializa al cargar
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.__SPA_ACTIVE__) {
            window.initHistologia();
        }
    });

    
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
        window.unlockMedal('ConstructorQuimico', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinhyphenhyphenF0EfFZAI1p_vgd23Qc5PhVoAQkiWCASH2X0I-Qek1LG3HsIzSIHQplkjl7QkVz-0mBnHr4k2yJVaSIRu5ilMpcLiWsxsFWNblnrGaEY7Y7eVbFjf0wLGDByqvzVg_SWJM73zOFQovibBBUTdcM9rhhSYevwst6HW_YDEQHDCWPaJqnHB3lCjI7CNA/s1024/1792863935006.png');
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
        window.unlockMedal('Fotosintesis', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXIFJFr5WlrjeTL5Bt9mXCrpB9UzNIxfx1uJD5avAbcrDS3o5aXceUSLl6T8YgqQ_t49abPvLWu9hoUJokJB1IgSxwjc5RALqcowlZd_h2valo7GfK_25wVw1cam9KxbynUJNhhXhmwEX9dsJPlduWl7VkGT1e6vnwi1m5Ff_gFziOVFCJG3t6HksYpe0/s1024/1792863957365.png');
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
        window.unlockMedal('ViruelaMetabolica', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCS_OUqyIqlNft9mRdV2gYqNMpwqXfGTHLdgc9lC8PUMMDThYWYkfBeW65ZFApOLxDKvvtq5CL8iQDqGgDXp9WwtuhMFOo_tTDuJtE_csBNZX1u3WDvgULxX0M1HgPy7gUQecK6nUnmvltjJytOEPNPrx4D_DNXbDuznwErzM5ICfHzig2ODRHnn97KFI/s1024/1792864004048.png');
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
        window.unlockMedal('Viruela', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCS_OUqyIqlNft9mRdV2gYqNMpwqXfGTHLdgc9lC8PUMMDThYWYkfBeW65ZFApOLxDKvvtq5CL8iQDqGgDXp9WwtuhMFOo_tTDuJtE_csBNZX1u3WDvgULxX0M1HgPy7gUQecK6nUnmvltjJytOEPNPrx4D_DNXbDuznwErzM5ICfHzig2ODRHnn97KFI/s1024/1792864004048.png');
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
        window.unlockMedal('MapaMetabolico', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiy1uT5Jb6Ix4Ht0DfIT_Ek22XqSJwX-2_017SoPjGD69C86toXuI5GW2rcWO5mYnpnxoqoLIQoZkgAIIWUje80DduAERJ7SxHCknuC-JnOhi0A36kjJrjH5zBDjfuT8jS-Fk9i1v4LkOsICZoCe5EH7Nv-lzdEwGvHEEDwnD1FKZzkOTCcWKxLVy-_OQs/s1024/1792863980280.png');
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
            if (g5TimeElapsed >= 25) {
                window.unlockMedal('InternoSobreviviendo', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhaJ1GshPZQ9tEXMPkkEppktCvDpas3_DvEvv9mw3ewUP7tneW8ZocY_iA9j5N7CcdUT3rPFlwUJQf5cYokxvMr71rs3lF9KDDCNYC5d7O3PEMCMO8pcIsd-mfDOVUW77SyKM1ugXouTaRW6J6t6gp74AiszAXU-RqODhzrunSsM9UgTQrB-d6laEJm4AU/s2048/1792862797985.png');
            }
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

/* ---------------------------------------------------- Sistema de Medallas ------------------------------------------------ */
// Clave para registrar que el usuario ya vio el tutorial
const TUTORIAL_STORAGE_KEY = 'saludActiva_medalTutorialSeen';

function initMedalTutorial() {
    const container = document.getElementById('medals-container');
    if (!container) return;

    const unlockedMedals = JSON.parse(localStorage.getItem(MEDALS_STORAGE_KEY)) || [];
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);

    // Solo activamos el shimmer si el usuario NO tiene medallas y NO ha visto el tutorial
    if (unlockedMedals.length === 0 && !hasSeenTutorial) {
        
        // 1. Insertar el placeholder y el tooltip en el contenedor
        container.innerHTML = `
            <div class="medal-placeholder" id="temp-placeholder">
                <span style="opacity: 0.5;">❓</span>
            </div>
            <div class="medal-tooltip" id="medal-tutorial-msg">
                ¡Supera los retos para coleccionar tus insignias aquí!
            </div>
        `;

        // 2. Aplicar la clase del destello (Shimmer)
        container.classList.add('medals-shimmer-active');

        // 3. Mostrar el tooltip con una ligera demora para la transición
        setTimeout(() => {
            const tooltip = document.getElementById('medal-tutorial-msg');
            if (tooltip) tooltip.classList.add('show');
        }, 100);

        // 4. Temporizador exacto de 10 segundos (10,000 milisegundos)
        setTimeout(() => {
            const tooltip = document.getElementById('medal-tutorial-msg');
            if (tooltip) tooltip.classList.remove('show');
            
            container.classList.remove('medals-shimmer-active');

            // Esperar que termine la transición de opacidad antes de remover del DOM
            setTimeout(() => {
                // Verificamos de nuevo las medallas por si ganó una en esos 10 segundos
                const currentMedals = JSON.parse(localStorage.getItem(MEDALS_STORAGE_KEY)) || [];
                if (currentMedals.length === 0) {
                    container.innerHTML = ''; // Dejar vacío y oculto como en el diseño original
                } else {
                    renderMedals(); // Si por algún motivo ganó una, renderizarla
                }
            }, 500);

            // Registrar en localStorage para no volver a mostrarlo
            localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');

        }, 10000);
    }
}



/* =========================================================================================
   SISTEMA DE MEDALLAS E INSIGNIAS (APUNTES UNI & SALUD ACTIVA)
   Carga desde URLs remotas de Blogger para máxima optimización y ahorro de espacio
========================================================================================== */

const MEDALS_STORAGE_KEY = 'saludActiva_unlockedMedals';

// Catálogo maestro de medallas de retos
window.MEDALS_CATALOG = {
    ConstructorQuimico: {
        id: 'ConstructorQuimico',
        name: 'Constructor Químico',
        subject: 'Bioquímica',
        gameTitle: 'Constructor de Compuestos',
        desc: 'Sintetiza compuestos orgánicos clave como Agua o Dióxido de Carbono con la proporción estequiométrica exacta.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinhyphenhyphenF0EfFZAI1p_vgd23Qc5PhVoAQkiWCASH2X0I-Qek1LG3HsIzSIHQplkjl7QkVz-0mBnHr4k2yJVaSIRu5ilMpcLiWsxsFWNblnrGaEY7Y7eVbFjf0wLGDByqvzVg_SWJM73zOFQovibBBUTdcM9rhhSYevwst6HW_YDEQHDCWPaJqnHB3lCjI7CNA/s1024/1792863935006.png',
        route: 'bioquimica'
    },
    Fotosintesis: {
        id: 'Fotosintesis',
        name: 'Fotosíntesis & Bioenergética',
        subject: 'Bioquímica',
        gameTitle: 'El Camino de la Energía',
        desc: 'Completa la ruta de glucólisis, oxidación del piruvato y ciclo de respiración celular para maximizar el ATP.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXIFJFr5WlrjeTL5Bt9mXCrpB9UzNIxfx1uJD5avAbcrDS3o5aXceUSLl6T8YgqQ_t49abPvLWu9hoUJokJB1IgSxwjc5RALqcowlZd_h2valo7GfK_25wVw1cam9KxbynUJNhhXhmwEX9dsJPlduWl7VkGT1e6vnwi1m5Ff_gFziOVFCJG3t6HksYpe0/s1024/1792863957365.png',
        route: 'bioquimica'
    },
    ViruelaMetabolica: {
        id: 'ViruelaMetabolica',
        name: 'Detective Metabólico',
        subject: 'Bioquímica',
        gameTitle: 'Detective Clínico',
        desc: 'Identifica y diagnostica patologías metabólicas (Diabetes Mellitus, PKU) a partir de signos clínicos y gasometría.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCS_OUqyIqlNft9mRdV2gYqNMpwqXfGTHLdgc9lC8PUMMDThYWYkfBeW65ZFApOLxDKvvtq5CL8iQDqGgDXp9WwtuhMFOo_tTDuJtE_csBNZX1u3WDvgULxX0M1HgPy7gUQecK6nUnmvltjJytOEPNPrx4D_DNXbDuznwErzM5ICfHzig2ODRHnn97KFI/s1024/1792864004048.png',
        route: 'bioquimica'
    },
    MapaMetabolico: {
        id: 'MapaMetabolico',
        name: 'Mapa Metabólico',
        subject: 'Bioquímica',
        gameTitle: 'Conecta la Ruta',
        desc: 'Ordena cronológicamente la secuencia enzimática preparatoria de la glucólisis (Glucosa a Fructosa-1,6-biP).',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiy1uT5Jb6Ix4Ht0DfIT_Ek22XqSJwX-2_017SoPjGD69C86toXuI5GW2rcWO5mYnpnxoqoLIQoZkgAIIWUje80DduAERJ7SxHCknuC-JnOhi0A36kjJrjH5zBDjfuT8jS-Fk9i1v4LkOsICZoCe5EH7Nv-lzdEwGvHEEDwnD1FKZzkOTCcWKxLVy-_OQs/s1024/1792863980280.png',
        route: 'bioquimica'
    },
    InternoSobreviviendo: {
        id: 'InternoSobreviviendo',
        name: 'Interno Sobreviviendo',
        subject: 'Bioquímica',
        gameTitle: 'Simulador de Homeostasis',
        desc: 'Mantén estabilizada la glucosa, pH y oxigenación administrando insulina, glucagón o bicarbonato.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhaJ1GshPZQ9tEXMPkkEppktCvDpas3_DvEvv9mw3ewUP7tneW8ZocY_iA9j5N7CcdUT3rPFlwUJQf5cYokxvMr71rs3lF9KDDCNYC5d7O3PEMCMO8pcIsd-mfDOVUW77SyKM1ugXouTaRW6J6t6gp74AiszAXU-RqODhzrunSsM9UgTQrB-d6laEJm4AU/s2048/1792862797985.png',
        route: 'bioquimica'
    },
    NutriasPeresosas: {
        id: 'NutriasPeresosas',
        name: 'Nutrias Perezosas',
        subject: 'Fisiología',
        gameTitle: 'Laboratorio de Digestión',
        desc: 'Activa la cascada con enterocinasa del ribete en cepillo y absorbe oligopéptidos por el transportador PepT1.',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwf7IWbACLQ1_EdLcduTZzw_B4PPwea2COxmXqgC0OLjg_QG2Mv8UcrMddMXZHysGumb7WKRcncTT9WYCIqoPWIW_Qr7hQ-Bcc637W-5Vpva9GlS9GNcFMrhs0-to7dsB2tRYMVsftKTa9r97GzGP92tI3LCCnIGfvH4rqRSGXekflF9aSQZkX4G6eyaQ/s2048/1792862845901.png',
        route: 'fisiologia'
    },
    MedicoCansado: {
        id: 'MedicoCansado',
        name: 'Médico Cansado',
        subject: 'Fisiología',
        gameTitle: 'Balanza Ácido-Base',
        desc: 'Compensa disturbios de acidosis o alcalosis mediante ajuste pulmonar y renal (Henderson-Hasselbalch).',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHOIvSDSDx7TvFvhNcJzNPqey2gN9PLh78IsMoKN_CsVjGk5Ji959TTJegxoyO6fj0LVWPpOPbHNSjZcRPGRfuoqHk0qVv620TgC3_jHJ5VmtbVCJl7o7DN8Ut9X8PCrm4TuXWwZ9eJYxYinKpZMXXQsz0aleWuLpsATMyixLl_aYXB95IiqAbDB0g8QU/s2048/1792862748112.png',
        route: 'fisiologia'
    },
    SinPapeles: {
        id: 'SinPapeles',
        name: 'Sin Papeles',
        subject: 'Psicología',
        gameTitle: 'El Semáforo Clínico',
        desc: 'Resuelve las viñetas clínicas de intervención en crisis seleccionando opciones empáticas técnicas (Luz Verde).',
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQ5ZNlqDhV_emF_nTiHMnUM1R7D6qjroGZ_PMhdnyjNLVMwOfv9XW4RadX6ztSLDLKKCeMqwnNRYrTArod7WhRDqZ9Ifpl3vCVg-K_TR7QtUU2rqzfa6LBunY-Ydsp5cfnpe9uCg_jrcgFEHMj__NcXqHjW2XmVlRqB7QHx0jRED_lYQwIQWLf5NaxvLo/s1024/1792864030819.png',
        route: 'psicologia'
    }
};

// Migración y saneamiento
function getCleanUnlockedMedals() {
    let unlocked = JSON.parse(localStorage.getItem(MEDALS_STORAGE_KEY)) || [];
    let changed = false;
    const migrationMap = {
        'RutaMetabolica': 'Fotosintesis',
        'SemaforoClinico': 'SinPapeles',
        'MatchPsicometrico': 'SinPapeles'
    };
    const seen = new Set();
    const clean = [];

    unlocked.forEach(m => {
        let currentId = migrationMap[m.id] || m.id;
        if (window.MEDALS_CATALOG && window.MEDALS_CATALOG[currentId]) {
            const correctUrl = window.MEDALS_CATALOG[currentId].image;
            if (!seen.has(currentId)) {
                seen.add(currentId);
                clean.push({
                    id: currentId,
                    image: correctUrl,
                    unlockedAt: m.unlockedAt || new Date().toISOString()
                });
                if (m.image !== correctUrl || m.id !== currentId) changed = true;
            } else {
                changed = true;
            }
        }
    });

    if (changed) {
        localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
}

// Desbloquear Medallas
window.unlockMedal = function (medalId, imagePath) {
    let unlockedMedals = getCleanUnlockedMedals();
    const finalUrl = imagePath || (window.MEDALS_CATALOG[medalId] ? window.MEDALS_CATALOG[medalId].image : '');
    const alreadyUnlocked = unlockedMedals.find(m => m.id === medalId);
    
    if (!alreadyUnlocked && finalUrl) {
        unlockedMedals.push({
            id: medalId,
            image: finalUrl,
            unlockedAt: new Date().toISOString()
        });
        localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(unlockedMedals));
        
        renderMedals();
        if (typeof window.actualizarVitrinaMedallas === 'function') window.actualizarVitrinaMedallas();
        mostrarToastMedalla(medalId);
        
        if (typeof window.triggerGameEffect === 'function') window.triggerGameEffect('win');
    }
};

// Toast Notificación
function mostrarToastMedalla(medalId) {
    const medalData = window.MEDALS_CATALOG[medalId];
    if (!medalData) return;
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-6 z-[130] p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-400/50 shadow-2xl flex items-center gap-3.5 transform translate-y-4 opacity-0 transition-all duration-400 pointer-events-none';
    toast.innerHTML = `
        <div class="w-12 h-12 rounded-xl bg-amber-500/20 p-1 flex items-center justify-center border border-amber-400/40 flex-shrink-0">
            <img src="${medalData.image}" alt="${medalData.name}" class="w-full h-full object-contain filter drop-shadow">
        </div>
        <div>
            <div class="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">¡Nueva Medalla Desbloqueada!</div>
            <div class="text-sm font-bold text-slate-900 dark:text-white leading-tight">${medalData.name}</div>
            <div class="text-[11px] text-slate-500 font-medium">${medalData.subject} • ${medalData.gameTitle}</div>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.remove('translate-y-4', 'opacity-0'), 50);
    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

// Renderizado visual en UI Inferior y Badges
function renderMedals() {
    const container = document.getElementById('medals-container');
    const unlockedMedals = getCleanUnlockedMedals();
    
    const headerBadges = document.querySelectorAll('.medals-counter-indicator, #medals-unlocked-badge');
    headerBadges.forEach(b => {
        b.textContent = unlockedMedals.length;
        b.style.display = unlockedMedals.length > 0 ? 'inline-flex' : 'none';
    });

    if (!container) return;
    
    container.innerHTML = '';
    container.style.cursor = 'pointer';
    container.title = 'Toca para abrir la Vitrina de Medallas';
    container.onclick = () => { if (typeof window.abrirMedallas === 'function') window.abrirMedallas(); };
    
    unlockedMedals.forEach((medal, index) => {
        const medalDiv = document.createElement('div');
        medalDiv.className = 'medal-item';
        medalDiv.style.zIndex = index + 1;
        const catalogItem = window.MEDALS_CATALOG[medal.id];
        const titleName = catalogItem ? catalogItem.name : medal.id;
        medalDiv.title = `Medalla desbloqueada: ${titleName} (Toca para ver vitrina)`;
        
        const img = document.createElement('img');
        img.src = medal.image;
        img.className = 'medal-image';
        img.alt = titleName;
        
        medalDiv.appendChild(img);
        container.appendChild(medalDiv);
    });
}

// ============================================================================
// CONTROLES DE LA VENTANA MAC OS (ABRIR, CERRAR, MINIMIZAR, EXPANDIR)
// ============================================================================
let isExpanded = false;
let isMinimized = false;

window.abrirMedallas = async function() {
    let overlay = document.getElementById('medallas-modal-overlay');
    
    if (!overlay) {
        try {
            const resp = await fetch('medallas.html');
            if (!resp.ok) throw new Error('Error al cargar medallas.html');
            const html = await resp.text();
            document.body.insertAdjacentHTML('beforeend', html);
            overlay = document.getElementById('medallas-modal-overlay');
        } catch (err) {
            console.error('Error cargando la sección medallas.html:', err);
            return;
        }
    }
    
    window.actualizarVitrinaMedallas();
    
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    
    const card = document.getElementById('medallas-card');
    if (card) {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }
};

window.cerrarMedallas = function() {
    const overlay = document.getElementById('medallas-modal-overlay');
    const card = document.getElementById('medallas-card');
    if (!overlay) return;
    
    if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
};

window.expandirMedallas = function() {
    const card = document.getElementById('medallas-card');
    const icon = document.getElementById('expand-icon');
    const overlay = document.getElementById('medallas-modal-overlay');
    
    if (isMinimized) window.minimizarMedallas();

    if (!isExpanded) {
        card.classList.remove('max-w-[1100px]', 'h-[85vh]', 'rounded-[32px]');
        card.classList.add('w-full', 'h-full', 'rounded-none');
        overlay.classList.remove('p-2', 'sm:p-6');
        icon.innerText = 'close_fullscreen';
        isExpanded = true;
    } else {
        card.classList.remove('w-full', 'h-full', 'rounded-none');
        card.classList.add('max-w-[1100px]', 'h-[85vh]', 'rounded-[32px]');
        overlay.classList.add('p-2', 'sm:p-6');
        icon.innerText = 'open_in_full';
        isExpanded = false;
    }
};

window.minimizarMedallas = function() {
    const card = document.getElementById('medallas-card');
    const body = document.getElementById('medallas-body');
    
    if (!isMinimized) {
        body.style.display = 'none';
        card.style.height = 'auto';
        card.classList.remove('h-[85vh]');
        if (isExpanded) window.expandirMedallas();
        isMinimized = true;
    } else {
        body.style.display = 'flex';
        card.classList.add('h-[85vh]');
        isMinimized = false;
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('medallas-modal-overlay');
        if (overlay && !overlay.classList.contains('opacity-0')) window.cerrarMedallas();
    }
});

// ============================================================================
// ACTUALIZACIÓN DE INTERFAZ (DISEÑO GLASSMORPHISM PREMIUM)
// ============================================================================
window.actualizarVitrinaMedallas = function() {
    const grid = document.getElementById('grid-medallas-retos');
    const pill = document.getElementById('medals-counter-pill');
    if (!grid) return;
    
    const unlocked = getCleanUnlockedMedals();
    const unlockedMap = {};
    unlocked.forEach(m => { unlockedMap[m.id] = m; });
    
    if (pill) {
        pill.textContent = `${unlocked.length} / 8 Obtenidas`;
    }
    
    grid.innerHTML = '';
    
    const allMedals = Object.values(window.MEDALS_CATALOG);
    
    allMedals.forEach(medal => {
        const isUnlocked = !!unlockedMap[medal.id];
        const card = document.createElement('div');
        
        // El HTML aquí ha sido adaptado al diseño de cristal (VisionOS)
        if (isUnlocked) {
            card.innerHTML = `
                <div class="premium-glass-card relative p-5 rounded-[28px] flex flex-col justify-between group h-full">
                    <!-- Icono Check Verde -->
                    <div class="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-400 dark:bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)] flex items-center justify-center text-white z-10 border border-white/40">
                        <span class="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                    
                    <!-- Imagen de la Medalla -->
                    <div class="relative w-full h-36 flex items-center justify-center mb-4 mt-2">
                        <img src="${medal.image}" alt="${medal.name}" class="h-full object-contain medal-img-glow drop-shadow-xl" />
                    </div>

                    <!-- Badges -->
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 backdrop-blur-sm border border-emerald-200 dark:border-emerald-500/30">Desbloqueada</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/30">${medal.subject}</span>
                    </div>

                    <!-- Textos -->
                    <div class="flex-grow">
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2">${medal.name}</h4>
                        <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-5">${medal.desc}</p>
                    </div>

                    <!-- Botón Practicar -->
                    <button onclick="cerrarMedallas(); if(window.SPA) window.SPA.navigateTo('${medal.route}');" class="mt-auto w-full py-2.5 rounded-2xl bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 text-slate-800 dark:text-white text-sm font-bold border border-white/50 dark:border-white/10 transition-all flex items-center justify-center gap-1 backdrop-blur-md">
                        Practicar Reto <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="premium-glass-card relative p-5 rounded-[28px] flex flex-col justify-between group h-full">
                    <!-- Imagen Bloqueada -->
                    <div class="relative w-full h-36 flex items-center justify-center mb-4 mt-2">
                        <img src="${medal.image}" alt="${medal.name}" class="h-full object-contain filter grayscale opacity-40 transition-all duration-300 group-hover:opacity-60" />
                        <!-- Candado -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-12 h-12 rounded-full bg-slate-900/60 dark:bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-xl border border-white/20">
                                <span class="material-symbols-outlined text-xl">lock</span>
                            </div>
                        </div>
                    </div>

                    <!-- Badges -->
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300 backdrop-blur-sm border border-slate-300 dark:border-white/10">Bloqueada</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/30">${medal.subject}</span>
                    </div>

                    <!-- Textos -->
                    <div class="flex-grow">
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2">${medal.name}</h4>
                        <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-5">${medal.desc}</p>
                    </div>

                    <!-- Botón Desbloquear -->
                    <button onclick="cerrarMedallas(); if(window.SPA) window.SPA.navigateTo('${medal.route}');" class="mt-auto w-full py-2.5 rounded-2xl bg-blue-500/90 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-1 border border-blue-400/50">
                        Ir a Desbloquear <span class="material-symbols-outlined text-sm">play_arrow</span>
                    </button>
                </div>
            `;
        }
        
        grid.appendChild(card.firstElementChild);
    });
};

// Filtro actualizado con clases premium de Tailwind
window.filtrarMedallasCategoria = function(categoria, btn) {
    const tabs = document.querySelectorAll('.medal-tab-btn');
    tabs.forEach(t => {
        t.className = 'medal-tab-btn px-5 py-2 rounded-full text-sm font-bold bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 flex items-center gap-2 transition-all';
    });
    if (btn) {
        btn.className = 'medal-tab-btn active px-5 py-2 rounded-full text-sm font-bold bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm flex items-center gap-2 transition-all';
    }
    
    const secRetos = document.getElementById('seccion-cat-retos');
    const secLegendarias = document.getElementById('seccion-cat-legendarias');
    const secColab = document.getElementById('seccion-cat-colaborativas');
    const secEnlaces = document.getElementById('seccion-cat-enlaces');
    
    if (!secRetos || !secColab || !secEnlaces || !secLegendarias) return;

    secRetos.style.display = (categoria === 'todas' || categoria === 'retos') ? 'block' : 'none';
    secLegendarias.style.display = (categoria === 'todas' || categoria === 'legendarias') ? 'block' : 'none';
    secColab.style.display = (categoria === 'todas' || categoria === 'colaborativas') ? 'block' : 'none';
    secEnlaces.style.display = (categoria === 'todas' || categoria === 'enlaces') ? 'block' : 'none';
};

// Cargar medallas al inicio
document.addEventListener('DOMContentLoaded', () => {
    renderMedals(); 
    if (typeof initMedalTutorial === 'function') initMedalTutorial(); 
});


/* ---------------------------------------------------- Switch (Píldoras de Tema Multiplataforma) ------------------------------------------------ */

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.body.classList.add('alt-theme');
    
    // Comunicación con el Iframe de Neural Expressive
    const neuralIframe = document.querySelector('iframe[src="neural_expressive.html"]');
    if (neuralIframe && neuralIframe.contentWindow) {
        neuralIframe.contentWindow.postMessage({ theme: 'dark' }, '*');
    }
    
    updateThemeColor();
}

function enableLightMode() {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('alt-theme');
    
    // Comunicación con el Iframe de Neural Expressive
    const neuralIframe = document.querySelector('iframe[src="neural_expressive.html"]');
    if (neuralIframe && neuralIframe.contentWindow) {
        neuralIframe.contentWindow.postMessage({ theme: 'light' }, '*');
    }
    
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