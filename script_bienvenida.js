/* ---------------------------------------------------- Motor del Ecosistema Hero Banner ------------------------------------------------ */

const ecosystemData = {
    salud_activa: {
        badgeIcon: 'ecg_heart',
        badgeText: 'ECOSISTEMA',
        titleDark: 'Salud',
        titleGradient: 'Activa',
        subtitle: 'Ecosistema Salud Activa<br>Tu bienestar, en equilibrio.',
        themeClass: 'theme-salud-activa',
        blobs: ['blob-sa-1', 'blob-sa-2', 'blob-sa-3'],
        gradientColors: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #22c55e 100%)', 
        betaText: 'BETA',
        subFeatures: `
            <div class="flex flex-col items-center w-full">
                <!-- Fila de 4 Cápsulas -->
                <div class="sa-features-row">
                    <div class="sa-feature-pill sa-pill-green">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">restaurant</span></div>
                        <div class="sa-fp-text">
                            <h4>Nutrición</h4>
                            <p>Calcula tus macros</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-blue">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">footprint</span></div>
                        <div class="sa-fp-text">
                            <h4>Pasos</h4>
                            <p>Muévete más</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-purple">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">fitness_center</span></div>
                        <div class="sa-fp-text">
                            <h4>Entrenamiento</h4>
                            <p>Registra tu progreso</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-indigo">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">bedtime</span></div>
                        <div class="sa-fp-text">
                            <h4>Sueño</h4>
                            <p>Analiza y recupera</p>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta de Funciones Experimentales -->
                <a href="https://fittme-4b869.firebaseapp.com/" target="_blank" class="sa-experimental-card">
                    <div class="sa-exp-icon">
                        <span class="material-symbols-outlined text-[26px]">ramen_dining</span>
                    </div>
                    <div class="sa-exp-content">
                        <div class="sa-exp-badge">
                            <span class="material-symbols-outlined text-[16px]">science</span> EN DESARROLLO / BETA
                        </div>
                        <h3>Planes de alimentación</h3>
                        <p>Dietas por equivalencias, según tus objetivos, macros y preferencias.</p>
                    </div>
                    <!-- El icono cambia -->
                    <div class="sa-exp-arrow">
                        <span class="material-symbols-outlined">language</span>
                    </div>
                </a>
            </div>
        `,
        graphics: `
            <!-- Corazón Central Neón -->
            <div class="hero-img-wrapper parallax-layer" style="width: 380px; left: 50%; top: 10%; transform: translateX(-50%);" data-speed="0.03">
                <!-- Puedes cambiar 'corazon.png' por una imagen de un corazón más translúcida o estilo 3D oscuro si la tienes -->
                <img src="saludactiva_01.png" alt="Salud Activa" class="hero-3d-asset float-anim-1" style="filter: drop-shadow(0 0 40px rgba(59,130,246,0.5));">
            </div>
            
            <!-- Panel Nutrición (Izquierda) -->
            <div class="hero-img-wrapper parallax-layer" style="width: 280px; left: 2%; top: 40%;" data-speed="-0.02">
                <img src="saludactiva_02.png" alt="Nutrición" class="hero-3d-asset float-anim-3" style="filter: drop-shadow(0 0 25px rgba(34,197,94,0.3));">
                <div class="glass-icon avocado-icon float-anim-1" style="background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4);">
                    <span class="material-symbols-outlined text-green-400">restaurant</span>
                </div>
            </div>

            <!-- Panel Ejercicio/Sueño (Derecha) -->
            <div class="hero-img-wrapper parallax-layer" style="width: 260px; right: 2%; bottom: 10%;" data-speed="0.04">
                <img src="saludactiva_03.png" alt="Sueño" class="hero-3d-asset float-anim-2" style="filter: drop-shadow(0 0 25px rgba(168,85,247,0.3));">
                <div class="glass-icon brain-icon float-anim-3" style="background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.4);">
                    <span class="material-symbols-outlined text-purple-400">fitness_center</span>
                </div>
            </div>
        `
    },
    apuntes_uni: {
        badgeIcon: 'school',
        badgeText: 'APUNTES UNI',
        titleDark: 'APUNTES',
        titleGradient: 'UNI',
        subtitle: 'Apuntes, resúmenes y recursos para tu<br class="hidden md:block"> formación en salud.',
        themeClass: 'theme-apuntes-uni',
        blobs: ['blob-au-1', 'blob-au-2', 'blob-au-3'],
        gradientColors: 'linear-gradient(90deg, #3b82f6 0%, #d946ef 50%, #22c55e 100%)',
        betaText: 'BETA',
        subFeatures: `
            <div class="flex flex-col items-center w-full">
                <!-- Fila de 4 Cápsulas -->
                <div class="sa-features-row">
                    <div class="sa-feature-pill sa-pill-green">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">music_note</span></div>
                        <div class="sa-fp-text">
                            <h4>Musica</h4>
                            <p>Aprende con musica</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-blue">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">video_template</span></div>
                        <div class="sa-fp-text">
                            <h4>Videos</h4>
                            <p>Aprende viendo</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-purple">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">lightbulb</span></div>
                        <div class="sa-fp-text">
                            <h4>Lectura</h4>
                            <p>Aprende leyendo</p>
                        </div>
                    </div>
                    <div class="sa-feature-pill sa-pill-indigo">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">stadia_controller</span></div>
                        <div class="sa-fp-text">
                            <h4>Juegos</h4>
                            <p>Aprende jugando</p>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta de Funciones Experimentales -->
                <a href="bienvenida.html" target="_blank" class="sa-experimental-card">
                    <div class="sa-exp-icon">
                        <span class="material-symbols-outlined text-[24px]">ramen_dining</span>
                    </div>
                    <div class="sa-exp-content">
                        <div class="sa-exp-badge">
                            <span class="material-symbols-outlined text-[14px]">science</span> EN DESARROLLO / BETA
                        </div>
                        <h3>Sube tus apuntes</h3>
                        <p>Podras subir tus apuntes a mano o digital para luego generar de forma automatica flashcards, quiz,<br>mini juegos o lo que te ayude a comprender mejor del tema.</p>
                    </div>
                    <div class="sa-exp-arrow">
                        <span class="material-symbols-outlined">language</span>
                    </div>
                </a>
            </div>
        `,
        graphics: `
            <div class="hero-img-wrapper img-heart parallax-layer" data-speed="0.03">
                <img src="corazon.png" alt="Corazón Anatomía 3D" class="hero-3d-asset float-anim-1 asset-light">
                <img src="corazon_oscuro.png" alt="Corazón Oscuro" class="hero-3d-asset float-anim-1 asset-dark">
                <div class="glass-icon heart-icon float-anim-2">
                    <span class="material-symbols-outlined text-blue-600">stethoscope</span>
                </div>
            </div>
            <div class="hero-img-wrapper img-avocado parallax-layer" data-speed="-0.02">
                <img src="aguacate.png" alt="Aguacate 3D" class="hero-3d-asset float-anim-3 asset-light">
                <img src="aguacate_oscuro.png" alt="Aguacate Oscuro" class="hero-3d-asset float-anim-3 asset-dark">
                <div class="glass-icon avocado-icon float-anim-1">
                    <span class="material-symbols-outlined text-green-600">nutrition</span>
                </div>
            </div>
            <div class="hero-img-wrapper img-brain parallax-layer" data-speed="0.04">
                <img src="cerebro.png" alt="Cerebro 3D" class="hero-3d-asset float-anim-2 asset-light">
                <img src="cerebro_oscuro.png" alt="Cerebro Oscuro" class="hero-3d-asset float-anim-2 asset-dark">
                <div class="glass-icon brain-icon float-anim-3">
                    <span class="material-symbols-outlined text-purple-600">psychology</span>
                </div>
            </div>
        `
    },
    primeros_pasos: {
        badgeIcon: 'menu_book',
        badgeText: 'INICIACIÓN',
        titleDark: 'APUNTES UNI',
        titleGradient: 'Primeros Pasos',
        subtitle: 'Te preparamos de la mejor forma,<br class="hidden md:block">Para el examen de admisión .',
        themeClass: 'theme-primeros-pasos',
        blobs: ['blob-au-1', 'blob-au-2', 'blob-au-3'],
        gradientColors: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)', 
        betaText: 'En desarrollo',
        subFeatures: `
            <div class="flex flex-col items-center w-full">
                <!-- Fila de 4 Cápsulas -->
                <div class="sa-features-row mb-12">
                    <div class="sa-feature-pill sa-pill-green">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">comedy_mask</span></div>
                        <div class="sa-fp-text"><h4>Divertido</h4><p>Aprende jugando</p></div>
                    </div>
                    <div class="sa-feature-pill sa-pill-blue">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">local_library</span></div>
                        <div class="sa-fp-text"><h4>Téc. de estudio</h4><p>Adaptado a ti</p></div>
                    </div>
                    <div class="sa-feature-pill sa-pill-purple cursor-pointer hover:scale-105 transition" onclick="window.location.href='primeros_pasos.html'">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">quiz</span></div>
                        <div class="sa-fp-text"><h4>Práctica</h4><p>Simulacros</p></div>
                    </div>
                    <div class="sa-feature-pill sa-pill-indigo cursor-pointer hover:scale-105 transition" onclick="window.location.href='primeros_pasos.html'">
                        <div class="sa-fp-icon"><span class="material-symbols-outlined">person_raised_hand</span></div>
                        <div class="sa-fp-text"><h4>Bancos</h4><p>De preguntas</p></div>
                    </div>
                </div>

                <!-- Tarjeta de Acceso Directo al Simulador y Módulos -->
                <a href="primeros_pasos.html" class="sa-experimental-card mb-8">
                    <div class="sa-exp-icon">
                        <span class="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <div class="sa-exp-content">
                        <div class="sa-exp-badge">
                            <span class="material-symbols-outlined text-[14px]">rocket_launch</span> SIMULADOR & BANCO DE REACTIVOS
                        </div>
                        <h3>Entrar al Simulador y Apuntes</h3>
                        <p>Accede al simulador interactivo de 9 materias, lecturas de comprensión guiada, apuntes conceptuales y banco de preguntas filtrable.</p>
                    </div>
                    <div class="sa-exp-arrow">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </div>
                </a>

                <!-- CONTENEDOR DEL VISOR DE PDF ESTILO LIBRO -->
                <div class="book-viewer-wrapper max-w-[950px] mt-2">
                    
                    <!-- Botones de Navegación Verticales (A la derecha) -->
                    <button class="book-nav-btn book-nav-up" onclick="cambiarPaginaPdf(-1)">
                        <span class="material-symbols-outlined">keyboard_arrow_up</span>
                    </button>
                    <button class="book-nav-btn book-nav-down" onclick="cambiarPaginaPdf(1)">
                        <span class="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>

                    <!-- Libro Principal -->
                    <!-- Se cambió la altura estática por aspect-[4/3] (o prueba aspect-video) para ajustarse al formato de tu PDF -->
                    <div class="book-container w-full aspect-[4/3] md:aspect-[1.4] flex relative">
                        <!-- Lomo del Libro Central -->
                        <div class="book-spine"></div>
                        
                        <!-- Iframe del PDF: Se cambió view=FitH a view=Fit para forzar que quepa perfecto en la caja sin bordes -->
                        <iframe id="visor-pdf-local" src="resumen_apuntesuni.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 relative z-10 rounded-[20px] bg-white dark:bg-[#0f172a]"></iframe>
                    </div>

                    <!-- Paginación Inferior (Píldora) -->
                    <div class="flex justify-center mt-6">
                        <div class="book-pagination flex items-center gap-4 px-6 py-3 rounded-full">
                            <span class="material-symbols-outlined opacity-70">menu_book</span>
                            <span class="text-sm font-bold tracking-wide" id="pdf-texto-pagina">Página 1 de 48</span>
                            <div class="w-24 h-[6px] bg-gray-200 rounded-full overflow-hidden">
                                <div id="pdf-barra-progreso" class="h-full bg-blue-500 rounded-full transition-all duration-300" style="width: 2%;"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `,
        graphics: `
            <!-- Gráficos conceptuales para "Primeros Pasos" -->
            <div class="hero-img-wrapper parallax-layer" style="width: 320px; left: 50%; top: 5%; transform: translateX(-50%);" data-speed="0.03">
                <img src="apuntesuni_pp03.png" alt="Corazón Anatomía 3D" class="hero-3d-asset float-anim-1 asset-light">
                <div class="glass-icon heart-icon float-anim-2" style="background: rgba(245,158,11,0.2); width: 100px; height: 100px; border-radius: 30px;">
                    <span class="material-symbols-outlined text-yellow-600" style="font-size: 50px;">menu_book</span>
                </div>
            </div>
            <div class="hero-img-wrapper parallax-layer" style="width: 250px; left: 10%; top: 40%;" data-speed="-0.02">
                <img src="apuntesuni_pp02.png" alt="Corazón Anatomía 3D" class="hero-3d-asset float-anim-1 asset-light">
                <div class="glass-icon avocado-icon float-anim-1" style="background: rgba(239,68,68,0.2); width: 90px; height: 90px; border-radius: 25px;">
                    <span class="material-symbols-outlined text-red-500" style="font-size: 45px;">biotech</span>
                </div>
            </div>
            <div class="hero-img-wrapper parallax-layer" style="width: 250px; right: 5%; bottom: 10%;" data-speed="0.04">
                <img src="apuntesuni_pp01.png" alt="Corazón Anatomía 3D" class="hero-3d-asset float-anim-1 asset-light">
                <div class="glass-icon brain-icon float-anim-3" style="background: rgba(14,165,233,0.2); width: 90px; height: 90px; border-radius: 25px;">
                    <span class="material-symbols-outlined text-sky-500" style="font-size: 45px;">science</span>
                </div>
            </div>
        `
    }
};

