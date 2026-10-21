/**
 * ============================================================
 * LAZY LOADER + SPA CONTROLLER
 * Carga secciones bajo demanda y gestiona el ciclo de vida 3D
 * ============================================================
 */
(function () {
    'use strict';

    // ============================================================
    // REGISTRO DE SECCIONES
    // ============================================================
    const SECTIONS = {
        embriologia: {
            ids: ['embriologia-flashcards', 'embriologia-cuadros'],
            scripts: [],            // Ya está en el HTML principal
            loaded: false,
            initializer: null       // Ya se inicializa con DOMContentLoaded
        },
        anatomia: {
            ids: ['Anato'],
            scripts: [],
            loaded: false,
            initializer: null
        },
        histologia: {
            ids: ['Histologia'],
            scripts: [],            // Se inicializa en script.js
            loaded: false,
            initializer: 'initHistologia'
        },
        bioquimica: {
            ids: ['Bioquimica'],
            scripts: [],
            loaded: false,
            initializer: 'initBioquimica'
        },
        fisiologia: {
            ids: ['Fisiologia'],
            scripts: ['script_fisiologia.js'],  // ← Se carga solo al entrar
            loaded: false,
            initializer: 'initFisiologia'
        },
        psicologia: {
            ids: ['Psicologia'],
            scripts: ['script_psicologia.js'],  // ← Se carga solo al entrar
            loaded: false,
            initializer: 'initPsicologia'
        },
        bibliografia: {
            ids: ['Bibliografia'],
            scripts: ['script_bibliografia.js'],  // ← Se carga solo al entrar
            loaded: false,
            initializer: 'initBibliografia'
        }
    };

    // ============================================================
    // ESTADO GLOBAL
    // ============================================================
    let currentSection = 'embriologia';
    let isNavigating = false;
    const sectionCache = {}; // Cache de inicializadores ya ejecutados

    // ============================================================
    // UTILIDADES
    // ============================================================
    function getSectionEls(sectionKey) {
        const cfg = SECTIONS[sectionKey];
        if (!cfg) return [];
        return cfg.ids
            .map(id => document.getElementById(id))
            .filter(Boolean);
    }

    function showLoadingOverlay() {
        const overlay = document.getElementById('nav-loading-overlay');
        if (overlay) overlay.classList.remove('hidden');
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('nav-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.classList.add('hidden'), 250);
        }
    }

    // ============================================================
    // GESTIÓN DE CICLO DE VIDA 3D
    // ============================================================
    function pauseAllRenderers() {
        // Pausa los renderers de fisiología si existen
        if (window.__cardiacRenderer) {
            window.__cardiacRenderer.isPaused = true;
        }
        if (window.__nephronRenderer) {
            window.__nephronRenderer.isPaused = true;
        }
        // Pausa Lottie de fondo (no crítico pero ahorra CPU)
        if (window.__bgLotties && Array.isArray(window.__bgLotties)) {
            window.__bgLotties.forEach(a => a && a.pause && a.pause());
        }
        // Cancela locución de notas de voz si está activa
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    function resumeAllRenderers() {
        if (window.__cardiacRenderer) {
            window.__cardiacRenderer.isPaused = false;
            window.__cardiacRenderer.lastTimestamp = 0; // Evita salto de tiempo
        }
        if (window.__nephronRenderer) {
            window.__nephronRenderer.isPaused = false;
        }
    }

    // ============================================================
    // CARGA DINÁMICA DE SCRIPTS
    // ============================================================
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Evita recargar si ya está en el DOM
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.async = false;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Error cargando ${src}`));
            document.body.appendChild(s);
        });
    }

    // ============================================================
    // INICIALIZADORES POR SECCIÓN (idempotentes)
    // ============================================================
    const initializers = {
        embriologia: () => {
            // Ya corre con DOMContentLoaded en script.js
            if (typeof window.renderHistologiaView === 'function') return;
        },
        anatomia: () => {
            // Listeners ya en script.js (openAnatomyModal es global)
        },
        histologia: () => {
            if (typeof window.initHistologia === 'function') {
                window.initHistologia();
            } else {
                console.warn('[SPA] initHistologia no disponible. ¿Se cargó script.js?');
            }
        },
        bioquimica: () => {
            if (window.__bioquimicaInit) return;
            window.__bioquimicaInit = true;
            // Los juegos se inicializan al hacer clic
        },
        fisiologia: () => {
            if (window.__fisiologiaInit) return;
            window.__fisiologiaInit = true;
            // initFisioTabs + initCardiacSimulator + initNephronNavigator
            // se ejecutan dentro de script_fisiologia.js al cargarse
            // Pero como DOMContentLoaded ya pasó, ejecutamos manualmente:
            if (typeof window.__manualInitFisio === 'function') {
                window.__manualInitFisio();
            }
        },
        psicologia: () => {
            if (window.__psicologiaInit) return;
            window.__psicologiaInit = true;
            if (typeof window.__manualInitPsicologia === 'function') {
                window.__manualInitPsicologia();
            }
        },
        bibliografia: () => {
            if (window.__bibliografiaInit) return;
            window.__bibliografiaInit = true;
            if (typeof window.__manualInitBibliografia === 'function') {
                window.__manualInitBibliografia();
            }
        }
    };

    // ============================================================
    // NAVEGACIÓN PRINCIPAL
    // ============================================================
    async function navigateTo(sectionKey) {
        if (isNavigating) return;
        if (sectionKey === currentSection && SECTIONS[sectionKey].loaded) return;
        if (!SECTIONS[sectionKey]) return;

        isNavigating = true;
        showLoadingOverlay();

        // 1) Pausar renderers de la sección actual
        pauseAllRenderers();

        // 2) Ocultar secciones actuales
        getSectionEls(currentSection).forEach(el => {
            el.classList.remove('spa-active');
            el.classList.add('spa-section');
            el.style.display = 'none';
        });

        // 3) Dar tiempo a la animación de carga (mínimo perceptible)
        const minDelay = new Promise(r => setTimeout(r, 450));

        try {
            const cfg = SECTIONS[sectionKey];

            // 4) Cargar scripts bajo demanda
            if (cfg.scripts.length) {
                await Promise.all(cfg.scripts.map(loadScript));
            }

            // 5) Inicializar la sección si es la primera vez
            if (!cfg.loaded) {
                if (typeof initializers[sectionKey] === 'function') {
                    initializers[sectionKey]();
                }
                cfg.loaded = true;
            }

            await minDelay;

            // 6) Mostrar nuevas secciones
            const newEls = getSectionEls(sectionKey);
            newEls.forEach(el => {
                el.classList.remove('spa-section');
                el.classList.add('spa-active');
                el.style.display = '';
            });

            // 7) Reanudar renderers
            resumeAllRenderers();

            // 8) Disparar resize para que Three.js recalcule canvas
            window.dispatchEvent(new Event('resize'));

            currentSection = sectionKey;
        } catch (err) {
            console.error('[SPA] Error navegando a', sectionKey, err);
        } finally {
            setTimeout(() => {
                hideLoadingOverlay();
                isNavigating = false;
            }, 250);
        }
    }

    // ============================================================
    // INTERCEPTAR CLICS DEL MENÚ
    // ============================================================
    const SECTION_MAP = {
        '#Embrio': 'embriologia',
        '#Anato': 'anatomia',
        '#Histologia': 'histologia',
        '#Bioquimica': 'bioquimica',
        '#Fisiologia': 'fisiologia',
        '#Fisio-sistemas': 'fisiologia',
        '#Psicologia': 'psicologia',
        '#Bibliografia': 'bibliografia'
    };

    function interceptNavLinks() {
        document.querySelectorAll('.nav__link').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !SECTION_MAP[href]) return;

            // ⚠️ EXCLUIR el botón "Más": debe seguir abriendo el submenú
            if (link.id === 'fisio-link') return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = SECTION_MAP[href];
                navigateTo(section);

                // Refrescar estado visual del menú
                document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active-link'));
                link.classList.add('active-link');
            });
        });

        document.querySelectorAll('.capsule-item').forEach(item => {
            const href = item.getAttribute('href');
            if (!href || !SECTION_MAP[href]) return;

            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = SECTION_MAP[href];
                navigateTo(section);

                // Marcar "Más" como activo (porque la cápsula vive dentro de él)
                document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active-link'));
                const fisioLink = document.getElementById('fisio-link');
                if (fisioLink) {
                    fisioLink.classList.add('active-link');
                    if (typeof moveIndicator === 'function') moveIndicator(fisioLink);
                }

                // Cerrar submenú explícitamente (por si acaso)
                const submenu = document.getElementById('fisio-submenu');
                if (submenu) submenu.classList.remove('active');
            });
        });

        document.querySelectorAll('.fab-pill-option.nav-fab-link').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !SECTION_MAP[href]) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = SECTION_MAP[href];
                navigateTo(section);

                // Cerrar FAB
                const fab = document.querySelector('.fab-menu-container');
                if (fab) fab.classList.remove('open');
            });
        });
    }

    function bootstrap() {
        // 1) Ocultar todas las secciones excepto Embriología
        Object.keys(SECTIONS).forEach(key => {
            if (key === 'embriologia') return;
            getSectionEls(key).forEach(el => {
                el.classList.add('spa-section');
                el.style.display = 'none';
            });
        });
        // 2) Marcar Embriología como activa y cargada
        getSectionEls('embriologia').forEach(el => {
            el.classList.add('spa-active');
        });
        SECTIONS.embriologia.loaded = true;

        // 3) Interceptar clics
        interceptNavLinks();

        // 4) Exponer API global
        window.SPA = {
            navigateTo,
            getCurrent: () => currentSection,
            getSections: () => SECTIONS
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();