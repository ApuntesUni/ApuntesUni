// cargar_modales.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('modales.html')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los modales');
            return response.text();
        })
        .then(html => {
            
            document.body.insertAdjacentHTML('beforeend', html);
            
            
            inicializarEventosBreak();
        })
        .catch(error => console.error('Error cargando modales:', error));
});

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

window.saltarEncuesta = function() {
    const overlay = document.getElementById('seguridad-overlay');
    const card = document.getElementById('seguridad-card');
    
    // Desactivamos el candado de obligatoriedad para permitir el cierre
    overlay.dataset.obligatorio = "false";
    
    // Animación de cierre
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    // Ocultar del DOM tras finalizar la animación
    setTimeout(() => {
        overlay.classList.add('hidden');
        card.classList.remove('seguridad-mini', 'seguridad-expanded');
    }, 500);
};

/* ---------------------------------------------------- Lógica de Tarjeta de Nosotros ------------------------------------------------ */

window.abrirNosotros = function(event) {
    if (event) event.preventDefault();
    const overlay = document.getElementById('nosotros-overlay');
    const card = document.getElementById('nosotros-card');

    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
};

window.cerrarNosotros = function() {
    const overlay = document.getElementById('nosotros-overlay');
    const card = document.getElementById('nosotros-card');
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        card.classList.remove('nosotros-mini', 'nosotros-expanded');
    }, 500);
};

window.minimizarNosotros = function() {
    const card = document.getElementById('nosotros-card');
    
    if (card.classList.contains('nosotros-mini')) {
        card.classList.remove('nosotros-mini');
    } else {
        card.classList.remove('nosotros-expanded');
        card.classList.add('nosotros-mini');
        
        card.onclick = function(e) {
            if(card.classList.contains('nosotros-mini')) {
                minimizarNosotros();
                card.onclick = null; 
            }
        };
    }
};

window.expandirNosotros = function() {
    const card = document.getElementById('nosotros-card');
    
    if (card.classList.contains('nosotros-mini')) minimizarNosotros(); 
    
    if (card.classList.contains('nosotros-expanded')) {
        card.classList.remove('nosotros-expanded');
    } else {
        card.classList.add('nosotros-expanded');
    }
};

/* ---------------------------------------------------- Lógica de Tarjeta de Servicios ------------------------------------------------ */

window.abrirServicios = function(event) {
    if (event) event.preventDefault();
    const overlay = document.getElementById('servicios-overlay');
    const card = document.getElementById('servicios-card');
    
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
};

window.cerrarServicios = function() {
    const overlay = document.getElementById('servicios-overlay');
    const card = document.getElementById('servicios-card');
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        card.classList.remove('servicios-mini', 'servicios-expanded');
    }, 500);
};

window.minimizarServicios = function() {
    const card = document.getElementById('servicios-card');
    
    if (card.classList.contains('servicios-mini')) {
        card.classList.remove('servicios-mini');
    } else {
        card.classList.remove('servicios-expanded');
        card.classList.add('servicios-mini');
        
        card.onclick = function(e) {
            if(card.classList.contains('servicios-mini')) {
                minimizarServicios();
                card.onclick = null; 
            }
        };
    }
};

window.expandirServicios = function() {
    const card = document.getElementById('servicios-card');
    
    if (card.classList.contains('servicios-mini')) minimizarServicios(); 
    
    if (card.classList.contains('servicios-expanded')) {
        card.classList.remove('servicios-expanded');
    } else {
        card.classList.add('servicios-expanded');
    }
};

/* ---------------------------------------------------- ventana break ------------------------------------------------ */

/* ---------------------------------------------------- Lógica del Modo Break y Técnicas de Respiración Clínica ------------------------------------------------ */