window.changeHeroEcosystem = function(tabId) {
    const data = ecosystemData[tabId];
    if (!data) return;

    document.querySelectorAll('.hero-pill').forEach(pill => pill.classList.remove('active-pill'));
    document.getElementById(`pill-${tabId}`).classList.add('active-pill');

    const textContainer = document.getElementById('hero-text-container');
    const graphicsContainer = document.getElementById('hero-graphics-container');
    const subFeaturesContainer = document.getElementById('hero-sub-features-container'); // NUEVO
    const heroSection = document.getElementById('Inicio');

    textContainer.classList.remove('fade-content');
    graphicsContainer.classList.remove('fade-content');
    subFeaturesContainer.classList.remove('fade-content'); // NUEVO
    
    void textContainer.offsetWidth; 

    heroSection.className = `hero-banner ${data.themeClass}`;
    document.getElementById('hero-blob-1').className = `hero-blob ${data.blobs[0]}`;
    document.getElementById('hero-blob-2').className = `hero-blob ${data.blobs[1]}`;
    document.getElementById('hero-blob-3').className = `hero-blob ${data.blobs[2]}`;

    document.getElementById('hero-badge-icon').textContent = data.badgeIcon;
    document.getElementById('hero-badge-text').textContent = data.badgeText;
    document.getElementById('hero-title-dark').textContent = data.titleDark;
    document.getElementById('hero-title-gradient').textContent = data.titleGradient;
    document.getElementById('hero-subtitle').innerHTML = data.subtitle;
    
    const titleGrad = document.getElementById('hero-title-gradient');
    titleGrad.style.background = data.gradientColors;
    titleGrad.style.webkitBackgroundClip = 'text';
    titleGrad.style.color = 'transparent';

    graphicsContainer.innerHTML = data.graphics;
    
    // Inyectamos las sub-funciones aquí
    subFeaturesContainer.innerHTML = data.subFeatures || '';

    textContainer.classList.add('fade-content');
    graphicsContainer.classList.add('fade-content');
    subFeaturesContainer.classList.add('fade-content'); 

    // Inyectar cápsula BETA dinámica
    const betaBadge = document.getElementById('hero-beta-badge');
    if (data.betaText && data.betaText !== '') {
        betaBadge.textContent = data.betaText;
        betaBadge.style.display = 'block'; // Muestra la cápsula
    } else {
        betaBadge.style.display = 'none'; // Oculta si está vacía
    }
};

