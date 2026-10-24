// cargar_modales.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('modales.html')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los modales');
            return response.text();
        })
        .then(html => {
            // Se inserta el HTML de los modales directamente en el body
            document.body.insertAdjacentHTML('beforeend', html);
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