const clinicalBreathingTechniques = {
    'tcc': {
        id: 'tcc',
        title: 'TCC · Diafragmática',
        badge: 'TCC · Ansiedad y Pánico',
        cssClass: 'tcc',
        cycleInfo: 'Ciclo 12s · 4-2-6',
        description: 'La respiración diafragmática es el estándar clínico para tratar el trastorno de pánico y la ansiedad generalizada. Se prescribe como un "interruptor" físico para romper el ciclo de hiperventilación y taquicardia que alimenta los pensamientos catastróficos, a menudo combinada con la Relajación Muscular Progresiva.',
        cardTitleHtml: `Respiración <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 font-black">Diafragmática</span><br><span class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 block">Estándar clínico TCC para romper el ciclo de hiperventilación y pensamientos catastróficos.</span>`,
        phases: [
            { name: 'Inhala', duration: 4, instruction: 'Infla tu abdomen suavemente por la nariz' },
            { name: 'Pausa', duration: 2, instruction: 'Siente el aire y relaja los hombros' },
            { name: 'Exhala', duration: 6, instruction: 'Exhala lento y prolongado por la boca' }
        ]
    },
    'tept': {
        id: 'tept',
        title: 'TEPT · Cuadrada (4x4)',
        badge: 'TEPT · Anclaje Somático',
        cssClass: 'tept',
        cycleInfo: 'Ciclo 16s · 4-4-4-4',
        description: 'La respiración cuadrada (4x4) se utiliza como técnica de anclaje (grounding). Cuando un paciente experimenta disociación, desrealización o hiperactivación del sistema nervioso debido a un trauma, este patrón de respiración rígido le ayuda a reconectar con su cuerpo en el presente y a recuperar el control de la corteza prefrontal.',
        cardTitleHtml: `Respiración <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 font-black">Cuadrada 4x4</span><br><span class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 block">Técnica de anclaje somático (grounding) para reconectar con el presente y la corteza prefrontal.</span>`,
        phases: [
            { name: 'Inhala', duration: 4, instruction: 'Inhala conectando con tu cuerpo y tu entorno' },
            { name: 'Mantén', duration: 4, instruction: 'Mantén el aire con calma y presencia plena' },
            { name: 'Exhala', duration: 4, instruction: 'Exhala constante vaciando tus pulmones' },
            { name: 'Mantén vacío', duration: 4, instruction: 'Pausa serena en el momento presente' }
        ]
    },
    'tdc': {
        id: 'tdc',
        title: 'TDC · Técnica 4-7-8',
        badge: 'TDC / MBCT · Tolerancia al Malestar',
        cssClass: 'tdc',
        cycleInfo: 'Ciclo 19s · 4-7-8',
        description: 'Técnicas como la 4-7-8 y adaptaciones de la respiración alterna se enseñan específicamente en los módulos de Tolerancia al Malestar. Su objetivo es dar al paciente una herramienta física para soportar crisis emocionales agudas sin recurrir a conductas impulsivas o autodestructivas.',
        cardTitleHtml: `Técnica <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-black">4-7-8</span><br><span class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 block">Módulo de Tolerancia al Malestar (TDC) para calmar crisis agudas y prevenir impulsividad.</span>`,
        phases: [
            { name: 'Inhala', duration: 4, instruction: 'Inhala silencioso y profundo por la nariz' },
            { name: 'Mantén', duration: 7, instruction: 'Retén el aire con quietud mental absoluta' },
            { name: 'Exhala', duration: 8, instruction: 'Exhala lento y completo por la boca' }
        ]
    },
    'biofeedback': {
        id: 'biofeedback',
        title: 'Biofeedback · VFC',
        badge: 'Biofeedback · Biomarcadores VFC',
        cssClass: 'biofeedback',
        cycleInfo: 'Ciclo 10s · 6 rpm (0.1 Hz)',
        description: 'En la práctica clínica moderna, estas técnicas se combinan con tecnología. Se conectan sensores al paciente para medir su variabilidad de la frecuencia cardíaca (VFC) mientras respira. Ver en una pantalla cómo la respiración altera directamente sus biomarcadores refuerza la adherencia al tratamiento, un principio fundamental al diseñar sistemas de software y aplicaciones de salud activa para el monitoreo de pacientes.',
        cardTitleHtml: `Coherencia <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 font-black">Cardíaca (VFC)</span><br><span class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 block">Biorretroalimentación sincronizando respiración con la variabilidad de la frecuencia cardíaca.</span>`,
        phases: [
            { name: 'Inhala', duration: 5, instruction: 'Inhala al ritmo de la onda de coherencia cardíaca' },
            { name: 'Exhala', duration: 5, instruction: 'Exhala sincronizando tu resonancia y ritmo cardíaco' }
        ]
    },
    'estandar_5min': {
        id: 'estandar_5min',
        title: 'Break 5 min',
        badge: 'Bienestar · Descanso',
        cssClass: 'standard',
        cycleInfo: 'Ciclo 8s · 4-4',
        description: 'Pausa reparadora de 5 minutos para descansar la vista y despejar la mente.',
        phases: [
            { name: 'Inhala', duration: 4, instruction: 'Inhala con calma y suavidad' },
            { name: 'Exhala', duration: 4, instruction: 'Exhala despacio y relájate' }
        ]
    },
    'personalizado': {
        id: 'personalizado',
        title: 'Break Personalizado',
        badge: 'Bienestar · Personalizado',
        cssClass: 'standard',
        cycleInfo: 'Ciclo 8s · 4-4',
        description: 'Descanso a tu propio ritmo para despejarte y estirarte.',
        phases: [
            { name: 'Inhala', duration: 4, instruction: 'Inhala profundamente' },
            { name: 'Exhala', duration: 4, instruction: 'Exhala con suavidad y suelta tensión' }
        ]
    }
};

let breakActive = false;
let breakTimerInterval = null;
let breakPhaseInterval = null;
let breakTimeLeft = 300;
let currentActiveTechnique = clinicalBreathingTechniques['estandar_5min'];
let currentPhaseIndex = 0;
let phaseSecondsLeft = 4;
let activeCardsList = [];