/* ---------------------------------------------------- Lógica del Visor PDF Local ------------------------------------------------ */

// Configura el total de páginas de tu PDF real aquí
const TOTAL_PAGINAS_PDF = 48; 
let paginaPdfActual = 1;

window.cambiarPaginaPdf = function(direccion) {
    paginaPdfActual += direccion;
    
    if (paginaPdfActual < 1) paginaPdfActual = 1;
    if (paginaPdfActual > TOTAL_PAGINAS_PDF) paginaPdfActual = TOTAL_PAGINAS_PDF;

    const iframe = document.getElementById('visor-pdf-local');
    if(iframe) {
        let baseUrl = iframe.src.split('#')[0]; 
        // Actualizado a view=Fit para mantener la proporción sin márgenes grises
        iframe.src = `${baseUrl}#page=${paginaPdfActual}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`;
    }

    const textoPagina = document.getElementById('pdf-texto-pagina');
    if(textoPagina) {
        textoPagina.textContent = `Página ${paginaPdfActual} de ${TOTAL_PAGINAS_PDF}`;
    }

    const barraProgreso = document.getElementById('pdf-barra-progreso');
    if(barraProgreso) {
        const porcentaje = (paginaPdfActual / TOTAL_PAGINAS_PDF) * 100;
        barraProgreso.style.width = `${porcentaje}%`;
    }
};