// Control de selección en el modal
let customSelectedMinutes = 10;
let selectedTechDurationMinutes = 5;

function abrirModalBreak() {
    const fabMenuContainer = document.querySelector('.fab-menu-container');
    if (fabMenuContainer && fabMenuContainer.classList.contains('open')) {
        fabMenuContainer.classList.remove('open');
    }

    const modal = document.getElementById('modal-break-selector');
    const card = document.getElementById('break-modal-card');
    if (!modal) return;

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        if (card) {
            card.classList.remove('scale-95');
            card.classList.add('scale-100');
        }
    });
    modal.setAttribute('aria-hidden', 'false');
}

function cerrarModalBreak() {
    const modal = document.getElementById('modal-break-selector');
    const card = document.getElementById('break-modal-card');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
    if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function iniciarBreak(tipo, opciones = {}) {
    cerrarModalBreak();

    const headerMenu = document.getElementById('header-menu');
    const mainNavList = document.getElementById('main-nav-list');
    const mainFabToggle = document.getElementById('mainFabToggle');
    const breathingDisplay = document.getElementById('breathing-display');
    const breathingText = document.getElementById('breathing-text');
    const breathingTimer = document.getElementById('breathing-timer');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const breathingPhaseTimer = document.getElementById('breathing-phase-timer');
    const breathingTitle = document.getElementById('breathing-technique-title');
    const breathingCycle = document.getElementById('breathing-cycle-info');
    const blurOverlay = document.getElementById('break-blur-overlay');

    // Referencias a los contenedores que vamos a alternar
    const medalsContainer = document.getElementById('medals-container');
    const breathingCenterInfo = document.getElementById('breathing-center-info'); 
    const dynamicBreakCard = document.getElementById('dynamic-break-card');
    const clinicalBreathingUi = document.getElementById('clinical-breathing-ui');
    const clinicalPhaseText = document.getElementById('clinical-phase-text');
    const clinicalInstructionText = document.getElementById('clinical-instruction-text');
    const clinicalTimerText = document.getElementById('clinical-timer-text');

    const isClinical = (tipo === 'tecnica');

    // Configurar técnica y duración
    if (tipo === 'estandar_5min') {
        currentActiveTechnique = clinicalBreathingTechniques['estandar_5min'];
        breakTimeLeft = 300;
    } else if (tipo === 'personalizado') {
        const mins = opciones.minutos || customSelectedMinutes || 10;
        currentActiveTechnique = Object.assign({}, clinicalBreathingTechniques['personalizado'], {
            title: `Break ${mins} min`
        });
        breakTimeLeft = mins * 60;
    } else if (tipo === 'tecnica') {
        const techKey = opciones.tecnicaId || 'tcc';
        const mins = opciones.minutos || selectedTechDurationMinutes || 5;
        currentActiveTechnique = clinicalBreathingTechniques[techKey] || clinicalBreathingTechniques['tcc'];
        breakTimeLeft = mins * 60;
    }

    breakActive = true;
    detenerTarjetasDinamicas(); // Siempre detenemos posibles tarjetas previas

    // Actualizar menú y barra superior
    if (mainNavList) mainNavList.style.display = 'none';
    if (mainFabToggle) mainFabToggle.style.display = 'none';
    if (breathingDisplay) {
        breathingDisplay.classList.remove('hidden');
        breathingDisplay.classList.add('flex');
    }

    // Configurar clases dinámicas para la barra del menú
    if (headerMenu) {
        headerMenu.classList.remove(
            'breathing-active-desktop',
            'breathing-active-mobile',
            'technique-standard',
            'technique-tcc',
            'technique-tept',
            'technique-tdc',
            'technique-biofeedback'
        );

        const techCssClass = 'technique-' + (currentActiveTechnique.cssClass || 'standard');
        if (window.innerWidth <= 1150) {
            headerMenu.classList.add('breathing-active-mobile', techCssClass);
        } else {
            headerMenu.classList.add('breathing-active-desktop', techCssClass);
        }
    }

    // Título y ciclo en la barra
    if (breathingTitle) breathingTitle.textContent = currentActiveTechnique.title;
    if (breathingCycle) breathingCycle.textContent = currentActiveTechnique.cycleInfo;

    // Activar overlay
    if (blurOverlay) {
        blurOverlay.classList.add('is-active');
        blurOverlay.setAttribute('aria-hidden', 'false');
    }

    // LÓGICA CONDICIONAL DE VISIBILIDAD
    if (isClinical) {
        if (medalsContainer) medalsContainer.style.display = 'none';
        if (breathingCenterInfo) breathingCenterInfo.style.display = 'none';
        if (dynamicBreakCard) dynamicBreakCard.style.display = 'none';
        if (clinicalBreathingUi) {
            clinicalBreathingUi.classList.remove('hidden');
            clinicalBreathingUi.classList.add('flex');
            
            // Aplicar colores correctos al texto principal según la técnica
            if (clinicalPhaseText) {
                clinicalPhaseText.className = 'text-6xl md:text-8xl font-black text-transparent bg-clip-text mb-4 drop-shadow-lg transition-opacity duration-300 bg-gradient-to-r';
                if (currentActiveTechnique.id === 'tcc') clinicalPhaseText.classList.add('from-blue-500', 'to-indigo-500');
                else if (currentActiveTechnique.id === 'tept') clinicalPhaseText.classList.add('from-emerald-500', 'to-teal-500');
                else if (currentActiveTechnique.id === 'tdc') clinicalPhaseText.classList.add('from-purple-500', 'to-pink-500');
                else if (currentActiveTechnique.id === 'biofeedback') clinicalPhaseText.classList.add('from-pink-500', 'to-rose-500');
                else clinicalPhaseText.classList.add('from-blue-500', 'to-indigo-500'); // Fallback
            }
        }
    } else {
        if (medalsContainer) medalsContainer.style.display = ''; 
        if (breathingCenterInfo) breathingCenterInfo.style.display = 'flex';
        if (dynamicBreakCard) dynamicBreakCard.style.display = ''; 
        if (clinicalBreathingUi) {
            clinicalBreathingUi.classList.add('hidden');
            clinicalBreathingUi.classList.remove('flex');
        }
        // Las tarjetas dinámicas rotativas solo se inicializan en los breaks estándar/personalizados
        iniciarTarjetasDinamicas(currentActiveTechnique);
    }

    // Inicializar primera fase
    currentPhaseIndex = 0;
    const initialPhase = currentActiveTechnique.phases[0];
    phaseSecondsLeft = initialPhase.duration;
    aplicarFaseUI(initialPhase, phaseSecondsLeft);
    actualizarTimerText();

    // Cuenta regresiva principal
    clearInterval(breakTimerInterval);
    breakTimerInterval = setInterval(() => {
        breakTimeLeft--;
        actualizarTimerText();
        if (breakTimeLeft <= 0) detenerBreak();
    }, 1000);

    // Fases de respiración (Inhala, Mantén, Exhala)
    clearInterval(breakPhaseInterval);
    breakPhaseInterval = setInterval(() => {
        phaseSecondsLeft--;

        if (phaseSecondsLeft <= 0) {
            currentPhaseIndex = (currentPhaseIndex + 1) % currentActiveTechnique.phases.length;
            const nextPhase = currentActiveTechnique.phases[currentPhaseIndex];
            phaseSecondsLeft = nextPhase.duration;

            // Transición suave
            if (breathingText) breathingText.style.opacity = 0;
            if (breathingInstruction) breathingInstruction.style.opacity = 0;
            const avatarContainer = document.getElementById('avatar-container');
            if (isClinical) {
                if (clinicalPhaseText) clinicalPhaseText.style.opacity = 0;
                if (clinicalInstructionText) clinicalInstructionText.style.opacity = 0;
                if (avatarContainer) avatarContainer.style.opacity = 0;
            }

            setTimeout(() => {
                aplicarFaseUI(nextPhase, phaseSecondsLeft);
                if (breathingText) breathingText.style.opacity = 1;
                if (breathingInstruction) breathingInstruction.style.opacity = 1;
                if (isClinical) {
                    if (clinicalPhaseText) clinicalPhaseText.style.opacity = 1;
                    if (clinicalInstructionText) clinicalInstructionText.style.opacity = 1;
                    if (avatarContainer) avatarContainer.style.opacity = 1;
                }
            }, 250);
        } else {
            const phaseTimerElem = document.getElementById('breathing-phase-timer');
            if (phaseTimerElem) phaseTimerElem.textContent = `${phaseSecondsLeft}s`;
            if (isClinical && clinicalTimerText) clinicalTimerText.textContent = `${phaseSecondsLeft}s`;
        }
    }, 1000);

    
    function aplicarFaseUI(phase, secs) {
        if (breathingText) breathingText.textContent = phase.name;
        if (breathingInstruction) breathingInstruction.textContent = phase.instruction;
        const phaseTimerElem = document.getElementById('breathing-phase-timer');
        if (phaseTimerElem) phaseTimerElem.textContent = `${secs}s`;

        if (isClinical) {
            if (clinicalPhaseText) clinicalPhaseText.textContent = phase.name;
            if (clinicalInstructionText) clinicalInstructionText.textContent = phase.instruction;
            if (clinicalTimerText) clinicalTimerText.textContent = `${secs}s`;

            const avatarImg = document.getElementById('clinical-avatar');
            if (avatarImg) {
                const phaseNameNormalized = phase.name.toLowerCase();
                
                if (phaseNameNormalized.includes('inhala')) {
                    avatarImg.src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYaInD8vLXO8wyw8gznMvjXF5O-xWKc4f0I6i4NjHnRqPQHbwi6DcUmEt47bYJ1VcCRqcMbjAc3P2-CmB3NKWFzb-ibq9qD4HRq7cLemuGybs5IgDQo_1k7p6iKpCukj9QkfYV2b-yzMNc2mOENDNuVTsAAe07-vp1bBVGkrDH3QIUEPHPyqDCbiYFmZE/s2048/1793310874497.png'; 
                } else if (phaseNameNormalized.includes('mantén') || phaseNameNormalized.includes('manten') || phaseNameNormalized.includes('retiene')) {
                    avatarImg.src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyI7aZzMnDIZkM3UM4LBKpmBIOx1HxI3x7iFyASHKKHxtVO36lapfuUROQNU6KfwMoVOtMI_n1vcFYkI9XOXj9l29RW7Zojot6TrddwI9alGd8mWe18szRNacDSZxU8tzp07OzMkhK8gxv3Arooc1khrWNbIY0L7tvYEA7zYmGdeKqVkeZ06jG-Ab7XWk/s2048/1793310912263.png';
                } else if (phaseNameNormalized.includes('exhala')) {
                    avatarImg.src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjw8MxOrq8H2LvB7hMd-EbgP4UwR3oppN1uivCC5-CgJdWImVjr1ah5QMw1R8fAdsLdxRZy-XpPSCfjweOaBk874LFCNPEPz91iG0tt5u9igYUQPqOZpeMGQNT5bYFbElpLqIpStHO2A-Yfbh91ln__N5bOgoRxlImQ4t6aBrkG_kdlCnkY6Slh6tZDazs/s2048/1793310897349.png';
                }
            }
        }
    }

    function actualizarTimerText() {
        if (!breathingTimer) return;
        const safeLeft = Math.max(0, breakTimeLeft);
        const m = Math.floor(safeLeft / 60).toString().padStart(2, '0');
        const s = (safeLeft % 60).toString().padStart(2, '0');
        breathingTimer.textContent = `${m}:${s}`;
    }
}

function detenerBreak() {
    breakActive = false;
    clearInterval(breakTimerInterval);
    clearInterval(breakPhaseInterval);

    detenerTarjetasDinamicas();

    const headerMenu = document.getElementById('header-menu');
    const mainNavList = document.getElementById('main-nav-list');
    const mainFabToggle = document.getElementById('mainFabToggle');
    const breathingDisplay = document.getElementById('breathing-display');
    const blurOverlay = document.getElementById('break-blur-overlay');
    
    const medalsContainer = document.getElementById('medals-container');
    const breathingCenterInfo = document.getElementById('breathing-center-info');
    const dynamicBreakCard = document.getElementById('dynamic-break-card');
    const clinicalBreathingUi = document.getElementById('clinical-breathing-ui');

    if (headerMenu) {
        headerMenu.classList.remove(
            'breathing-active-desktop',
            'breathing-active-mobile',
            'technique-standard',
            'technique-tcc',
            'technique-tept',
            'technique-tdc',
            'technique-biofeedback'
        );
    }

    if (breathingDisplay) {
        breathingDisplay.classList.remove('flex');
        breathingDisplay.classList.add('hidden');
    }

    if (mainNavList) mainNavList.style.display = '';
    if (mainFabToggle) mainFabToggle.style.display = '';

    if (blurOverlay) {
        blurOverlay.classList.remove('is-active');
        blurOverlay.setAttribute('aria-hidden', 'true');
    }

    // Restaurar siempre la vista estándar para que no se quede oculta para el futuro
    if (medalsContainer) medalsContainer.style.display = '';
    if (breathingCenterInfo) breathingCenterInfo.style.display = 'flex';
    if (dynamicBreakCard) dynamicBreakCard.style.display = '';
    if (clinicalBreathingUi) {
        clinicalBreathingUi.classList.add('hidden');
        clinicalBreathingUi.classList.remove('flex');
    }
}

function toggleBreakMode() {
    if (breakActive) {
        detenerBreak();
    } else {
        abrirModalBreak();
    }
}

window.inicializarEventosBreak = function() {
    const desktopBreakBtn = document.getElementById('desktop-break-btn');
    const mobileBreakBtn = document.getElementById('mobile-break-btn');
    const btnStopBreak = document.getElementById('btn-stop-break');
    const btnCloseBreakModal = document.getElementById('btn-close-break-modal');
    const modalSelector = document.getElementById('modal-break-selector');

    if (desktopBreakBtn) desktopBreakBtn.addEventListener('click', toggleBreakMode);
    if (mobileBreakBtn) mobileBreakBtn.addEventListener('click', toggleBreakMode);
    if (btnStopBreak) btnStopBreak.addEventListener('click', detenerBreak);
    if (btnCloseBreakModal) btnCloseBreakModal.addEventListener('click', cerrarModalBreak);

    if (modalSelector) {
        modalSelector.addEventListener('click', (e) => {
            if (e.target === modalSelector) {
                cerrarModalBreak();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalSelector && !modalSelector.classList.contains('hidden')) {
            cerrarModalBreak();
        }
    });

    // Pestañas del Modal
    const tabBtns = document.querySelectorAll('.break-tab-btn');
    const tabContents = document.querySelectorAll('.break-tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => {
                b.classList.remove('break-tab-active');
                b.classList.add('text-slate-600', 'dark:text-slate-400');
            });
            btn.classList.add('break-tab-active');
            btn.classList.remove('text-slate-600', 'dark:text-slate-400');

            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Botón Iniciar 5 Minutos
    const btnStart5min = document.getElementById('btn-start-5min');
    if (btnStart5min) {
        btnStart5min.addEventListener('click', () => {
            iniciarBreak('estandar_5min');
        });
    }

    // Píldoras rápidas de tiempo personalizado
    const customPills = document.querySelectorAll('#custom-quick-pills .custom-pill');
    const customMinutesDisplay = document.getElementById('custom-minutes-display');
    const btnStartCustomLabel = document.getElementById('btn-start-custom-label');
    const btnStartCustom = document.getElementById('btn-start-custom');
    const btnDecCustomMin = document.getElementById('btn-dec-custom-min');
    const btnIncCustomMin = document.getElementById('btn-inc-custom-min');

    function actualizarCustomDisplay(mins) {
        customSelectedMinutes = Math.max(1, Math.min(60, mins));
        if (customMinutesDisplay) customMinutesDisplay.textContent = customSelectedMinutes;
        if (btnStartCustomLabel) btnStartCustomLabel.textContent = `Iniciar Descanso de ${customSelectedMinutes} Minutos`;

        customPills.forEach(pill => {
            const pMin = parseInt(pill.getAttribute('data-mins'), 10);
            if (pMin === customSelectedMinutes) {
                pill.classList.add('active-pill');
            } else {
                pill.classList.remove('active-pill');
            }
        });
    }

    customPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const mins = parseInt(pill.getAttribute('data-mins'), 10);
            actualizarCustomDisplay(mins);
        });
    });

    if (btnDecCustomMin) {
        btnDecCustomMin.addEventListener('click', () => {
            actualizarCustomDisplay(customSelectedMinutes - 1);
        });
    }

    if (btnIncCustomMin) {
        btnIncCustomMin.addEventListener('click', () => {
            actualizarCustomDisplay(customSelectedMinutes + 1);
        });
    }

    if (btnStartCustom) {
        btnStartCustom.addEventListener('click', () => {
            iniciarBreak('personalizado', { minutos: customSelectedMinutes });
        });
    }

    // Píldoras de duración para técnicas de respiración
    const techDurPills = document.querySelectorAll('#tech-duration-pills .tech-dur-pill');
    techDurPills.forEach(pill => {
        pill.addEventListener('click', () => {
            techDurPills.forEach(p => p.classList.remove('active-tech-pill'));
            pill.classList.add('active-tech-pill');
            selectedTechDurationMinutes = parseInt(pill.getAttribute('data-tech-mins'), 10) || 5;
        });
    });

    // Botones de inicio para cada una de las 4 técnicas clínicas
    const techButtons = document.querySelectorAll('.btn-start-technique');
    techButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const techKey = btn.getAttribute('data-tech');
            iniciarBreak('tecnica', {
                tecnicaId: techKey,
                minutos: selectedTechDurationMinutes
            });
        });
    });
};