/* ---------------------------------------------------- Lógica del Chatbot ------------------------------------------------ */

window.toggleChatbot = function() {
    const chatWindow = document.getElementById('chatbot-window');
    const bubble = document.getElementById('chatbot-bubble');
    
    const isOpening = !chatWindow.classList.contains('active');
    
    chatWindow.classList.toggle('active');
    
    if (isOpening) {
        bubble.classList.add('chat-active');
    } else {
        bubble.classList.remove('chat-active');
    }
};

window.handleChatOption = function(option) {
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    
    optionsContainer.style.display = 'none';

    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.textContent = option === 'secciones' ? '¿Qué hace cada sección?' : 
                          option === 'actualizaciones' ? 'Últimas actualizaciones' : 
                          'Funciones en desarrollo';
    messagesContainer.appendChild(userMsg);

    // 2. Simular tiempo de escritura del bot
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot-message';

        if (option === 'secciones') {
            botMsg.innerHTML = `
                Brevemente:<br><br>
                🔵 <b>Salud Activa:</b> Calcula macros, sobrecarga progresiva y sueño con diagramas de Hasse.<br><br>
                🟣 <b>Apuntes Uni:</b> Fisiología interactiva, modelos WebGL 3D y anatomía.<br><br>
                🟢 <b>Primeros Pasos:</b> Simulador de ingreso UNAM (enfocado a áreas de salud).
            `;
            messagesContainer.appendChild(botMsg);
            
            // Resaltar las pestañas (Pills) de la interfaz
            const pills = ['pill-salud_activa', 'pill-apuntes_uni', 'pill-primeros_pasos'];
            pills.forEach((id, index) => {
                setTimeout(() => {
                    const pill = document.getElementById(id);
                    if(pill) {
                        pill.classList.add('neon-highlight');
                        // Si la sección existe en la página, hacer scroll
                        if(id === 'pill-primeros_pasos' && window.location.pathname.includes('bienvenida')) {
                            // Solo simula el click para cambiar el entorno
                            changeHeroEcosystem('primeros_pasos'); 
                        }
                        setTimeout(() => pill.classList.remove('neon-highlight'), 6000);
                    }
                }, index * 1000); // Resaltar uno por uno cada segundo
            });

        } else if (option === 'actualizaciones') {
            botMsg.innerHTML = `
                ¡Acabamos de liberar el módulo de Fisiología en Apuntes Uni! Además, agregamos un botón de Break de 5 minutos con ejercicios de respiración para que no te quemes el cerebro estudiando.
                <div class="ios-tab">
                    <ul>
                        <li><span class="material-symbols-outlined text-blue-500 text-sm">check_circle</span> Módulo de Fisiología interactivo.</li>
                        <li><span class="material-symbols-outlined text-green-500 text-sm">check_circle</span> Break con respiración guiada.</li>
                        <li><span class="material-symbols-outlined text-purple-500 text-sm">new_releases</span> Diagramas de Hasse en Sueño.</li>
                    </ul>
                </div>
            `;
            messagesContainer.appendChild(botMsg);

        } else if (option === 'desarrollo') {
            botMsg.innerHTML = `
                Estamos horneando el módulo de Psicología y el motor de análisis de laboratorios para la versión profesional de Salud Activa. También el libro de ingreso físico de 250 hojas está en preparación.
                <div class="waitlist-form">
                    <span class="text-xs font-bold text-slate-600 mb-1">Únete a la lista de espera Beta:</span>
                    <input type="email" id="waitlist-email" placeholder="tu@correo.com">
                    <button onclick="registerWaitlist()">Registrarme</button>
                </div>
            `;
            messagesContainer.appendChild(botMsg);
        }

        // Hacer scroll hacia abajo
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Volver a mostrar las opciones después de un tiempo (opcional)
        setTimeout(() => {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'chat-option-btn';
            resetBtn.textContent = '↩ Volver al menú principal';
            resetBtn.onclick = () => {
                messagesContainer.innerHTML = `
                    <div class="message bot-message">¡Hola! 👋 Soy el asistente de Salud Activa. ¿En qué te puedo ayudar hoy?</div>
                    <div id="chat-options" class="chat-options">
                        <button class="chat-option-btn" onclick="handleChatOption('secciones')">¿Qué hace cada sección?</button>
                        <button class="chat-option-btn" onclick="handleChatOption('actualizaciones')">Últimas actualizaciones</button>
                        <button class="chat-option-btn" onclick="handleChatOption('desarrollo')">Funciones en desarrollo</button>
                    </div>
                `;
            };
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'chat-options mt-2';
            optionsDiv.appendChild(resetBtn);
            messagesContainer.appendChild(optionsDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);

    }, 800); // Retardo de 0.8s simulando escritura
};