// Base de datos de las recomendaciones de Break
let dynamicCardTimer;
let currentCardIndex = 0;

// Base de datos ajustada con imágenes más pequeñas
const breakCardsData = [
    {
        badgeText: '✨ Aprovecha este break',
        titleHtml: `y escucha tu <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 font-black">canción favorita</span>`,
        pillsHtml: `
            <div class="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-2.5 rounded-[15px] border border-white/60 dark:border-slate-700 w-fit mt-4 shadow-sm">
                <div class="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <span class="material-symbols-outlined text-lg">music_note</span>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Te recomiendo:</p>
                    <p class="text-xs font-black text-[var(--black-color)]">Perdón por la intensidad</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">SinVoz</p>
                </div>
                <button class="ml-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform hover:scale-105 shadow-md">
                    <i class="ri-play-fill text-lg"></i>
                </button>
            </div>
        `,
        // Imagen más pequeña (w-44 md:w-52)
        imageHtml: `
            <img src="tarjeta_musica.png" alt="Música Claro" class="asset-light w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
            <img src="tarjeta_musica_oscuro.png" alt="Música Oscuro" class="asset-dark w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
        `,
        footerText: '<i class="ri-heart-line"></i> Buena música, mejor energía',
        bgBlobs: '<div class="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>'
    },
    {
        badgeText: '☀️ Tu bienestar importa',
        titleHtml: `Aprovecha este break<br>y toma <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-black">agüita</span><br><span class="text-slate-400 dark:text-slate-500 text-xl font-medium tracking-tight">para hidratarte</span>`,
        pillsHtml: `
            <div class="flex flex-wrap gap-2 mt-5">
                <span class="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--black-color)] border border-white/60 dark:border-slate-700 shadow-sm"><span class="material-symbols-outlined text-blue-500 text-sm">water_drop</span> Más energía</span>
                <span class="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--black-color)] border border-white/60 dark:border-slate-700 shadow-sm"><i class="ri-heart-line text-pink-500 text-sm"></i> Mejor concentración</span>
            </div>
        `,
        imageHtml: `
            <img src="tarjeta_agua.png" alt="Agüita Claro" class="asset-light w-44 md:w-52 object-contain float-anim-2 drop-shadow-2xl">
            <img src="tarjeta_agua_oscuro.png" alt="Agüita Oscuro" class="asset-dark w-44 md:w-52 object-contain float-anim-2 drop-shadow-2xl">
        `,
        footerText: '<i class="ri-arrow-right-line"></i> Pequeños hábitos, grandes cambios',
        bgBlobs: '<div class="absolute top-10 -right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>'
    },
    {
        badgeText: '🥑 Aprovecha este break',
        titleHtml: `Come algo <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 font-black">saludable</span><br><span class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 block leading-snug">Tu cuerpo también necesita<br>un buen break 🤍</span>`,
        pillsHtml: `
            <div class="flex flex-wrap gap-2 mt-5">
                <span class="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--black-color)] border border-white/60 dark:border-slate-700 shadow-sm"><i class="ri-heart-line text-purple-500 text-sm"></i> Te da energía</span>
                <span class="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--black-color)] border border-white/60 dark:border-slate-700 shadow-sm"><span class="material-symbols-outlined text-purple-500 text-sm">psychology</span> Mejora la concentración</span>
            </div>
        `,
        imageHtml: `
            <img src="tarjeta_snak.png" alt="Aguacate Claro" class="asset-light w-44 md:w-52 object-contain float-anim-3 drop-shadow-2xl">
            <img src="tarjeta_snak_oscuro.png" alt="Aguacate Oscuro" class="asset-dark w-44 md:w-52 object-contain float-anim-3 drop-shadow-2xl">
        `,
        footerText: '<i class="ri-emotion-happy-line"></i> Pequeñas decisiones, grandes cambios',
        bgBlobs: '<div class="absolute bottom-5 left-5 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>'
    },
    {
        badgeText: '💙 Momento de conexión',
        titleHtml: `Aprovecha este tiempo<br>y <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500 font-black">mandale un mensaje</span><br>a aquella persona<br>que te importa.`,
        pillsHtml: `
            <div class="flex items-center gap-3 mt-5 ml-2">
                <p class="font-['Caveat'] text-2xl md:text-3xl text-slate-500 dark:text-slate-400 leading-tight transform -rotate-3">
                    A veces, un simple<br>mensaje puede hacer<br>gran diferencia. 💙
                </p>
                <!-- Flecha curva dibujada a mano en SVG -->
                <svg width="45" height="45" viewBox="0 0 100 100" class="text-slate-400 dark:text-slate-500 mt-6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10,70 Q40,80 80,30" />
                    <path d="M55,30 L80,30 L80,55" />
                </svg>
            </div>
        `,
        imageHtml: `
            <!-- Asegúrate de tener el archivo _dark si deseas la variante, o usa la misma para ambos -->
            <img src="tarjeta_mensaje.png" alt="Mensaje Claro" class="asset-light w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
            <img src="tarjeta_mensaje_oscuro.png" alt="Mensaje Oscuro" class="asset-dark w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
        `,
        footerText: '<i class="ri-smartphone-line"></i> Conectar también es cuidarte',
        // Masas de luz ajustadas a los tonos celestes y lilas de la imagen
        bgBlobs: `
            <div class="absolute -top-10 right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div class="absolute bottom-5 left-10 w-48 h-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style="animation-delay: 2s;"></div>
        `
    },
    {
        badgeText: '<span class="material-symbols-outlined text-sm text-blue-500">fitness_center</span> Movimiento y bienestar',
        titleHtml: `Estira un poco <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 font-black">esos músculos</span><br><span class="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium mt-1 block leading-snug">para que no se atrofien<br>más de lo que ya están.</span>`,
        pillsHtml: `
            <div class="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-3 md:p-4 rounded-[20px] border border-white/60 dark:border-slate-700 w-fit mt-5 shadow-sm">
                <div class="bg-purple-100 dark:bg-purple-900/50 rounded-full w-8 h-8 flex items-center justify-center">
                    <span class="material-symbols-outlined text-purple-500 text-lg">lightbulb</span>
                </div>
                <p class="font-['Caveat'] text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-none transform -rotate-2">
                    Tu cuerpo también<br>necesita un poco de amor<br>y movimiento. 💙
                </p>
            </div>
        `,
        imageHtml: `
            <div class="relative flex justify-center items-center w-full">
                <!-- Texto flotante y flecha dibujada a mano (Oculto en móviles muy pequeños para evitar superposición) -->
                <div class="absolute right-[85%] md:right-[90%] top-1/4 hidden sm:flex flex-col items-end z-20">
                    <p class="font-['Caveat'] text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-tight text-right transform -rotate-3 mb-1">
                        Unos minutos<br>de estiramiento<br>hacen la diferencia 💙
                    </p>
                    <!-- Flecha SVG apuntando hacia el personaje -->
                    <svg width="40" height="40" viewBox="0 0 100 100" class="text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M90,70 Q60,80 20,30" />
                        <path d="M45,30 L20,30 L20,55" />
                    </svg>
                </div>
                
                <!-- Imágenes adaptativas para tema claro y oscuro -->
                <img src="tarjeta_estiramiento.png" alt="Estirar Claro" class="asset-light w-44 md:w-52 object-contain float-anim-2 drop-shadow-2xl relative z-10">
                <img src="tarjeta_estiramiento_oscuro.png" alt="Estirar Oscuro" class="asset-dark w-44 md:w-52 object-contain float-anim-2 drop-shadow-2xl relative z-10">
            </div>
        `,
        footerText: '<i class="ri-run-line"></i> Tu cuerpo te lo agradecerá',
        bgBlobs: `
            <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div class="absolute top-10 left-10 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style="animation-delay: 1.5s;"></div>
        `
    }


];

function renderDynamicCard(index) {
    const list = (activeCardsList && activeCardsList.length) ? activeCardsList : breakCardsData;
    const cardData = list[index % list.length];
    const container = document.getElementById('dynamic-break-card');
    if (!container || !cardData) return;
    
    container.classList.remove('card-fade-in');
    container.classList.add('card-fade-out');
    
    setTimeout(() => {
        container.innerHTML = `
            ${cardData.bgBlobs || ''}
            <!-- Logo superior ajustado -->
            <div class="absolute top-5 left-5 flex items-center gap-1.5 text-[var(--black-color)] font-bold text-sm z-20">
                <img src="logotipo.ico" class="w-6 h-6 rounded-md bg-white/30 p-1"> Salud Activa <span class="text-purple-500">Lab</span>
            </div>
            
            <!-- Contenedor principal con paddings y gaps reducidos -->
            <div class="w-full pt-10 pb-4 flex flex-col md:flex-row gap-6 items-center justify-between z-10 relative">
                <div class="flex-1 text-left">
                    <div class="inline-flex items-center gap-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 border border-white/80 dark:border-slate-600 mb-3 shadow-sm">
                        ${cardData.badgeText}
                    </div>
                    <!-- Título -->
                    <h2 class="text-3xl md:text-4xl font-black text-[var(--black-color)] leading-[1.1] font-['Fredoka'] tracking-tight">
                        ${cardData.titleHtml}
                    </h2>
                    ${cardData.pillsHtml}
                </div>
                <div class="flex-1 flex justify-center md:justify-end relative">
                    ${cardData.imageHtml}
                </div>
            </div>

            <!-- Footer ajustado -->
            <div class="absolute bottom-5 left-5 flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 z-20">
                ${cardData.footerText}
            </div>
        `;
        
        container.classList.remove('card-fade-out');
        container.classList.add('card-fade-in');
    }, 500); 
}