window.registerWaitlist = function() {
    const emailInput = document.getElementById('waitlist-email');
    const email = emailInput.value;
    
    if (email && email.includes('@')) {
        // Animación de éxito
        const formContainer = emailInput.parentElement;
        formContainer.innerHTML = `
            <div class="text-center py-2 text-green-600 font-bold flex flex-col items-center">
                <span class="material-symbols-outlined text-4xl mb-1">task_alt</span>
                ¡Registrado con éxito!
            </div>
        `;
    } else {
        emailInput.style.borderColor = '#ef4444';
        emailInput.placeholder = 'Correo inválido';
        setTimeout(() => {
            emailInput.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            emailInput.placeholder = 'tu@correo.com';
        }, 2000);
    }
};

// Arrancar por defecto en "Salud Activa" al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    changeHeroEcosystem('salud_activa'); 

    const lottieContainer = document.getElementById('lottie-chatbot-icon');
    
    if (lottieContainer && typeof lottie !== 'undefined') {
        lottie.loadAnimation({
            container: lottieContainer, 
            renderer: 'svg',            
            loop: true,                 
            autoplay: true,             
            path: 'ayuda_inteligente.json' 
        });
    }
});

/* ---------------------------------------------------- tarjeta presentacion ------------------------------------------------ */

function toggleDevCard(event) {
    if (event) event.preventDefault();
    
    const overlay = document.getElementById('dev-card-overlay');
    const card = overlay.querySelector('.dev-card');
    
    // Comprobar si está oculta
    if (overlay.classList.contains('opacity-0')) {
        // 1. Quitar el 'hidden' para que exista en el DOM
        overlay.classList.remove('hidden');
        
        // 2. Un pequeño retraso para que el navegador procese el cambio y aplique la animación
        setTimeout(() => {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100');
            
            // Animación de escala para la tarjeta
            card.classList.remove('scale-95');
            card.classList.add('scale-100');
        }, 10);
    } else {
        // Proceso inverso para ocultar
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
        
        // Esperar a que termine la transición (300ms) para ocultarlo del DOM
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

/* ---------------------------------------------------- Lógica del Video Flotante iOS ------------------------------------------------ */

window.abrirVideoFlotante = function(event) {
    if (event) event.preventDefault();
    
    const overlay = document.getElementById('video-flotante-overlay');
    const card = document.getElementById('video-flotante-card');
    
    // Mostramos en el DOM
    overlay.classList.remove('hidden');
    
    // Retraso ligero para permitir la transición CSS
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        
        card.classList.remove('scale-95', 'video-mini-player', 'video-expanded');
        card.classList.add('scale-100');
    }, 10);
};

window.cerrarVideoFlotante = function() {
    const overlay = document.getElementById('video-flotante-overlay');
    const card = document.getElementById('video-flotante-card');
    const video = document.getElementById('video-local-player');
    
    // Pausar el video al cerrar
    if (video) video.pause();
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    // Limpiar clases adicionales y ocultar del DOM tras la animación
    setTimeout(() => {
        overlay.classList.add('hidden');
        card.classList.remove('video-mini-player', 'video-expanded');
    }, 300);
};

window.minimizarVideoFlotante = function() {
    const card = document.getElementById('video-flotante-card');
    
    // Alterna entre el estado mini y el estado original
    if (card.classList.contains('video-mini-player')) {
        card.classList.remove('video-mini-player');
    } else {
        card.classList.remove('video-expanded');
        card.classList.add('video-mini-player');
    }
};

window.expandirVideoFlotante = function() {
    const card = document.getElementById('video-flotante-card');
    
    // Alterna entre pantalla completa y el estado original
    if (card.classList.contains('video-expanded')) {
        card.classList.remove('video-expanded');
    } else {
        card.classList.remove('video-mini-player');
        card.classList.add('video-expanded');
    }
};


/* ---------------------------------------------------- Lógica de Términos y Código de Seguridad ------------------------------------------------ */
let terminosModoObligatorio = true;
const CODIGO_CORRECTO = "FESMDPS";
// Reemplaza esta URL con tu enlace real de Google Forms:
const GOOGLE_FORMS_URL = "https://forms.gle/cjtHEuQvtPaoVnF28"; 