function iniciarTarjetasDinamicas(clinicalTech = null) {
    currentCardIndex = 0;
    
    if (clinicalTech && clinicalTech.cardTitleHtml) {
        activeCardsList = [
            {
                badgeText: `✨ ${clinicalTech.badge}`,
                titleHtml: clinicalTech.cardTitleHtml,
                pillsHtml: `
                    <div class="mt-4 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
                        <p class="font-medium">${clinicalTech.description}</p>
                    </div>
                `,
                imageHtml: `
                    <img src="tarjeta_mensaje.png" alt="Técnica de Respiración" class="asset-light w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
                    <img src="tarjeta_mensaje_oscuro.png" alt="Técnica de Respiración" class="asset-dark w-44 md:w-52 object-contain float-anim-1 drop-shadow-2xl">
                `,
                footerText: `<i class="ri-heart-pulse-line"></i> ${clinicalTech.cycleInfo} · Salud Activa Lab`,
                bgBlobs: '<div class="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>'
            },
            ...breakCardsData
        ];
    } else {
        activeCardsList = [...breakCardsData];
    }

    renderDynamicCard(currentCardIndex);
    
    // Rota la tarjeta cada 10 segundos
    clearInterval(dynamicCardTimer);
    dynamicCardTimer = setInterval(() => {
        const list = (activeCardsList && activeCardsList.length) ? activeCardsList : breakCardsData;
        currentCardIndex = (currentCardIndex + 1) % list.length;
        renderDynamicCard(currentCardIndex);
    }, 10000);
}

function detenerTarjetasDinamicas() {
    clearInterval(dynamicCardTimer);
}