document.addEventListener('DOMContentLoaded', () => {
    const terminosAceptados = localStorage.getItem('salud_activa_terminos');
    
    if (!terminosAceptados) {
        setTimeout(() => {
            mostrarTerminos(true); // true = Obligatorio
        }, 300);
    }

    // Comportamiento auto-tabulación para los inputs del código
    const inputs = document.querySelectorAll('.codigo-input-char');
    inputs.forEach((input, index) => {
        // Al escribir, avanzar al siguiente
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Al presionar borrar, retroceder
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
});

// Función para abrir desde el footer
window.abrirTerminosInformativos = function(event) {
    if (event) event.preventDefault();
    mostrarTerminos(false); // false = Informativo
};

window.mostrarTerminos = function(esObligatorio) {
    terminosModoObligatorio = esObligatorio;
    
    const overlay = document.getElementById('terminos-overlay');
    const card = document.getElementById('terminos-card');
    const btnCerrar = document.getElementById('btn-cerrar-terminos');
    const boxBotones = document.getElementById('terminos-botones-obligatorios');
    const boxInformativo = document.getElementById('terminos-texto-informativo');
    
    if (esObligatorio) {
        btnCerrar.className = "w-3.5 h-3.5 rounded-full bg-gray-400/50 cursor-not-allowed shadow-inner flex items-center justify-center group transition-colors";
        overlay.classList.add('pointer-events-auto');
        boxBotones.classList.remove('hidden');
        boxBotones.classList.add('flex');
        boxInformativo.classList.add('hidden');
    } else {
        btnCerrar.className = "w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-inner flex items-center justify-center group transition-colors";
        overlay.classList.remove('pointer-events-auto'); 
        boxBotones.classList.add('hidden');
        boxBotones.classList.remove('flex');
        boxInformativo.classList.remove('hidden');
    }
    
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
};

window.cerrarTerminos = function() {
    if (terminosModoObligatorio) return; 
    
    const overlay = document.getElementById('terminos-overlay');
    const card = document.getElementById('terminos-card');
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        card.classList.remove('terminos-mini', 'terminos-expanded');
    }, 500);
};

window.aceptarTerminos = function() {
    localStorage.setItem('salud_activa_terminos', 'aceptado');
    
    const overlayTerminos = document.getElementById('terminos-overlay');
    overlayTerminos.classList.add('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
        overlayTerminos.style.display = 'none';
        abrirSeguridad(true); // true = Obligatorio tras aceptar
    }, 400);
};

window.rechazarTerminos = function() {
    window.location.href = "https://www.google.com";
};



window.abrirSeguridadDesdeTerminos = function() {
    // Cerramos el modal informativo de términos primero
    const overlayTerminos = document.getElementById('terminos-overlay');
    overlayTerminos.classList.add('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
        overlayTerminos.style.display = 'none';
        abrirSeguridad(false); // false = Informativo
    }, 400);
};

window.abrirSeguridad = function(esObligatorio) {
    // Para saber si el modal se cerrará a voluntad o bloqueará
    const overlay = document.getElementById('seguridad-overlay');
    const card = document.getElementById('seguridad-card');
    const btnCerrar = document.getElementById('btn-cerrar-seguridad');
    const btnVolver = document.getElementById('btn-volver-seguridad');
    
    // Vaciar y enfocar el primer campo
    const inputs = document.querySelectorAll('.codigo-input-char');
    inputs.forEach(i => i.value = "");
    
    if (esObligatorio) {
        btnCerrar.className = "w-3.5 h-3.5 rounded-full bg-gray-400/50 cursor-not-allowed shadow-inner flex items-center justify-center group transition-colors";
        btnVolver.classList.add('hidden'); // No puede volver si es obligatorio inicial
        overlay.classList.add('pointer-events-auto');
    } else {
        btnCerrar.className = "w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-inner flex items-center justify-center group transition-colors";
        btnVolver.classList.remove('hidden');
        overlay.classList.remove('pointer-events-auto');
    }
    
    
    overlay.dataset.obligatorio = esObligatorio ? "true" : "false";
    
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
        inputs[0].focus();
    }, 10);
};

window.cerrarSeguridad = function() {
    const overlay = document.getElementById('seguridad-overlay');
    if (overlay.dataset.obligatorio === "true") return; // Bloquear
    
    const card = document.getElementById('seguridad-card');
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        card.classList.remove('seguridad-mini', 'seguridad-expanded');
    }, 500);
};

window.volverATerminos = function() {
    
    const overlay = document.getElementById('seguridad-overlay');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        mostrarTerminos(false);
    }, 400);
};

window.validarCodigoSeguridad = function() {
    const inputs = document.querySelectorAll('.codigo-input-char');
    let codigoUsuario = "";
    inputs.forEach(i => codigoUsuario += i.value);
    
    if (codigoUsuario.toUpperCase() === CODIGO_CORRECTO) {
        const overlay = document.getElementById('seguridad-overlay');
        const card = document.getElementById('seguridad-card');
        
        overlay.dataset.obligatorio = "false";
        
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
            // Abre el enlace del Google Forms en otra pestaña
            window.open(GOOGLE_FORMS_URL, '_blank');
        }, 500);
    } else {
        const container = document.getElementById('codigo-inputs-container');
        container.classList.add('animate-shake');
        
        inputs.forEach(input => {
            input.classList.add('border-red-500', 'bg-red-500/10');
            input.value = ""; // reiniciar
        });
        inputs[0].focus();
        
        
        setTimeout(() => {
            container.classList.remove('animate-shake');
            inputs.forEach(input => {
                input.classList.remove('border-red-500', 'bg-red-500/10');
            });
        }, 600);
    }
};


window.minimizarSeguridad = function() {
    const card = document.getElementById('seguridad-card');
    const overlay = document.getElementById('seguridad-overlay');
    const esObligatorio = overlay.dataset.obligatorio === "true";
    
    if (card.classList.contains('seguridad-mini')) {
        card.classList.remove('seguridad-mini');
        if (esObligatorio) overlay.classList.add('bg-slate-950/70', 'backdrop-blur-md');
    } else {
        card.classList.remove('seguridad-expanded');
        card.classList.add('seguridad-mini');
        overlay.classList.remove('bg-slate-950/70', 'backdrop-blur-md');
        
        card.onclick = function(e) {
            if(card.classList.contains('seguridad-mini')) {
                minimizarSeguridad();
                card.onclick = null; 
            }
        };
    }
};

window.expandirSeguridad = function() {
    const card = document.getElementById('seguridad-card');
    if (card.classList.contains('seguridad-mini')) minimizarSeguridad(); 
    
    if (card.classList.contains('seguridad-expanded')) {
        card.classList.remove('seguridad-expanded');
    } else {
        card.classList.add('seguridad-expanded');
    }
};


window.minimizarTerminos = function() {
    const card = document.getElementById('terminos-card');
    const overlay = document.getElementById('terminos-overlay');
    
    if (card.classList.contains('terminos-mini')) {
        card.classList.remove('terminos-mini');
        if(terminosModoObligatorio) overlay.classList.add('bg-slate-900/80', 'backdrop-blur-md');
    } else {
        card.classList.remove('terminos-expanded');
        card.classList.add('terminos-mini');
        overlay.classList.remove('bg-slate-900/80', 'backdrop-blur-md');
        
        card.onclick = function(e) {
            if(card.classList.contains('terminos-mini')) {
                minimizarTerminos();
                card.onclick = null; 
            }
        };
    }
};

window.expandirTerminos = function() {
    const card = document.getElementById('terminos-card');
    if (card.classList.contains('terminos-mini')) minimizarTerminos(); 
    
    if (card.classList.contains('terminos-expanded')) {
        card.classList.remove('terminos-expanded');
    } else {
        card.classList.add('terminos-expanded');
    }
};